import express, { Express, NextFunction, Request, Response } from "express";
import { establishConnection } from "./db/mongoose";

import mainRouter from './routes';

establishConnection();

const app: Express = express();

const port = process.env.PORT;


// app.use((req: Request, res: Response, next: NextFunction) => {
//     if(req.method === 'GET') {
//         res.status(400).send("GET REQUESTS ARE DISABLED")
//     } else {
//         next();
//     }

// });


app.use(express.json());
app.use('/api', mainRouter)

app.listen(port, () => {
    console.log("Server is up on port ", port);
})