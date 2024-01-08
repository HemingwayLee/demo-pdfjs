import React from 'react';
import Button from '@mui/material/Button';
import PdfLoader from "./PdfLoader";

export default function Main(props) {
  const windowRef = React.useRef(null);
  const [filename, setFilename] = React.useState('');
  const [itemCount, setItemCount] = React.useState(0);
  
  function handleClick({target}) {
    if (target.files.length < 1) {
      return
    }

    console.log("!!! load with URL.createObjectURL !!!")
    const selectedFile = target.files[0];

    console.log(URL.createObjectURL(target.files[0]));
    setFilename(URL.createObjectURL(target.files[0]))

    // NOTE: this is okay too
    // const reader = new FileReader();
    // reader.addEventListener("load", function () {
    //   setFilename(reader.result)
    // }, false);
    // if (selectedFile) {
    //   reader.readAsDataURL(selectedFile);
    // }
  }

  return (
    <div>
      <h1>Hello, {props.name}</h1>
      <div>pages: {itemCount}</div>
      <Button variant="contained" component="label" onChange={handleClick}>
        Load pdf
        <input type="file" accept=".pdf" hidden />
      </Button>
      <hr />
      <PdfLoader filename={filename} itemCount={itemCount} setItemCount={setItemCount} windowRef={windowRef} />
    </div>
  );
}
