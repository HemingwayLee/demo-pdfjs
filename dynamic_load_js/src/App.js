import React, { useEffect, useState, useCallback, useRef } from "react";
import Button from '@mui/material/Button';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';

// do not work
// import * as fs from 'fs';

export default function Main(props) {
  const [filename, setFilename] = React.useState('');
  
  function loadFile(path) {
    return new Promise((res, rej) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          rej(err);
          return;
        }
        res(data);
      });
    });
  }

  async function decodePdfPage(page) {
    const scale = 1.0;
    const viewport = page.getViewport({ scale: scale });

    console.log(viewport)

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    await page.render(renderContext).promise;
    const data = canvas.toDataURL('image/png');

    return data;
  }

  async function handleClick({target}) {
    if (target.files.length < 1) {
      return
    }

    const selectedFile = target.files[0];
    const filename = selectedFile.name;

    // const fileBuffer = await loadFile(filename);
    // console.log(fileBuffer);

    const reader = new FileReader();
    reader.addEventListener("load", function () {
      // doLoad(reader.result)
      doLoad(this.result)
    }, false);
    reader.readAsArrayBuffer(selectedFile);
  }

  async function doLoad(pdfData) {
    pdfjs.GlobalWorkerOptions.workerSrc = './pdf.worker.min.js'

    const pdf = await pdfjs.getDocument({
      data: pdfData,
      cMapUrl: './cmaps/',
      cMapPacked: true
    }).promise;
    
    let pages = [];
    for (let i=1; i <= pdf.numPages; i++) {
      console.log(i);
      pages.push(await decodePdfPage(await pdf.getPage(i)));
    }

    return pages;
  }
  
  return (
    <div>
      <h1>Hello, {props.name}</h1>
      <Button variant="contained" component="label" onChange={handleClick}>
        Load pdf
        <input type="file" accept=".pdf" hidden />
      </Button>
      <hr />
      
    </div>
  );
}
