const Joi = require('joi');

const postSchema = Joi.object({
    username: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().required(),
    priority: Joi.string().required(),
    dueDate: Joi.string().required(),
});

const validateTask = (req, res, next) => {
    const { error } = postSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((err) => err.message);
        return res.status(400).json({
            message: 'Validation failed',
            errors: errorMessages
        });
    }

    next();
};

module.exports = validateTask;