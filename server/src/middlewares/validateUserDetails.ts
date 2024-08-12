import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

type userValidationType = {
  login?: Boolean;
  updateProfile?: Boolean;
};

const userValidationRules = ({ login, updateProfile }: userValidationType) => {
  if (login) {
    return [
      body("email").isEmail().withMessage("Invalid email"),
      body("password").isLength({ min: 8 }),
    ];
  } else if (updateProfile) {
    return [
      body("username").optional(),
      body("email").optional().isEmail().withMessage("Invalid email"),
      body("password")
        .optional()
        .isLength({ min: 8 })
        .withMessage("Password length must exceed 8 characters"),
    ];
  }

  return [
    body("username").optional(),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password length must exceed 8 characters"),
  ];
};

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
};

export { userValidationRules, validate };
