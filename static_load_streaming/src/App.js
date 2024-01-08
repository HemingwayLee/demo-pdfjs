import React from 'react';
import PdfLoader from "./PdfLoader";

export default function Main(props) {
  const windowRef = React.useRef(null);
  const filename = 'oodmetrics.pdf';

  return (
    <div>
      <h1>Hello, {props.name}</h1>
      <hr />
      <PdfLoader filename={filename} windowRef={windowRef} />
    </div>
  );
}
