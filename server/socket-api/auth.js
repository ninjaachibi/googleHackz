let User = require('../models/models').User;

export default function auth(socket) {
  socket.on('login', (data, res) => {

    let {username, password} = data;
    User.findOne({username: username, password: password})
      .then(user => {
        console.log('user is',user);
        if(!user) {
          console.log('no user found');
          res({success: false, message: "no user found with these credentials"});
        }
        else {
          console.log('logged in!');
          res({success: true, user: user})
        }
      })
      .catch(err => {console.log('error',err)})

  });

  socket.on('register', (data) => {
    let {username, password, passwordRepeat} = data;
    if(!username || !password || !passwordRepeat) {
      socket.emit('msg',{message: "missing username or password"});
    }
    else if (password !== passwordRepeat) {
      socket.emit('msg', {message: "passwords do not match"});
    }
    else {
      User.findOne({username: username})
      .then(user => {
        if(user) {
          socket.emit('msg', {message: "username already taken"})
        }
        else {
          //create new user
          let newUser = new User({
            username: username,
            password: password,
          });

          newUser.save()
          .then((user) => {
            console.log('SUCCESSFULY SAVED NEW USER', user);
            socket.emit('msg',{message: `Registered as ${user.username}`})
            socket.emit('register');
          })
          .catch(err => {console.log('ERROR', err)})
        }
      })

    }
  });
}
