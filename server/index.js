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
let Document = require('./models/models').Document;

var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
  console.log('Connected to MONGODB!');
})
mongoose.connect(process.env.MONGODB_URI);

//SOCKET
io.on('connection', function (socket) {
  console.log('in connection');

  auth(socket);

  socket.on('addDocument', (data, next) => {
    //create new document
    let newDocument = new Document({
      owner: data.user._id,
      collaboratorList: [data.user._id],
      title: data.title,
      password: data.password,
      createdTime: new Date(),
      lastEditTime: new Date(),
    });

    newDocument.save()
    .then((doc) => {
      console.log('SUCCESSFULY SAVED NEW DOC', doc);
      socket.emit('msg',{message: `Created new doc: ${doc._id}`})
      next({})
    })
    .catch(err => {
      console.log('ERROR', err);
      next({err: err})
    })
  })

  socket.on('getDocuments', (data, next) => {
    Document.find({
      collaboratorList: {$in: data.userId}
    })
      .then((docs) => {next({docs: docs})})
      .catch(err => {next({err: err})})
  })

  socket.on('deleteDocument', (data, next) => {
    Document.findByIdAndDelete(data.docId)
      .then(doc => {
        console.log('DELETED', doc);
        next({})
      })
      .catch((err)=> {
        console.log('error',err);
        next({err: err})
      })
  })

  socket.on('joinDocument', (data, next) => {
    Document.findOne({_id: data.docId})
      .then((doc) => {
        doc.collaboratorList.push(data.user._id)
        doc.save((err)=>{
          next({err, doc})
        })
      })
      .catch((err)=> {
        console.log('error',err);
        next({err})
      })
  })

  socket.on('openDocument', (data, next) => {
    console.log('data is', data);
    if(socket.room) {
      socket.leave(socket.room)
    }
    socket.room = data.docId;
    socket.join(socket.room, () => {
      console.log(`${data.user.username} joined room`);
      socket.to(socket.room).emit('msg', {msg: `${data.user.username} joined the room ${data.docId}`})
    })

    Document.findById(data.docId, (err, doc) => next({err,doc}))
  })

  socket.on('syncContent', (data) => {
    console.log('sync is', data);

    socket.to(socket.room).emit('syncContent', data);
  })

  socket.on('saveDocument', (data) => {
    Document.findById(data.docId)
     .then(doc => {
       console.log('doc is', doc);
       const content = doc.content;
       doc.content.push(data.raw);
       doc.save().then(doc => {
         console.log('saved', doc);
       })
     })
     .catch(err => {console.log('error',err)})
  })

  // socket.on('closeDocument', (data) => {
  //   socket.leave(data.docId);
  // })

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
