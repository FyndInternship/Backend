require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const authRoutes = require('./routes/authenticationRoutes')
const tiffinRoutes = require('./routes/tiffinRoutes')
const userRoutes = require('./routes/userRoutes')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const multer = require('multer')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const establish_connection_db  = require('./Database/index');
const { handle_custom_error, page_not_found_error } = require('./middlewares/errorHandlerMw');
const { fileStorage, fileFilter } = require('./Utils/fileUpload');
const app = express();
const store = new MongoDBStore({
    uri: process.env.DB_URI,
    collection: 'sessions'
  });

let orgin = ""
if(process.env.ENV === "LOCAL")
orgin = process.env.LOCAL_ORIGIN
else 
orgin = process.env.ACTUAL_ORIGIN

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors({
  origin: orgin,
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
  credentials: true,
  exposedHeaders: "set-cookie"
}))



app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('image'))

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        // sameSite: 'none',
        // httpOnly: false,

        // domain: process.env.ACTUAL_ORIGIN,

      },
       
    })
  );


//routes
app.use('/auth', authRoutes)
app.use('/admin', tiffinRoutes )
app.use('/user', userRoutes)


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