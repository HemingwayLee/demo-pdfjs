import React, { useEffect, useState, useCallback, useRef } from "react";
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf'
import PdfViewer from "./PdfViewer";

const PdfLoader = props => {
  const { filename, ...others } = props;

  const pdfRef = useRef();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = './pdf.worker.min.js'
    var loadingTask = pdfjs.getDocument({ url: filename, disableAutoFetch: true, disableStream: true});
    loadingTask.promise.then(
      pdf => {
        pdfRef.current = pdf;

        setItemCount(pdf._pdfInfo.numPages);

        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {
          console.log("Page loaded");
        });
      },
      reason => {
        console.error(reason);
      }
    );
  }, [filename]);

  const handleGetPdfPage = useCallback(index => {
    return pdfRef.current.getPage(index + 1);
  }, []);

  return (
    <PdfViewer
      {...others}
      itemCount={itemCount}
      getPdfPage={handleGetPdfPage}
    />
  );
};

export default PdfLoader;
