import React from 'react';
import Button from '@mui/material/Button';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf'

export default function Welcome(props) {
  const canvasRef = React.useRef(null);

  function handleClick({target}) {
    if (target.files.length < 1) {
      return
    }

    console.log("!!! load with FileReader !!!")
    const selectedFile = target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      doLoad(reader.result)
    }, false);

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  }

  const doLoad = (pdfData) => {
    pdfjs.GlobalWorkerOptions.workerSrc = './pdf.worker.min.js'

    var loadingTask = pdfjs.getDocument(pdfData);
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
      <Button variant="contained" component="label" onChange={handleClick}>
        Load pdf
        <input type="file" accept=".pdf" hidden />
      </Button>
      <hr />
      <canvas ref={canvasRef} />
    </div>
  );
}


