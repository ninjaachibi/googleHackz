import React from 'react';
import Document from './Documents.js';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentPage: 'Document'};
    this.redirect = this.redirect.bind(this)
  }
  redirect(page) {
    this.setState({currentPage: page})
  }

  render() {
    return (
      <div>
        {this.state.currentPage === "Document" ? <Document /> : null}
      </div>
    );
  }
}
