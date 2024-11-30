const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['todo', 'inProgress', 'done'],
    default: 'todo'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  labels: [{
    type: String,
    trim: true
  }],
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ dueDate: 1 });

// Pre-save middleware
taskSchema.pre('save', function(next) {
  if (this.status === 'done' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Virtual for isOverdue
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate) return false;
  return new Date(this.dueDate) < new Date();
});



const Task = mongoose.model('Task', taskSchema);
module.exports = Task;