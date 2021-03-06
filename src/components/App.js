import React from 'react';
import Document from './Documents';
import Login from './Login'
import Register from './Register'
import DocumentPortal from './DocumentPortal'
import Connecting from './Connecting'
import io from 'socket.io-client'


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: Login,
      connecting: true,
      isLogged: false,
      user: null,
    };
    this.redirect = this.redirect.bind(this)
    this.socket = io('http://localhost:3000');
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.socket.on('connect', () => {
      console.log('ws connect');
      this.setState({connecting: null})
    });
    this.socket.on('disconnect', () => {
      console.log('ws disconnect')
      this.setState({connecting: true})
    });
    this.socket.on('msg', (data) => {
      console.log('ws msg:', data);
      this.socket.emit('cmd', {foo:123})
    });
  }

  login (username, password) {
    this.socket.emit('login', {username: username, password: password}, (res) => {
      console.log('status', res);
      if(res.success) {
        console.log('in res.succes', res.user);
        this.setState({
          isLogged: !this.state.isLogged,
          currentPage: DocumentPortal,
          user: res.user
        })
      }
      else {
        this.setState({isLogged: false})
      }
    })
  }

  logout () {
    this.setState({isLogged: false, currentPage: Login})
  }

  redirect(screen, options) {
    this.setState({currentPage: screen, options: options})
  }

  render () {
    const {redirect, socket,login,logout, state} = this;
    const user = this.state.user, options = this.state.options;
    return (
      React.createElement(
        this.state.connecting ? Connecting : this.state.currentPage, {
          redirect, socket, login, logout, user, options
        })
      // <div>
      //   {this.state.currentPage === "Document" ? <Document socket={this.socket}/> : null}
      // </div>
    );
  }
}
