import React from 'react';
import Document from './Documents'

class DocumentPortal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      title: '',
      shareId: '',
    };
    this.addDocument = this.addDocument.bind(this);
    this.ontitleChange = this.ontitleChange.bind(this);
    this.refresh = this.refresh.bind(this)
  }

  componentDidMount() {
    //grab docs for this user: both owning and collaborating
    this.loadDocuments()
  }

  loadDocuments () {
    this.props.socket.emit('getDocuments', {userId: this.props.user._id} , (res) => {
      console.log('in loadDocuments', res);
      if(res.err) return alert('oop error');
      this.setState({documents: res.docs})
    })
  }

  refresh (res) {
    if(res.err) return alert('Oops ERROR');
    this.loadDocuments();
  }

  ontitleChange (e) {
    this.setState({title: e.target.value})
  }

  addDocument () {
    this.props.socket.emit('addDocument', {user: this.props.user, title: this.state.title}, this.refresh);
  }

  deleteDocument (docId) {
    this.props.socket.emit('deleteDocument', {docId: docId}, this.refresh)
  }

  editDocument (docId, title) {
    this.props.redirect(Document, {docId, title})
  }

  joinDocument (shareId) {
    this.props.socket.emit('joinDocument', {docId: shareId, user: this.props.user}, this.refresh)
  }

  render() {
    // console.log('user in docPortal', this.props.user);
    // console.log('docs', this.state.documents);
    return (
      <div className="document-portal">
        <h1>Document Portal</h1>
        <h2>Hello, {this.props.user.username}</h2>
        UserId: {this.props.user._id} <br />
        <label>New Doc Name</label><input id="docName" onChange={this.ontitleChange} value={this.state.title}/>
        <button onClick={()=>{this.addDocument()}}>Add new document</button>
        <div className="document-list-container">
          <h3>My documents</h3>
          <div className="document-list">
            {this.state.documents.map((doc,i) => (
              <li key={i}>
                {`${doc.title} id:${doc._id}`}
                <button onClick={()=>this.editDocument(doc._id, doc.title)}>Edit</button>
                <button onClick={()=>this.deleteDocument(doc._id)}>Delete</button>
              </li>
            ))}
          </div>
        </div>
        <input placeholder="paste a doc id shared with you"
          value={this.state.shareId}
          onChange={(e)=>this.setState({shareId:e.target.value})}
        />
        <button onClick={()=>{this.joinDocument(this.state.shareId)}}>Add new document</button>
      </div>
    );
  }
}

export default DocumentPortal;
