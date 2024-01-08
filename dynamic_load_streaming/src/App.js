import React from 'react';
import Button from '@mui/material/Button';
import PdfLoader from "./PdfLoader";

export default function Main(props) {
  const windowRef = React.useRef(null);
  const [filename, setFilename] = React.useState('');
  
  function handleClick({target}) {
    if (target.files.length < 1) {
      return
    }

    console.log("!!! load with FileReader !!!")
    const selectedFile = target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      setFilename(reader.result)
    }, false);

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  }

  return (
    <div>
      <h1>Hello, {props.name}</h1>
      <Button variant="contained" component="label" onChange={handleClick}>
        Load pdf
        <input type="file" accept=".pdf" hidden />
      </Button>
      <hr />
      <PdfLoader filename={filename} windowRef={windowRef} />
    </div>
  );
}
