import React, { useEffect, useState, useCallback, useRef } from "react";
import Button from '@mui/material/Button';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// do not work
// import * as fs from 'fs';

export default function Main(props) {
  const [filename, setFilename] = React.useState('');
  const [pages, setPages] = React.useState([]);
  
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

  const addPage = (newPage) => {
    setPages((prevPage) => [...prevPage, newPage]);
  };

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
      const thePage = await decodePdfPage(await pdf.getPage(i));
      // pages.push(thePage);
      addPage(thePage)
    }

    return pages;
  }

  return (
    <div>
      <h1>Hello, {props.name}</h1>
      <Tooltip title="The arrow will shake while loading" placement="right" arrow>
        <Button variant="contained" component="label" onChange={handleClick}>
          Load pdf
          <input type="file" accept=".pdf" hidden />
        </Button>
      </Tooltip>
      <hr />
      <List>
        {
          pages.map((page, i) => (
            <ListItem key={`item-${i}`}>
              <img src={page}>
              </img>
            </ListItem>
          ))
        }
      </List>
    </div>
  );
}
