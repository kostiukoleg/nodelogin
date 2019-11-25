const express = require('express');
const router = express.Router();
const passport = require('passport');
const initializePassport = require('./passport-config');
const bcrypt = require('bcrypt');
let users = [];

initializePassport.initialize(passport,
    function(email){
        return users.find(function(user){ return user.email === email });
    },
    function(id){
        return users.find(function(user){ return user.id === id });
    }
);

router.get('/', initializePassport.checkAuthenticated, (req, res) => {
    const locals = {
        title: 'Page Title',
        description: 'Page Description',
        header: 'Page Header',
        name: req.user.name
    };
    res.render('pages/index.ejs', locals);
});

router.get('/login', initializePassport.checkNotAuthenticated, (req, res) => {
    const locals = {
        title: 'Login page',
        description: 'Page Description',
        header: 'Page Header'
    };
    res.render('pages/login.ejs', locals);
});

router.post('/login', initializePassport.checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', initializePassport.checkNotAuthenticated, (req, res) => {
    const locals = {
        title: 'Register Users',
        description: 'Page Description',
        header: 'Page Header'
    };
    res.render('pages/register.ejs', locals);
});

router.post('/register', initializePassport.checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.inputPassword, 10);
        if(typeof req.body.inputName !== String) {
            return { message: 'Name field cannot be an empty'}
        }
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
});

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

module.exports = router;
