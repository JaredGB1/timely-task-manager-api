const routes=require('express').Router();
const controller=require("../controllers/goalsControl");
const errorHandler = require('../middlewares/errorHandler');
const validateGoal = require('../middlewares/goalValidation');
const { IsAuthenticated } = require("../middlewares/authenticate"); 

routes.get('/', controller.getAll);

routes.get('/:username', controller.getUsername);

routes.post('/', IsAuthenticated, validateGoal, controller.createGoal);

routes.put('/:id', IsAuthenticated, validateGoal, controller.updateGoal);

routes.delete('/:id', IsAuthenticated, controller.deleteGoal);

routes.use(errorHandler)

module.exports= routes;