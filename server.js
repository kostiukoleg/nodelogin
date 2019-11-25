//Developer or Production
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//Insert Libraries
const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//Connect to Mongo
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( () => console.log('MongoDB Connected...') )
    .catch ( err => console.log(err) );

//EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

//Static Folder
app.use("/", express.static(__dirname));

//URL Encode
app.use("/", express.urlencoded({ extended: false }));

//Flash
app.use(flash());

//Cookie Parser
app.use(cookieParser());

//Body Parser
app.use(bodyParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

//Routes
app.use('/', require('./routes'));

//Listen PORT
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${ PORT }`));
