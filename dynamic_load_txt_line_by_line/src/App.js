import React from 'react';
import Button from '@mui/material/Button';

export default function Main(props) {
  const [filename, setFilename] = React.useState('');
  const [fileContent, setFileContent] = React.useState([]);

  const addItem = (newItem) => {
    setFileContent((prevContent) => [...prevContent, newItem]);
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function handleClick({target}) {
    if (target.files.length < 1) {
      return
    }

    const selectedFile = target.files[0];
    setFilename(selectedFile.name)

    const reader = new FileReader();
    reader.onload = handleChunk;
    reader.readAsText(selectedFile);
  }

  const handleChunk = async (e) => {
    const chunk = e.target.result;
    const lines = chunk.split(/\r?\n/); 
    // console.log(lines.length);
    for (var i=0; i<lines.length; ++i) {
      await sleep(3000);
      const theLine = lines[i];
      addItem(theLine);
      
      // It works as well
      // setTimeout((theLine) => {
      //   console.log(theLine);
      //   // const tmp = [...fileContent];
      //   // tmp.push(theLine);
      //   // console.log(tmp);
      //   // setFileContent(tmp);
      //   addItem(theLine);
      // }, 3000*i, theLine);
    }
  };

  return (
    <div>
      <h1>Hello, {props.name}</h1>
      <Button variant="contained" component="label" onChange={handleClick}>
        Load txt
        <input type="file" accept=".txt" hidden />
      </Button>
      <hr />
      <h3>{filename} Content:</h3>
      {
        fileContent.map((line, index) => (
          <p key={index}>{line}</p>
        ))
      }
    </div>
  );
}
