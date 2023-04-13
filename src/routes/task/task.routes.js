"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = void 0;
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var fromModels = __importStar(require("../../models"));
var fromMiddleware = __importStar(require("../../middleware"));
exports.taskRoutes = (0, express_1.Router)();
// Create Task
exports.taskRoutes.post("", fromMiddleware.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, task, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = res.locals.user;
                task = new fromModels.Task(__assign(__assign({}, req.body), { owner: user._id }));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, task.save()];
            case 2:
                _a.sent();
                res.status(201).send(task);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(400).send(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Read Tasks
// GET /tasks?completed=false
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy=createdAt_asc or sortBy=createdAd:desc
exports.taskRoutes.get("", fromMiddleware.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var match, sort, user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                match = req.query.completed ? { completed: req.query.completed === 'true' } : {};
                sort = req.query.sortBy ? { createdAt: req.query.sortBy.indexOf('desc') !== -1 ? -1 : 1 } : {};
                user = res.locals.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                // Previous Metjod
                // const tasks: fromModels.ITask[] = await fromModels.Task.find({});
                // New One with Find By ID
                // const tasks = await fromModels.Task.find<fromModels.ITask>({ owner: user._id })
                // Latest one With relation established
                // First which fetches all users
                // await user.populate('tasks');
                // Second with manual Task Status
                // await user.populate({
                //   path: 'tasks',
                //   match: {
                //     completed: false
                //   }
                // });
                return [4 /*yield*/, user.populate({
                        path: 'tasks',
                        match: match,
                        options: {
                            limit: parseInt(req.query.limit),
                            skip: parseInt(req.query.skip),
                            sort: sort
                        }
                    })];
            case 2:
                // Previous Metjod
                // const tasks: fromModels.ITask[] = await fromModels.Task.find({});
                // New One with Find By ID
                // const tasks = await fromModels.Task.find<fromModels.ITask>({ owner: user._id })
                // Latest one With relation established
                // First which fetches all users
                // await user.populate('tasks');
                // Second with manual Task Status
                // await user.populate({
                //   path: 'tasks',
                //   match: {
                //     completed: false
                //   }
                // });
                _a.sent();
                res.status(200).send(user.tasks);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.sendStatus(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Read Task By ID
exports.taskRoutes.get("/:id", fromMiddleware.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _id, taskId, task, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = res.locals.user;
                _id = req.params.id;
                // validate params
                if (!(0, mongoose_1.isValidObjectId)(_id)) {
                    // the function we need to write
                    return [2 /*return*/, res.status(404).send("Invalid params")]; // you can define your status and message
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                taskId = new mongoose_1.Types.ObjectId(req.params.id);
                return [4 /*yield*/, fromModels.Task.findOne({ _id: taskId, owner: user._id })];
            case 2:
                task = _a.sent();
                if (!task) {
                    return [2 /*return*/, res.status(404).send("task Not Found")];
                }
                res.status(200).send(task);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Update Task By ID
exports.taskRoutes.patch("/:id", fromMiddleware.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, updates, allowedUpdates, isValidOperation, _id, taskId, task_1, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = res.locals.user;
                updates = Object.keys(req.body);
                allowedUpdates = ["description", "completed"];
                isValidOperation = updates.every(function (update) {
                    return allowedUpdates.includes(update);
                });
                _id = req.params.id;
                if (!(0, mongoose_1.isValidObjectId)(_id)) {
                    return [2 /*return*/, res.status(404).send("Invalid Task Id")];
                }
                if (!isValidOperation) {
                    return [2 /*return*/, res.status(400).send({ error: "Invalid Update operation!" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                taskId = new mongoose_1.Types.ObjectId(req.params.id);
                return [4 /*yield*/, fromModels.Task.findOne({ _id: taskId, owner: user._id })];
            case 2:
                task_1 = _a.sent();
                if (!task_1) {
                    return [2 /*return*/, res.status(404).send("Task Not Found")];
                }
                updates.forEach(function (update) { return task_1[update] = req.body[update]; });
                return [4 /*yield*/, task_1.save()];
            case 3:
                _a.sent();
                res.status(200).send(task_1);
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                res.status(400).send(error_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Delete Task
exports.taskRoutes.delete("/:id", fromMiddleware.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _id, taskId, task, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = res.locals.user;
                _id = req.params.id;
                if (!(0, mongoose_1.isValidObjectId)(_id)) {
                    return [2 /*return*/, res.status(404).send("Invalid User Id")];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                taskId = new mongoose_1.Types.ObjectId(_id);
                return [4 /*yield*/, fromModels.Task.findOne({ _id: taskId, owner: user._id })];
            case 2:
                task = _a.sent();
                if (!task) {
                    return [2 /*return*/, res.status(404).send("Task Not Found")];
                }
                return [4 /*yield*/, task.deleteOne()];
            case 3:
                _a.sent();
                res.status(200).send(task);
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                res.status(500);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
