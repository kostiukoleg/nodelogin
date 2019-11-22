if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initializePassport = require('./passport-config');
initializePassport(passport, function(email){
    return users.find(function(user){ return user.email === email });
},
function(id){
    return users.find(function(user){ return user.id === id });
});
let users = [];

app.set('view-engine', 'ejs');
app.use("/", express.static(__dirname));
app.use("/", express.urlencoded({ extended: false }));
app.use(flash());
//app.use(express.cookieParser());
//app.use(express.bodyParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/', (req, res) => {
    res.render('pages/index.ejs', { name: req.user.name });
});

app.get('/login', (req, res) => {
    res.render('pages/login.ejs');
});

app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true 
}));

app.get('/register', (req, res) => {
    res.render('pages/register.ejs');
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.inputPassword, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.inputName,
            email: req.body.inputEmail,
            password: hashedPassword
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
    console.log(users);
    //res.render('pages/register.ejs');
});

app.listen(3000);
