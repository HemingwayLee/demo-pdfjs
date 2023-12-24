import React from 'react';
import Button from '@mui/material/Button';

export default function Welcome(props) {
  const canvasRef = React.useRef(null);

  const handlePdfRead = (e) => {
    alert("Hello pdf");
  }

  const handlePdfReadInStreaming = (e) => {
    alert("Hello streaming");
  }
  
  return (
    <div>
      <h1>Hello, {props.name}</h1>
      <Button variant="contained" color="primary" onClick={handlePdfRead}>
        Load pdf
      </Button>
      <Button variant="outlined" onClick={handlePdfReadInStreaming}>
        Load pdf in streaming mode
      </Button>
      <hr />
      <canvas ref={canvasRef} />
    </div>
  );
}


