"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("./db/mongoose");
const routes_1 = __importDefault(require("./routes"));
(0, mongoose_1.establishConnection)();
const app = (0, express_1.default)();
// const port = process.env.PORT;
app.use(express_1.default.json());
app.use('/api', routes_1.default);
exports.default = app;
