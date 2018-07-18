import React from 'react';
import Login from './Login'

let User = require('../../server/models/models').User;

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordRepeat: '',
      message: '',
    };
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onPasswordRepeatChange = this.onPasswordRepeatChange.bind(this)
    this.register = this.register.bind(this)
  }

  componentDidMount () {
    this.props.socket.on('register', () => {
      this.props.redirect(Login)
    })
    this.props.socket.on('msg', (data) => {this.setState({message: data.message})}) //set message state
  }

  register () {
    let {username, password, passwordRepeat} = this.state;
    this.props.socket.emit('register', {username, password, passwordRepeat})
  }

  onUsernameChange (e) {
    this.setState({username: e.target.value});
  }

  onPasswordChange (e) {
    this.setState({password: e.target.value});
  }

  onPasswordRepeatChange (e) {
    this.setState({passwordRepeat: e.target.value});
  }


  render() {
    console.log('rendered register');
    return (
      <div className="register-form">
        {this.state.message ? <span>{this.state.message}</span> : null}
        <h1>Register</h1>
        <input placeholder="username" value={this.state.username} onChange={this.onUsernameChange}/>
        <input placeholder="password" value={this.state.password} onChange={this.onPasswordChange}/>
        <input placeholder="repeat password" value={this.state.passwordRepeat} onChange={this.onPasswordRepeatChange}/>
        <button onClick={()=>{this.props.redirect(Login)}}>Go To Login</button>
        <button onClick={this.register}>Register</button>
      </div>
    );
  }
}

export default Register;
