const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    req.body = value;
    next();
  };
};

const schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  registerStudent: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    track: Joi.string().valid('Software Development', 'Data Science', 'UX Design', 'Cloud Computing', 'Cybersecurity').required(),
    programme: Joi.string().required()
  }),

  updateStudent: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    track: Joi.string().valid('Software Development', 'Data Science', 'UX Design', 'Cloud Computing', 'Cybersecurity'),
    programme: Joi.string(),
    status: Joi.string().valid('Active', 'At Risk', 'Completed'),
    mentorId: Joi.number().integer()
  }),

  markAttendance: Joi.object({
    date: Joi.string().isoDate().required(),
    status: Joi.string().valid('Present', 'Absent').required()
  }),

  submitProject: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(2000),
    githubLink: Joi.string().uri().required()
  }),

  updateProject: Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().max(2000),
    githubLink: Joi.string().uri(),
    status: Joi.string().valid('Submitted', 'Under Review', 'Approved', 'Needs Improvement'),
    feedback: Joi.string().max(2000)
  })
};

module.exports = {
  validate,
  schemas
};
