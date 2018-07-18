var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

//connect to MONGODB
mongoose.connection.on('connected', function() {
  console.log('Connected to MONGODB!');
})
mongoose.connect(process.env.MONGODB_URI);

let userSchema = new Schema({
  username: String,
  password: String,
  documentList: {
    type: Array,
    default: []
  }
})

let documentSchema = new Schema({
  content: {
    type: Array, //an Array of the edit history of the document
    default: []
  },
  owner: {
    type: ObjectId,
    required: true,
    ref: "users"
  },
  collaboratorList: {
    type: [{
      type: ObjectId,
      ref: "users"
    }]
  },
  title: {
    type: String,
    default: 'Untitled'
  },
  password: {
    type: String,
  },
  createdTime: {
    type: Date
  },
  lastEditTime: {
    type: Date
  }
}, {minimize: false});

let User = mongoose.model('User', userSchema);
let Document = mongoose.model('Document', documentSchema);

module.exports = {
  User: User,
  Document: Document,
}
