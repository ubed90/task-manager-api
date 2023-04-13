"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
var express_1 = require("express");
var fromModels = __importStar(require("../../models"));
var fromMiddleware = __importStar(require("../../middleware"));
var mongoose_1 = require("mongoose");
// For Handling Server side file Uploads
var multer_1 = __importDefault(require("multer"));
// For Handling Server Side Image Processing
var sharp_1 = __importDefault(require("sharp"));
// For Email
var fromEmail = __importStar(require("../../email"));
exports.userRoutes = (0, express_1.Router)();
// Signup Users
exports.userRoutes.post("", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = new fromModels.User(req.body);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [4 /*yield*/, fromEmail.sendWelcomeEmail(user.email, user.name)];
            case 3:
                _a.sent();
                return [4 /*yield*/, user.generateAuthToken()];
            case 4:
                token = _a.sent();
                res.status(201).send({ user: user, token: token });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                res.status(400).send(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Read Users
// userRoutes.get("", fromMiddleware.auth ,async (req: Request, res: Response) => {
//   try {
//     const users: fromModels.IUser[] = await fromModels.User.find({});
//     res.status(200).send(users);
//   } catch (error) {
//     res.send(500).send();
//   }
// });
// Profile Route
exports.userRoutes.get("/profile", fromMiddleware.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.status(200).send(res.locals.user);
        return [2 /*return*/];
    });
}); });
// Login User
exports.userRoutes.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fromModels.User.findByCredentials(req.body.email, req.body.password)];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, user.generateAuthToken()];
            case 2:
                token = _a.sent();
                res.status(200).send({ user: user, token: token });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(400).send({ error: error_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Logout User
exports.userRoutes.post("/logout", fromMiddleware.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, receivedToken_1, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = res.locals.user;
                receivedToken_1 = res.locals.token;
                user.tokens = user.tokens.filter(function (token) {
                    return token.token !== receivedToken_1;
                });
                return [4 /*yield*/, user.save()];
            case 1:
                _a.sent();
                res.status(200).send("User Logged out Successfully.");
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).send(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Logout All Sessions
exports.userRoutes.post("/logoutAll", fromMiddleware.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = res.locals.user;
                user.tokens = [];
                return [4 /*yield*/, user.save()];
            case 1:
                _a.sent();
                res.status(200).send("User Logged out Successfully.");
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).send(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Read User By ID
// userRoutes.get("/:id", async (req: Request, res: Response) => {
//   const _id = req.params.id;
//   // validate params
//   if (!isValidObjectId(_id)) {
//     // the function we need to write
//     return res.status(404).send("Invalid params"); // you can define your status and message
//   }
//   try {
//     const userId = new Types.ObjectId(_id);
//     const user = await fromModels.User.findById(userId);
//     if (!user) {
//       return res.status(404).send("User Not Found");
//     }
//     res.status(200).send(user);
//   } catch (error) {
//     res.status(500);
//   }
// });
// Update USER by ID
exports.userRoutes.patch("/profile", fromMiddleware.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, updates, allowedUpdates, isValidOperation, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = res.locals.user;
                updates = Object.keys(req.body);
                allowedUpdates = ["name", "email", "password", "age"];
                isValidOperation = updates.every(function (update) {
                    return allowedUpdates.includes(update);
                });
                // Not required, Since this will only run with Authenticated Users
                // const _id = req.params.id;
                // if (!isValidObjectId(_id)) {
                //   return res.status(404).send("Invalid User Id");
                // }
                if (!isValidOperation) {
                    return [2 /*return*/, res.status(400).send({ error: "Invalid Update operation!" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                // const userId = new Types.ObjectId(_id);
                // Adjustment for catching in our middleware, // Not required, Since this will only run with Authenticated Users
                // const user = await fromModels.User.findById(userId);
                // const user = await fromModels.User.findByIdAndUpdate(userId, req.body, {
                //   new: true,
                //   runValidators: true,
                // });
                // if (!user) {
                //   return res.status(404).send("User Not Found");
                // }
                updates.forEach(function (update) { return user[update] = req.body[update]; });
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                res.status(200).send(user);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.status(400).send(error_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Update User Profile Picture
var upload = (0, multer_1.default)({
    limits: {
        fileSize: 1000000,
    },
    fileFilter: function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please upload an image'));
        }
        callback(null, true);
    },
});
exports.userRoutes.post('/profile/avatar', fromMiddleware.auth, upload.single('upload'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, buffer;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = res.locals.user;
                return [4 /*yield*/, (0, sharp_1.default)((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer).resize({ width: 250, height: 250 }).png().toBuffer()];
            case 1:
                buffer = _b.sent();
                user.avatar = buffer;
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                res.status(200).send(user);
                return [2 /*return*/];
        }
    });
}); }, function (error, req, res, next) {
    res.status(400).send(error.message);
});
// Delete User Profile Picture
exports.userRoutes.delete('/profile/avatar', fromMiddleware.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = res.locals.user;
                return [4 /*yield*/, user.updateOne({ $unset: { avatar: 1 } })];
            case 1:
                _a.sent();
                res.status(204).send(user);
                return [2 /*return*/];
        }
    });
}); }, function (error, req, res, next) {
    res.status(400).send(error.message);
});
// Get Profile Picture in Browser
exports.userRoutes.get('/profile/:id/avatar', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fromModels.User.findById(new mongoose_1.Types.ObjectId(req.params.id))];
            case 1:
                user = _a.sent();
                if (!user || !user.avatar) {
                    throw new Error();
                }
                res.set('Content-Type', 'image/png');
                res.send(user.avatar);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                res.sendStatus(404);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Delete User
exports.userRoutes.delete("/profile", fromMiddleware.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = res.locals.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                // const userId = new Types.ObjectId(_id);
                // const user = await fromModels.User.findByIdAndDelete(userId);
                // if (!user) {
                // return res.status(404).send("User Not Found");
                // }
                return [4 /*yield*/, user.deleteOne()];
            case 2:
                // const userId = new Types.ObjectId(_id);
                // const user = await fromModels.User.findByIdAndDelete(userId);
                // if (!user) {
                // return res.status(404).send("User Not Found");
                // }
                _a.sent();
                return [4 /*yield*/, fromEmail.sendCancellationEmail(user.email, user.name)];
            case 3:
                _a.sent();
                res.status(200).send(user);
                return [3 /*break*/, 5];
            case 4:
                error_7 = _a.sent();
                res.status(500);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
