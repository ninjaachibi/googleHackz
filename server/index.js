import http from 'http';
var app = require('express')();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = http.Server(app);
var io = require('socket.io')(server);

import auth from './socket-api/auth'

//MONGODB
let User = require('./models/models').User;

var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
  console.log('Connected to MONGODB!');
})
mongoose.connect(process.env.MONGODB_URI);

//SOCKET
io.on('connection', function (socket) {
  console.log('in connection');

  auth(socket, (success) => {
    console.log('auth returns', success);
  }); //???

  socket.emit('msg', { hello: 'world' });
  socket.on('cmd', onMsgReceive);
  // Message received from client:
  socket.on('msg', onMsgReceive);

});

const onMsgReceive = (data) => {
  console.log('server received', data);
}

//AUTH ROUTES
app.get('/', (req,res) => {
  res.send('Hello world!');
})

app.post('/login', (req,res) => {
  let {username, password} = req.body;
  User.findOne({username: username, password: password})
    .then(user => {
      console.log(user);
      if(!user) {
        console.log('no user found');
        res.json({success: false, message: "no user found with these credentials"});
      }
      else {
        console.log('logged in!');
        res.json({success: true, user: user._id})
      }
    })
    .catch(err => {console.log('error',err)})
});

app.post('/register', (req,res) => {
  console.log(req.body);
  let {username, password, passwordRepeat} = req.body;

  if(!username || !password || !passwordRepeat) {
    res.json({success: false, message: "missing username or password"});
  }
  else if (password !== passwordRepeat) {
    res.json({success: false, message: "passwords do not match"});
  }
  else {
    //create new user
    var newUser = new User({
      username: username,
      password: password,
    });

    newUser.save()
      .then((user) => {
        console.log('SUCCESSFULY SAVED NEW USER', user);
        res.json({
          success: true,
          user: user._id,
        })
      })
      .catch(err => {console.log('ERROR', err)})
    }
  });

app.get('/logout', (req,res) => {
  res.json({success: true});
})


server.listen(3000, () => {
  console.log('LISTENING ON PORT 3000');
});
