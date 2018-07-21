import React from 'react';
import Login from './Login'
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
    console.log('rendered register');
    return (
      <div className="outer-register-form">
        <div className="register-form">
          {this.state.message ? <span>{this.state.message}</span> : null}
          <div className="paper">
            <Paper style={style} zDepth={5}>
              <h1> Welcome to the JAR Editor</h1>
              <h1>Register</h1>
              {this.login({defaultT:"Username", text: "Username", value: this.state.username, event: this.onUsernameChange})}
              {this.login({defaultT:"Password ", type: "password", text: "Password", value: this.state.password, event: this.onPasswordChange})}
              {this.login({defaultT:"Repeat Password ", type: "password", text: "Repeat Password", value: this.state.passwordRepeat, event: this.onPasswordRepeatChange})}
              <RaisedButton
                label="Go to Login"
                onClick={()=>{this.props.redirect(Login)}}
                style={{margin: "10px"}}

              />
              <RaisedButton
                label="Register"
                onClick={this.register}
              />
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
