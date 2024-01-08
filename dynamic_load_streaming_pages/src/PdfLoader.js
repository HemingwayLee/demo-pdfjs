import React, { useEffect, useState, useCallback, useRef } from "react";
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf'
import PdfViewer from "./PdfViewer";

const PdfLoader = props => {
  const { filename, ...others } = props;
  const pdfRef = useRef();

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = './pdf.worker.min.js'
    var loadingTask = pdfjs.getDocument(filename);
    loadingTask.promise.then(
      pdf => {
        pdfRef.current = pdf;

        props.setItemCount(pdf._pdfInfo.numPages);
        pdf.getPage(1).then(function(page) {
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
      // itemCount={itemCount}
      getPdfPage={handleGetPdfPage}
    />
  );
};

export default PdfLoader;
