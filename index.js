require("dotenv/config");
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routeUser = require('./routes/user.route');
const productRoute = require('./routes/product.route')
const routeCart = require('./routes/cart.route')
const routeOrder = require('./routes/order.route')

const methodOverride = require("method-override");
const multer = require('multer');
const upload = multer({ dest: './public/images' })
const path =require('path');
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const cors = require('cors');

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Database connected...');
}).catch(err => {
  console.log('Connection failed...')
});
// Session store 
let mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: 'sessions'
})
const app = express();
app.use(flash())
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(express.static('./public'));
app.use(cors());

app.use(session({
  secret: 'bshdvghsvd',
    resave: false, 
    store: mongoStore,
    saveUninitialized: false, 
    cookie: { maxAge: 1000 * 60 * 60 * 5 } // 1 hour
}))

app.use((req, res, next) => {
  res.locals.session = req.session;
  next()
})

app.get('/', (req, res)=>{
    res.render('index');
})
// app.get('/', function(req, res) {
//   res.send('Hello ' + JSON.stringify(req.session));
// });
app.use('/', routeUser);
app.use('/', productRoute);
app.use('/', routeCart);
app.use('/', routeOrder);
const port = process.env.PORT_ACCESS || 3500;



app.listen(port, () => {
    console.log(`Server start on ${port}`);
})