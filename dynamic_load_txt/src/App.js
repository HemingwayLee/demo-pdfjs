import React from 'react';
import Button from '@mui/material/Button';

export default function Main(props) {
  const [filename, setFilename] = React.useState('');
  const [fileContent, setFileContent] = React.useState(null);
  
  function handleClick({target}) {
    if (target.files.length < 1) {
      return
    }

    const selectedFile = target.files[0];
    setFilename(selectedFile.name)

    const reader = new FileReader();
    reader.onload = (e) => setFileContent(e.target.result);
    reader.readAsText(selectedFile);
  }

  return (
    <div>
      <h1>Hello, {props.name}</h1>
      <Button variant="contained" component="label" onChange={handleClick}>
        Load txt
        <input type="file" accept=".txt" hidden />
      </Button>
      <hr />
      {fileContent && (
        <div>
          <h3>{filename} Content:</h3>
          <p>{fileContent}</p>
        </div>
      )}
    </div>
  );
}
