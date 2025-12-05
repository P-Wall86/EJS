const { body, validationResult } = require("express-validator");

const testDriveRules = () => {
  return [
    body("inv_id")
      .trim()
      .notEmpty()
      .withMessage("• Vehicle ID is required."),

    body("preferred_date")
      .trim()
      .notEmpty()
      .withMessage("• Preferred date is required.")
      .isISO8601()
      .withMessage("• Preferred date must be a valid date."),

    body("comment")
      .trim()
      .optional({ checkFalsy: true })
      .isLength({ max: 500 })
      .withMessage("• Comment must be less than 500 characters."),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.validationErrors = errors.array();
    return next();
  }
  next();
};

module.exports = {
  testDriveRules,
  validate,
};