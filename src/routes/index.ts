import { Router } from 'express';
import { taskRoutes } from './task/task.routes';
import { userRoutes } from './user/user.routes';

// export * from './user.routes';
// export * from './task.routes';


let mainRouter = Router();

mainRouter.use('/users', userRoutes);
mainRouter.use('/tasks' , taskRoutes);

export default mainRouter;