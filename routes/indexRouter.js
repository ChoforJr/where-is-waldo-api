import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/testCors", (req, res) => {
  res.json({
    message: "it worked",
  });
});

indexRouter.get("/profile", (req, res, next) => {
  // If we are here, the JWT was valid
  res.json({
    message: "You made it to the secure route",
    user: req.user, // This is the decoded token payload
  });
});

export default indexRouter;
