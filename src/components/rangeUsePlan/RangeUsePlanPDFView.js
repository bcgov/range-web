import React, { Component } from 'react';
import { Document, Page, setOptions } from 'react-pdf';
import { Button, Popup } from 'semantic-ui-react';

setOptions({
  cMapUrl: 'cmaps/',
  cMapPacked: true,
});

class RangeUsePlanPDFView extends Component {
  state = {
    file: "./sample.pdf",
    numPages: null,
  }

  onFileChange = (event) => {
    this.setState({
      file: event.target.files[0],
    });
  }

  onDocumentLoadSuccess = ({ numPages }) =>
    this.setState({
      numPages,
    })

  render() {
    const { file, numPages } = this.state;

    const getClassName = (className = '') => (
      `range-use-plan-pdf-view${className}`
    );
    
    const pages = Array.from(
      new Array(numPages),
      (el, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          scale={1.2}
        />
      ),
    );

    const downloadButton = (
      <Button 
        className={getClassName("__floating-button")}
        circular
        size="massive"
        icon="download" 
      />
    );

    return (
      <div className="range-use-plan-pdf-view">
        <div className={getClassName("__container")}>
          <div className={getClassName("__container__load")}>
            <label htmlFor="file">Load from file:</label>&nbsp;
            <input
              type="file"
              onChange={this.onFileChange}
            />
          </div>
          <div className={getClassName("__container__document")}>
            <Document
              file={file}
              onLoadSuccess={this.onDocumentLoadSuccess}
            >
              {pages}
            </Document>
          </div>
        </div>
        
        <Popup
          trigger={downloadButton}
          content='Download PDF'
          inverted
          position='top center'
        />
        
      </div>
    );
  }
}

export default RangeUsePlanPDFView;
// render(<Sample />, document.getElementById('react-container'));