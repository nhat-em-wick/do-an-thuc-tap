require("dotenv/config");
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routeUser = require('./routes/user.route');
const productRoute = require('./routes/product.route')
const methodOverride = require("method-override");
const multer = require('multer');
const upload = multer({ dest: './public/images' })
const path =require('path');
const session = require('express-session')
const MongoDbStore = require('connect-mongo')(session)


const app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(express.static('./public'));
// Session store 
let mongoStore = new MongoDbStore({
  url: process.env.DB_CONNECTION,
  collection: 'sessions'
})

app.use(session({
  secret:'vasghvsagd',
  resave: false,
  store: mongoStore,
  saveUninitialized: false,
  cookie: {maxAge: 1000*60*60*24} // 24h
}))

app.get('/', (req, res)=>{
    res.render('index');
})
// app.get('/', function(req, res) {
//   res.send('Hello ' + JSON.stringify(req.session));
// });
app.use('/', routeUser);
app.use('/', productRoute);


const port = process.env.PORT_ACCESS || 3500;

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(port, () => {
    console.log(`Server start on ${port}`);
})