import React from 'react';
import Button from '@mui/material/Button';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf'

export default function Welcome(props) {
  const canvasRef = React.useRef(null);

  function handleClick({target}) {
    if (target.files.length < 1) {
      return
    }

    const selectedFile = target.files[0];
    // const reader = new FileReader();

    // // listen for 'load' events on the FileReader
    // reader.addEventListener("load", function () {
    //   // change the preview's src to be the "result" of reading the uploaded file (below)
    //   doLoad(reader.result)
    // }, false);

    // if (selectedFile) {
    //   reader.readAsDataURL(selectedFile);
    // }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // reader.onload = (event) => {
      //   console.log("!!")
      //   console.log(event.target.result)
      //   // resolve(event.target.result);
      //   doLoad(event.target.result);
      // };

      reader.addEventListener("load", function () {
        // change the preview's src to be the "result" of reading the uploaded file (below)
        doLoad(reader.result)
      }, false);

      reader.onerror = (err) => {
        reject(err);
      };

      reader.readAsDataURL(selectedFile);      
    });
    
    // const promise = new Promise(resolve => {
    //   const fileContent = ReadFile(selectedFile);
    //   resolve(fileContent);
    // });
  
    // promise.then(fileContent => {
    //   const filename = selectedFile.name;
    //   handleTxtData(filename, fileContent);
    // });
  }

  const doLoad = (pdfData) => {
    pdfjs.GlobalWorkerOptions.workerSrc = './pdf.worker.min.js'

    const filename = 'sample.pdf';
    var loadingTask = pdfjs.getDocument(filename);

    // var loadingTask = pdfjs.getDocument({data: pdfData});

    loadingTask.promise.then(
      pdf => {
        // pdfRef.current = pdf;

        const scale = 1;
        const pageNumber = 1;
        
        pdf.getPage(pageNumber).then(function(page) {
          const viewport = page.getViewport({ scale });

          // Prepare canvas using PDF page dimensions
          const canvas = canvasRef.current;
          if (canvas) {
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            const renderTask = page.render(renderContext);
            renderTask.promise.then(function() {
              // console.log("Page rendered");
            });

            // page.getTextContent().then(textContent => {
            //   // console.log(textContent);
            //   if (!textLayerRef.current) {
            //     return;
            //   }

            //   // Pass the data to the method for rendering of text over the pdf canvas.
            //   pdfjs.renderTextLayer({
            //     textContent: textContent,
            //     container: textLayerRef.current,
            //     viewport: viewport,
            //     textDivs: []
            //   });
            // });
          }
        });
      },
      reason => {
        // PDF loading error
        console.error(reason);
      }
    );
  }
  
  return (
    <div>
      <h1>Hello, {props.name}</h1>
      {/* <Button variant="contained" component="label" onChange={handleClick}>
        Load pdf
        <input type="file" accept=".pdf" hidden />
      </Button> */}
      <Button variant="contained" onClick={ () => { doLoad(); }}>
        do Load static pdf
      </Button>
      <hr />
      <canvas ref={canvasRef} />
    </div>
  );
}


