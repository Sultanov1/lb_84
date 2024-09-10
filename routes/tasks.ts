import express from 'express';
import Task from '../models/Task';
import {TaskMutation} from '../types';
import User from '../models/User';

const taskRouter = express.Router();

taskRouter.get('/', async (req, res, next) => {
  try {
    const task = await Task.find();
    res.send(task);
  } catch (error) {
    res.status(500).send({error: 'Invalid Server Error'});
    return next(error);
  }
});

taskRouter.post('/', async (req, res, next) => {
  try {
    const taskData: TaskMutation = {
      user: req.body.user,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    }

    const task = new Task(taskData);

    const validateStatuses = ['new', 'in_progress', 'complete'];

    if (!validateStatuses.includes(req.body.status)) {
      return res.status(400).json({error: 'Invalid status provided'});
    }

    const user = await User.findById(req.body.user);

    if (!user) {
      return res.status(400).json({error: 'User not found'});
    }

    await task.save();
    res.send(task);
  } catch (error) {
    next(error);
  }
})

export default taskRouter;