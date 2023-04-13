"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = require("./db/mongoose");
var routes_1 = __importDefault(require("./routes"));
(0, mongoose_1.establishConnection)();
var app = (0, express_1.default)();
var port = process.env.PORT;
// app.use((req: Request, res: Response, next: NextFunction) => {
//     if(req.method === 'GET') {
//         res.status(400).send("GET REQUESTS ARE DISABLED")
//     } else {
//         next();
//     }
// });
app.use(express_1.default.json());
app.use('/api', routes_1.default);
app.listen(port, function () {
    console.log("Server is up on port ", port);
});
