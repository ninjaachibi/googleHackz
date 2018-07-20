import React from 'react';
import Document from './Documents'

class History extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [],
    };
  }

  componentDidMount() {
    //grab docs for this user: both owning and collaborating
    // this.loadHistory()
  }

  loadHistory () {
    this.props.socket.emit('getHistory', {userId: this.props.user._id} , (res) => {
      console.log('in loadDocuments', res);
      if(res.err) return alert('oop error');
      this.setState({documents: res.docs})
    })
  }

  // refresh (res) {
  //   if(res.err) return alert('Oops ERROR');
  //   this.loadDocuments();
  // }



  render() {
    console.log('user in history', this.props.user);
    return (
      <div className="history-container">
        <h1>Document History</h1>
        <h2>{this.props.user.username} UserId: {this.props.user._id}</h2><br />
        <div className="document-list-container">
          <h3>Edit History for {this.props.options.docId} </h3>
          <div className="history-list">
            {/* {this.state.history.map()} */}
          </div>
        </div>

      </div>
    );
  }
}

export default History;
