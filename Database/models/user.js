const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
  },
  contact_no: {
    type: Number
  },
  email: {
    type: String, 
    required: true,
  },
  isServiceProvider: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  address: {
    state: {
        type: String
    },
    city: {
        type: String
    },
    street: {
        type: String
    },
    pincode: {
        type: Number
    }
  }
});

module.exports = mongoose.model('User', userSchema);

