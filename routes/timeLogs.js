const routes=require('express').Router();
const controller=require("../controllers/timeLogsControl");
const errorHandler = require('../middlewares/errorHandler');
const validateTimeLog = require('../middlewares/timeLogValidation');
const { IsAuthenticated } = require("../middlewares/authenticate"); 

routes.get('/', controller.getAll);

routes.get('/:username', controller.getUsername);

routes.get('/:username/:task', controller.getSpecificTimelogs);

routes.post('/', IsAuthenticated, validateTimeLog, controller.createTimeLog);

routes.put('/:id', IsAuthenticated, validateTimeLog, controller.updateTimeLog);

routes.delete('/:id', IsAuthenticated, controller.deleteTimeLog);

routes.use(errorHandler)

module.exports= routes;