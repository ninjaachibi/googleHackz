import React from 'react';
import Document from './Documents'
import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Popover from 'material-ui/Popover';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

class DocumentPortal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      title: '',
      shareId: '',
      openAdd: false,
      openShared: false
    };
    this.addDocument = this.addDocument.bind(this);
    this.ontitleChange = this.ontitleChange.bind(this);
    this.refresh = this.refresh.bind(this)
    this.handleSharedOpen = this.handleSharedOpen.bind(this);
    this.handleSharedClose = this.handleSharedClose.bind(this);
    this.handleAddOpen = this.handleAddOpen.bind(this);
    this.handleAddClose = this.handleAddClose.bind(this);
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

  editDocument (docId) {
    this.props.redirect(Document, {docId})
  }

  joinDocument (shareId) {
    this.props.socket.emit('joinDocument', {docId: shareId, user: this.props.user}, this.refresh)
  }

  displayCards() {
    return (
      this.state.documents.map((doc,i) => (

        <Card
          key={i}
          style={{width: "350px", height: "150px", margin: "20px", justifyContent: "center" }}
          >
          <CardHeader
            title={`${doc.title}`}
            subtitle={`$id:${doc._id}`}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardActions>
            <RaisedButton onClick={()=>this.editDocument(doc._id)} label="Edit" />
            <RaisedButton onClick={()=>this.deleteDocument(doc._id)} label="Delete" />
          </CardActions>
          {/* <button onClick={()=>this.editDocument(doc._id)}>Edit</button>
          <button onClick={()=>this.deleteDocument(doc._id)}>Delete</button> */}
        </Card>

      ))
    );
  }


  displayShared() {
    return (
      <div>
        <RaisedButton
          icon={<FontIcon className="material-icons">share</FontIcon>}
          onClick={this.handleSharedOpen}
        />
          <Dialog
            title="Add a Shared ID"
            modal={true}
            open={this.state.openShared}
            >
              <TextField
                hintText="Copy Shared ID"
                floatingLabelText="Shared Id"
                floatingLabelFixed={true}
                value={this.state.shareId}
                onChange={(e)=>this.setState({shareId:e.target.value})}
              />
              <RaisedButton
                label="Add"
                onClick={()=>{
                  this.joinDocument(this.state.shareId)
                  this.handleSharedClose()
                }
              }
              />
              <RaisedButton
                label="Cancel"
                onClick={this.handleSharedClose}
              />
        </Dialog>
      </div>
    );
  }

  addDoc() {
    return (
      <div>
        <FontIcon
          onClick={this.handleAddOpen} className="material-icons">add_circle</FontIcon>
          <Dialog
            title="Add a Doc you Fat Fuck"
            modal={true}
            open={this.state.openAdd}
            >
              <TextField
                hintText="Insert Name"
                floatingLabelText="Name of Doc"
                floatingLabelFixed={true}
                value={this.state.title}
                onChange={(e)=>this.setState({title:e.target.value})}
              />
              <RaisedButton
                label="Add"
                onClick={()=>{
                  this.addDocument()
                  this.handleAddClose()
                }
              }
              />
              <RaisedButton
                label="Cancel"
                onClick={this.handleAddClose}
              />
        </Dialog>
      </div>
    )
  }

  handleAddOpen() {
    this.setState({openAdd: true});
  };

  handleAddClose() {
    this.setState({openAdd: false});
  };
  handleSharedOpen() {
    this.setState({openShared: true});
  };

  handleSharedClose() {
    this.setState({openShared: false});
  };

  render() {
      // console.log('user in docPortal', this.props.user);
      // console.log('docs', this.state.documents);
      return (
        <div className="document-portal">
          <div className="app-container">
            <AppBar title="Document Portal" style={{alignItems: 'center'}}>
              <div className="Greetings">
                <h2> Welcome back, {this.props.user.username}</h2>
              </div>
            </AppBar>
          </div>
          <div className="document-list-container">
            <h3>My documents</h3>
            {this.addDoc()}
            {this.displayShared()}
          </div>
          <div className="document-list">
            {this.displayCards()}
          </div>
        </div>
    );
  }
}

export default DocumentPortal;
