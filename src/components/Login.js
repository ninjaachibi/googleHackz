import React from 'react';
import Register from './Register';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
let User = require('../../server/models/models').User;

const style = {
  height: 600,
  width: 600,
  margin: 20,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};

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

  login({defaultT, event, text, value, type}) {
    return(
      <TextField
        hintText={defaultT}
        floatingLabelText={text}
        floatingLabelFixed={true}
        value={value}
        type={type}
        onChange={event}
      />
    )
  }

  render() {
    console.log('rendered login');
    return (
      // <div className="login-form">
      //   <h1>Login</h1>
      //   <input placeholder="username" value={this.state.username} onChange={this.onUsernameChange}/>
      //   <input placeholder="password" value={this.state.password} onChange={this.onPasswordChange}/>
      //   <button onClick={()=>this.props.login(this.state.username, this.state.password)}>Login</button>
      //   <button onClick={()=>this.props.redirect(Register)}>Register</button>
      //
      // </div>
        <div className="register-form">
          {this.state.message ? <span>{this.state.message}</span> : null}
          <div className="paper">
            <Paper style={style} zDepth={5}>
              <h1>Login</h1>
              {this.login({defaultT:"Username", text: "Username", value: this.state.username, event: this.onUsernameChange})}
              {this.login({defaultT:"Password ", type: "password", text: "Password", value: this.state.password, event: this.onPasswordChange})}

              <RaisedButton
                label="Login"
                onClick={()=>this.props.login(this.state.username, this.state.password)}
                style={{margin: "10px"}}
              />
              <RaisedButton
                label="Register"
                onClick={()=>this.props.redirect(Register)}
              />
            </Paper>
          </div>
        </div>
    );
  }
}

export default Login;
