const routes=require('express').Router();
const controller=require("../controllers/userControl");
const errorHandler=require('../middlewares/errorHandler');
const validateUser=require('../middlewares/userValidation');
const { IsAuthenticated } = require("../middlewares/authenticate");

routes.get('/', controller.getAll);

routes.get('/:id', controller.getSingle);

routes.post('/', IsAuthenticated, validateUser, controller.createUser);

routes.put('/:id', IsAuthenticated, validateUser, controller.updateUser);

routes.delete('/:id', IsAuthenticated, controller.deleteUser);

routes.use(errorHandler)

module.exports= routes;