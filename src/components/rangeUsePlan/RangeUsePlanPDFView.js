import React, { Component } from 'react';
import { render } from 'react-dom';
import { Document, Page, setOptions } from 'react-pdf';
import { Button } from 'semantic-ui-react';

setOptions({
  cMapUrl: 'cmaps/',
  cMapPacked: true,
});

class RangeUsePlanPDFView extends Component {
  state = {
    file: './sample.pdf',
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

    return (
      <div className="range-use-plan-pdf-view">
        <div className="range-use-plan-pdf-view__container">
          <div className="range-use-plan-pdf-view__container__load">
            <label htmlFor="file">Load from file:</label>&nbsp;
            <input
              type="file"
              onChange={this.onFileChange}
            />
          </div>
          <div className="range-use-plan-pdf-view__container__document">
            <Document
              file={file}
              onLoadSuccess={this.onDocumentLoadSuccess}
            >
              {
                Array.from(
                  new Array(numPages),
                  (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      scale={1.2}
                    />
                  ),
                )
              }
            </Document>
          </div>
        </div>
        
    
        <Button 
          className="range-use-plan-pdf-view__floating-button"
          circular
          size="massive"
          icon="download" 
        />
      </div>
    );
  }
}

export default RangeUsePlanPDFView;
// render(<Sample />, document.getElementById('react-container'));