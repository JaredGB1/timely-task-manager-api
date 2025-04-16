const Joi = require('joi');

const goalSchema = Joi.object({
    username: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    targetHours: Joi.number().integer().required().strict(),
    currentProgress: Joi.string().required(),
    deadline: Joi.string().required(),
});

const validateGoal = (req, res, next) => {
    const { error } = goalSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((err) => err.message);
        return res.status(400).json({
            message: 'Validation failed',
            errors: errorMessages
        });
    }

    next();
};

module.exports = validateGoal;