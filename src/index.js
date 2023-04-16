"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
// app.use((req: Request, res: Response, next: NextFunction) => {
//     if(req.method === 'GET') {
//         res.status(400).send("GET REQUESTS ARE DISABLED")
//     } else {
//         next();
//     }
// });
const port = process.env.PORT;
app_1.default.listen(port, () => {
    console.log("Server is up on port ", port);
});
