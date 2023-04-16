import express, { Express, NextFunction, Request, Response } from "express";
import { establishConnection } from "./db/mongoose";

import mainRouter from './routes';

establishConnection();

const app: Express = express();

// const port = process.env.PORT;

app.use(express.json());
app.use('/api', mainRouter)


export default app;