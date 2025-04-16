const swaggerAutogen= require('swagger-autogen')();

const doc= 
{
    info: 
    {
        title: "Timely Task Manager API",
        description: "The Timely Task Manager API will help users manage their time. It will allow users to add tasks, log time spent on tasks, and set goals."
    },
    host: 'localhost:3000',
    schemes: ['http', 'https']
};

const ouputFile = './swagger.json';
const endpointsFiles= ['./routes/index.js'];

swaggerAutogen(ouputFile,endpointsFiles,doc);