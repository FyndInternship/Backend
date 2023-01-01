const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tiffinSchema = new Schema({
  name: {
    type: String,
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
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'tiffinServiceProvider',
    required: true
  },
  requests: [
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
  ]
});

module.exports = mongoose.model('tiffin', tiffinSchema);

