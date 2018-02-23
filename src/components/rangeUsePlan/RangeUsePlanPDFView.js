import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';
import jspdf from 'jspdf';
import { Button, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { HOME } from '../../constants/routes';

class RangeUsePlanPDFView extends Component {
  state = {
    pdf: null,
    file: null,
    numPages: 1,
  }

  componentDidMount() {
    this.getPdfFile(); 
  }

  onFileChange = (event) => {
    this.setState({
      file: event.target.files[0],
    });
  }
  
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
    });
  }

  onDownloadButtonClicked = () => {
    this.state.pdf.save("rup.pdf");
  }

  getPdfFile() {
    const pdf = new jspdf('p', 'mm', 'a4');
    pdf.setFontSize(15).setFontStyle('bold').setTextColor('#5f6367');
    pdf.text('RANGE USE PLAN/RANGE STEWARDSHIP PLAN LEVEL 1 or 2', 105, 20, {}, 0, 'center');
    
    pdf.setFontSize(10).setFontStyle('normal').setTextColor('#5f6367');
    pdf.text('1/9', 105, 290, {}, 0, 'center');
    pdf.addPage();
    
    pdf.setFontSize(10).setFontStyle('normal').setTextColor('#5f6367');
    pdf.text('2/9', 105, 290, {}, 0, 'center');
    
    const file = pdf.output('datauristring');
    this.setState({
      file,
      pdf,
    });
  }

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
          pageIndex={index + 1}
          pageNumber={index + 1}
          scale={1.2}
        />
      ),
    );

    const downloadButton = (
      <Button 
        className={getClassName("__download-button")}
        circular
        size="large"
        icon="download"
        onClick={this.onDownloadButtonClicked}
      />
    );
    const backButton = (
      <Link to={HOME}>
        <Button
          className={getClassName("__back-button")}
          circular
          size="large"
          icon="reply"
        />
      </Link>
    );

    return (
      <div className="range-use-plan-pdf-view">
        <div className={getClassName("__container")}>
          <div className={getClassName("__container__document")}>
            <Document
              file={file}
              onLoadSuccess={this.onDocumentLoadSuccess}
            >
              {pages}
            </Document>
          </div>
        </div>
        
        {downloadButton}
        {backButton}

        {/* <Popup
          trigger={downloadButton}
          content="Download PDF"
          inverted
          position="top center"
        />
        
        <Popup
          trigger={backButton}
          content="Back to list"
          inverted
          position="top center"
        /> */}

      </div>
    );
  }
}

export default RangeUsePlanPDFView;
// render(<Sample />, document.getElementById('react-container'));