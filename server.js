//Import Required Modules
const express = require("express");
const bodyParser= require("body-parser");
const MongoClient= require('mongodb').MongoClient;
const mongodb=require('./database/connect');
const passport=require("passport");
const session=require("express-session");
const GitHubStrategy= require("passport-github2").Strategy;
const dotenv=require('dotenv');
const cors=require('cors');
const helmet=require('helmet');

//Initialize app
const app = express();
const port=process.env.PORT || 3000;

//Error Handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

//Middleware
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Z-key']
}));
app.use(helmet());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Github OAuth setup with Passport

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done)
{
    return done(null, profile);
}
));

passport.serializeUser((user, done)=>{
    done(null,user);
});
passport.deserializeUser((user, done)=>{
    done(null,user);
});

// Authentication Routes 

app.get('/', (req, res)=>{
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")
});
app.get('/github/callback' , passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false}),
    (req,res) => {
    req.session.user = req.user;
    res.redirect('/');
});

//Appliaction routes

app.use('/', require("./routes"));

//Connect to Mongo DB data base and start the express server

mongodb.initDB((err,mongodb) =>
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            app.listen(port);
            console.log(`Connected to DB and listening on ${port}`);
        }
    }); 