import { Router } from "express";
import test from "../controllers/testController";

const testRouter = Router();

testRouter.route("/test").get(test);

export default testRouter;
