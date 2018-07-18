import React from 'react';
import Document from './Documents'

class DocumentPortal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  onUsernameChange (e) {
    this.setState({username: e.target.value});
  }

  onPasswordChange (e) {
    this.setState({password: e.target.value});
  }

  render() {
    console.log('rendered DocumentPortal');
    return (
      <div className="document-portal">
        <h1>Document Portal</h1>
        <button onClick={()=>this.props.redirect(Document)}>Add new document</button>
      </div>
    );
  }
}

export default DocumentPortal;
