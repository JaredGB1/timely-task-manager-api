const routes=require('express').Router();
const controller=require("../controllers/taskControl");
const errorHandler = require('../middlewares/errorHandler');
const validateTask = require('../middlewares/taskValidation');
const { IsAuthenticated } = require("../middlewares/authenticate"); 

routes.get('/', controller.getAll);

routes.get('/:username', controller.getSingleUsername);

routes.post('/', IsAuthenticated, validateTask, controller.createTask);

routes.put('/:id', IsAuthenticated, validateTask, controller.updateTask);

routes.delete('/:id', IsAuthenticated, controller.deleteTask);

routes.use(errorHandler)

module.exports= routes;