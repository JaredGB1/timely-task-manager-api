const Joi = require('joi');

const timeLogSchema = Joi.object({
    username: Joi.string().required(),
    task: Joi.string().required(),
    duration: Joi.number().integer().required().strict(),
    note: Joi.string().required()
});

const validateTimeLog = (req, res, next) => {
    const { error } = timeLogSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((err) => err.message);
        return res.status(400).json({
            message: 'Validation failed',
            errors: errorMessages
        });
    }

    next();
};

module.exports = validateTimeLog;