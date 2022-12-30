const mongoose = require('mongoose');

const obj = {
    useNewUrlParser: true,
}

const establish_connection_db = () => {
    return mongoose.connect(process.env.DB_URI, obj)
}
module.exports = establish_connection_db;
