const routes=require('express').Router();
const passport=require('passport');

routes.use('/', require('./swagger'));
routes.use('/users' , require('./users'));
routes.use('/tasks' , require('./tasks'));
routes.use('/goals' , require('./goals'));
routes.use('/timeLogs' , require('./timeLogs'));

routes.get('/login', passport.authenticate('github'), (req, res)=>{});
routes.get('/logout', function(req, res, next){
    req.logout(function(err) {
        if(err) { return next(err); }
        res.redirect('/');
    });
});


module.exports= routes;