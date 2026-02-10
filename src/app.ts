
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import httpStatus from 'http-status'
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
// import router from "./app/routes";

const app: Application = express();
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (req: Request, res: Response) => {
  res.send('Bus ticket server is running.........');
});

// app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API ROUTE NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;