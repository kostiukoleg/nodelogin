const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
function initialize( passport, getUserByEmail, getUserById ) {
    const authenticateUser = async function ( email, password, done ) {
       const user = getUserByEmail( email );
       if( user == null ) {
           return done( null, false, { message: 'No User with that email' } );
       }
       try { 
        if ( await bcrypt.compare( password, user.password ) ) {
            return done( null, user );
        } else {
            return done( null, false, { message: 'Password incorrect' } );
        }
       } catch(e) {
           return done(e);
       }
    }
    passport.use( new LocalStrategy( { usernameField: 'inputEmail', passwordField: 'inputPassword' }, authenticateUser) );
    passport.serializeUser(function(user, done){
        return done(null, user.id);
    });    
    passport.deserializeUser(function(id, done) {
        return done(null, getUserById(id));
    });
}

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        return res.redirect('/login');
    }
}

function checkNotAuthenticated( req, res, next ){
    if( req.isAuthenticated() ) {
        return res.redirect('/');
    } else {
        return next();
    }
}
module.exports = { initialize, checkAuthenticated, checkNotAuthenticated };
