import React from 'react';
import Register from './Register'

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  componentDidMount() {
    this.props.socket.emit('msg', 'hello from Login.js')
  }

  onUsernameChange (e) {
    this.setState({username: e.target.value});
  }

  onPasswordChange (e) {
    this.setState({password: e.target.value});
  }

  render() {
    console.log('rendered login');
    return (
      <div className="login-form">
        <h1>Login</h1>
        <input placeholder="username" value={this.state.username} onChange={this.onUsernameChange}/>
        <input placeholder="password" value={this.state.password} onChange={this.onPasswordChange}/>
        <button onClick={()=>this.props.login(this.state.username, this.state.password)}>Login</button>
        <button onClick={()=>this.props.redirect(Register)}>Register</button>

      </div>
    );
  }
}

export default Login;
