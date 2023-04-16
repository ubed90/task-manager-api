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
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = void 0;
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const fromModels = __importStar(require("../../models"));
const fromMiddleware = __importStar(require("../../middleware"));
exports.taskRoutes = (0, express_1.Router)();
// Create Task
exports.taskRoutes.post("", fromMiddleware.auth, async (req, res) => {
    // Previous WHich only create task - No user linkage
    // const task = new fromModels.Task<fromModels.ITask>(req.body);
    const user = res.locals.user;
    const task = new fromModels.Task({
        ...req.body,
        owner: user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
// Read Tasks
// GET /tasks?completed=false
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy=createdAt_asc or sortBy=createdAd:desc
exports.taskRoutes.get("", fromMiddleware.auth, async (req, res) => {
    // For Match
    const match = req.query.completed ? { completed: req.query.completed === 'true' } : {};
    // For Sort
    const sort = req.query.sortBy ? { createdAt: req.query.sortBy.indexOf('desc') !== -1 ? -1 : 1 } : {};
    const user = res.locals.user;
    try {
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
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        res.status(200).send(user.tasks);
    }
    catch (error) {
        res.sendStatus(500);
    }
});
// Read Task By ID
exports.taskRoutes.get("/:id", fromMiddleware.auth, async (req, res) => {
    const user = res.locals.user;
    const _id = req.params.id;
    // validate params
    if (!(0, mongoose_1.isValidObjectId)(_id)) {
        // the function we need to write
        return res.status(404).send("Invalid params"); // you can define your status and message
    }
    try {
        const taskId = new mongoose_1.Types.ObjectId(req.params.id);
        // Previous fetching using params
        // const task = await fromModels.Task.findById(taskId);
        const task = await fromModels.Task.findOne({ _id: taskId, owner: user._id });
        if (!task) {
            return res.status(404).send("task Not Found");
        }
        res.status(200).send(task);
    }
    catch (error) {
        res.status(500);
    }
});
// Update Task By ID
exports.taskRoutes.patch("/:id", fromMiddleware.auth, async (req, res) => {
    const user = res.locals.user;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    const _id = req.params.id;
    if (!(0, mongoose_1.isValidObjectId)(_id)) {
        return res.status(404).send("Invalid Task Id");
    }
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Update operation!" });
    }
    try {
        const taskId = new mongoose_1.Types.ObjectId(req.params.id);
        // Previous before applying the Auth
        // const task = await fromModels.Task.findByIdAndUpdate(taskId, req.body, {
        //   new: true,
        //   runValidators: true,
        // });
        // Now using Auth and Virtuals
        const task = await fromModels.Task.findOne({ _id: taskId, owner: user._id });
        if (!task) {
            return res.status(404).send("Task Not Found");
        }
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.status(200).send(task);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
// Delete Task
exports.taskRoutes.delete("/:id", fromMiddleware.auth, async (req, res) => {
    const user = res.locals.user;
    const _id = req.params.id;
    if (!(0, mongoose_1.isValidObjectId)(_id)) {
        return res.status(404).send("Invalid User Id");
    }
    try {
        const taskId = new mongoose_1.Types.ObjectId(_id);
        // as per previous without Auth and Virtuals
        // const task = await fromModels.Task.findByIdAndDelete(taskId);
        const task = await fromModels.Task.findOne({ _id: taskId, owner: user._id });
        if (!task) {
            return res.status(404).send("Task Not Found");
        }
        await task.deleteOne();
        res.status(200).send(task);
    }
    catch (error) {
        res.status(500);
    }
});
