import { Router } from "express";
import {
  addMember,
  createGroup,
  editGroup,
  kickMember,
} from "../controllers/groupController";
import { authenticate } from "../middlewares/verifyToken";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const groupRouter = Router();

groupRouter.route("/add-member").post(authenticate, addMember);
groupRouter.route("/edit-group").post(
  authenticate,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  editGroup
);
groupRouter.route("/kick-member").post(authenticate, kickMember);
groupRouter.route("/create-group").post(authenticate, createGroup);

export default groupRouter;
