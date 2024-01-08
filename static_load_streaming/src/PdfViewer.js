import React, { useState, useCallback, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { VariableSizeList } from "react-window";
import PdfPage from "./PdfPage";
import Page from "./Page";

const PdfViewer = props => {
  const { itemCount, getPdfPage, windowRef } = props;

  const [pages, setPages] = useState([]);

  const listRef = useRef();

  const width = "100%";
  const height = "600px";
  const gap = 40;
  const internalWidth = 400;
  const internalHeight = 600;

  const fetchPage = useCallback(
    index => {
      if (!pages[index]) {
        getPdfPage(index).then(page => {
          setPages(prev => {
            const next = [...prev];
            next[index] = page;
            return next;
          });
          listRef.current.resetAfterIndex(index);
        });
      }
    },
    [getPdfPage, pages]
  );

  const handleItemSize = useCallback(
    index => {
      const page = pages[index];
      if (page) {
        const scale = 1;
        const viewport = page.getViewport({ scale });
        return viewport.height + gap;
      }
      return 50;
    },
    [pages, gap]
  );

  const handleListRef = useCallback(
    elem => {
      listRef.current = elem;
      if (windowRef) {
        windowRef.current = elem;
      }
    },
    [windowRef]
  );

  const style = {
    width,
    height,
    border: "1px solid #ccc",
    background: "#ddd",
    overflowY: "auto"
  };

  return (
    <div style={style}>
      <VariableSizeList
        ref={handleListRef}
        width={internalWidth}
        height={internalHeight}
        itemCount={itemCount}
        itemSize={handleItemSize}
      >
        {({ index, style }) => {
          fetchPage(index);
          return (
            <Page style={style}>
              <PdfPage page={pages[index]}/>
            </Page>
          );
        }}
      </VariableSizeList>
    </div>
  );
};

export default PdfViewer;
