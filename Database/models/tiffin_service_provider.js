const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tiffinServiceProvider = new Schema({
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
    default: true
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
  },
  tiffins: [
    {
      type: Schema.Types.ObjectId,
      ref: 'tiffin'
    }
  ]
});

module.exports = mongoose.model('tiffinServiceProvider', tiffinServiceProvider);

