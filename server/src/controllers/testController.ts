import { Request, Response } from "express";

const test = async (req: Request, res: Response) => {
  res.send("Hello from DawgsChat");
};

export default test;
