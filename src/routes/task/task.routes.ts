import { Router, Request, Response } from "express";
import { isValidObjectId, Types, HydratedDocument } from "mongoose";
import * as fromModels from '../../models';
import * as fromMiddleware from "../../middleware";

export const taskRoutes: Router = Router();

// Create Task

taskRoutes.post("", fromMiddleware.auth ,async (req: Request, res: Response) => {
  // Previous WHich only create task - No user linkage
  // const task = new fromModels.Task<fromModels.ITask>(req.body);


  const user: HydratedDocument<fromModels.IUser, fromModels.IUserMethods> = res.locals.user;

  const task = new fromModels.Task<fromModels.ITask>({
    ...req.body,
    owner: user._id
  })

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read Tasks

// GET /tasks?completed=false
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy=createdAt_asc or sortBy=createdAd:desc
taskRoutes.get("", fromMiddleware.auth , async (req: Request, res: Response) => {
  // For Match
  const match = req.query.completed ? { completed: req.query.completed === 'true' } : {};

  // For Sort
  const sort = req.query.sortBy ? { createdAt: (req.query.sortBy as string).indexOf('desc') !== -1 ? -1 : 1 } : {};


  const user: HydratedDocument<fromModels.IUser, fromModels.IUserMethods> = res.locals.user;
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
        limit: parseInt(req.query.limit as string),
        skip: parseInt(req.query.skip as string),
        sort
      }
    });

    res.status(200).send(user.tasks);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Read Task By ID

taskRoutes.get("/:id", fromMiddleware.auth , async (req: Request, res: Response) => {
  const user: HydratedDocument<fromModels.IUser, fromModels.IUserMethods> = res.locals.user;
  const _id = req.params.id;

  // validate params
  if (!isValidObjectId(_id)) {
    // the function we need to write
    return res.status(404).send("Invalid params"); // you can define your status and message
  }

  try {
    const taskId = new Types.ObjectId(req.params.id);
    
    // Previous fetching using params
    // const task = await fromModels.Task.findById(taskId);

    const task = await fromModels.Task.findOne({ _id: taskId, owner: user._id });

    if (!task) {
      return res.status(404).send("task Not Found");
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(500);
  }
});

// Update Task By ID

taskRoutes.patch("/:id", fromMiddleware.auth , async (req: Request, res: Response) => {
  const user: HydratedDocument<fromModels.IUser, fromModels.IUserMethods> = res.locals.user;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  const _id = req.params.id;

  if (!isValidObjectId(_id)) {
    return res.status(404).send("Invalid Task Id");
  }

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update operation!" });
  }

  try {
    const taskId = new Types.ObjectId(req.params.id);


    // Previous before applying the Auth
    // const task = await fromModels.Task.findByIdAndUpdate(taskId, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    // Now using Auth and Virtuals
    const task: any = await fromModels.Task.findOne<fromModels.ITask>({ _id: taskId, owner: user._id });

    if (!task) {
      return res.status(404).send("Task Not Found");
    }

    updates.forEach(update => task[update]=req.body[update]);

    await task.save();

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete Task

taskRoutes.delete("/:id", fromMiddleware.auth ,async (req: Request, res: Response) => {
  const user: HydratedDocument<fromModels.IUser, fromModels.IUserMethods> = res.locals.user;
  const _id = req.params.id;

  if (!isValidObjectId(_id)) {
    return res.status(404).send("Invalid User Id");
  }

  try {
    const taskId = new Types.ObjectId(_id);
    // as per previous without Auth and Virtuals
    // const task = await fromModels.Task.findByIdAndDelete(taskId);

    const task = await fromModels.Task.findOne({ _id: taskId, owner: user._id });


    if (!task) {
      return res.status(404).send("Task Not Found");
    }


    await task.deleteOne();

    res.status(200).send(task);
  } catch (error) {
    res.status(500);
  }
});
