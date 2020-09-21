require("dotenv/config");
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routeUser = require('./routes/user.route');


const app = express();

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.render('index');
})

app.use('/', routeUser);


const port = process.env.PORT_ACCESS || 3500;

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(port, () => {
    console.log(`Server start on ${port}`);
})