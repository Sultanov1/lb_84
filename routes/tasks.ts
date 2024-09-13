import express from 'express';
import Task from '../models/Task';
import {TaskMutation} from '../types';
import User from '../models/User';

const taskRouter = express.Router();
const validStatuses = ['new', 'in_progress', 'complete'];

taskRouter.get('/', async (req, res) => {
  try {
    const task = await Task.find();
    res.send(task);
  } catch (error) {
    res.status(500).send({error: 'Invalid Server Error'});
  }
});

taskRouter.post('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.body.user);

    if (!user) {
      return res.status(400).json({error: 'User not found'});
    }

    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({error: 'Invalid status provided'});
    }

    const taskData: TaskMutation = {
      user: req.body.user,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    }

    const task = new Task(taskData);

    await task.save();
    res.send(task);
  } catch (error) {
    next(error);
  }
});

taskRouter.put('/:id', async (req, res, next) => {
  try {
    const userId = req.body.user;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({error: 'Task not found'});
    }

    if (task.user.toString() !== userId) {
      return res.status(403).json({error: 'You don\'t have permission to edit this task'})
    }

    if (req.body.status && !validStatuses.includes(req.body.status)) {
      return res.status(400).json({error: 'Invalid status provided'});
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;

    await task.save();

    res.json({message: 'Task was updated', task});
  } catch (error) {
    next(error);
  }
});

taskRouter.delete('/:id', async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.body.user;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({error: 'Task not found'});
    }

    if (task.user.toString() !== userId) {
      return res.status(403).json({error: 'You do not have permission to delete this task'});
    }

    await Task.deleteOne({_id: taskId});

    res.json({message: 'Task deleted'});
  } catch (error) {
    next(error);
  }
});


export default taskRouter;