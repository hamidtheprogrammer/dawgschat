import { Router } from "express";
import {
  userValidationRules,
  validate,
} from "../middlewares/validateUserDetails";
import {
  getUserProfile,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../controllers/userController";
import multer from "multer";
import { authenticate, verifyToken } from "../middlewares/verifyToken";

const userRouter = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

userRouter
  .route("/register")
  .post(userValidationRules({}), validate, registerUser);
userRouter
  .route("/login")
  .post(userValidationRules({ login: true }), validate, loginUser);
userRouter.route("/verify-token").get(verifyToken);
userRouter.route("/logout").get(logoutUser);
userRouter.route("/get-profile").get(authenticate, getUserProfile);
userRouter.route("/update-profile").post(
  authenticate,
  userValidationRules({ updateProfile: true }),
  validate,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateUserProfile
);
userRouter.route("/get-users").get(authenticate, getUsers);

export default userRouter;
