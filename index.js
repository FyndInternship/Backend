require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const authRoutes = require('./routes/authenticationRoutes')
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const establish_connection_db  = require('./Database/index');
const { handle_custom_error, page_not_found_error } = require('./middlewares/errorHandlerMw');
const app = express();
const store = new MongoDBStore({
    uri: process.env.DB_URI,
    collection: 'sessions'
  });


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );


//routes
app.use('/auth', authRoutes)



app.use('/', (req, res) => {
    res.send('Hii ')
})





app.use(handle_custom_error)
app.use(page_not_found_error)
app.listen(process.env.PORT, () => {
    console.log("Server is up and running", process.env.PORT)
    establish_connection_db().then((res) => {
        console.log('connection established with db')
    }).catch((err) => {
        console.log(err)
    })
})