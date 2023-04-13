import { Request, Response, NextFunction } from "express";
import * as JWT from 'jsonwebtoken';
import * as fromModels from "../models";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || '';
        const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY as string);
        const user = await fromModels.User.findOne({ _id: (decoded as JWT.JwtPayload)._id, 'tokens.token': token })

        if(!user) {
            throw new Error();
        }

        res.locals.user = user;
        res.locals.token = token;
        
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please Authenticate.' })
    }
}