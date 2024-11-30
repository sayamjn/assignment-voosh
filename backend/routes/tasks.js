const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const Task = require('../models/Task');

const router = express.Router();

router.get('/overdue', auth, async (req, res, next) => {
    try {
      const currentDate = new Date();
      const tasks = await Task.find({
        userId: req.user._id,
        dueDate: { $lt: currentDate },
        status: { $ne: 'done' }
      });
      
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  });


router.get('/', auth, async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.post('/', [auth], async (req, res, next) => {
    try {
  
      const task = await Task.create({
        ...req.body,
        userId: req.user._id
      });
  
      console.log('Task created:', task);
      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      next(error);
    }
  });

router.patch('/:id',[auth], async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', [
  auth,
], async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: req.body.status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
