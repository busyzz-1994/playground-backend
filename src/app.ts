import cookieParser from "cookie-parser";
import express, { Express } from "express";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);
app.use(errorHandler);

export default app;
