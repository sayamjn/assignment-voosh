import api from './api';

export const taskService = {
  getAllTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  },

  addLabel: async (taskId, label) => {
    try {
      const response = await api.post(`/tasks/${taskId}/labels`, { label });
      return response.data;
    } catch (error) {
      console.error('Error adding label:', error);
      throw error;
    }
  },

  removeLabel: async (taskId, label) => {
    try {
      const response = await api.delete(`/tasks/${taskId}/labels/${label}`);
      return response.data;
    } catch (error) {
      console.error('Error removing label:', error);
      throw error;
    }
  },

  getOverdueTasks: async () => {
    try {
      const response = await api.get('/tasks/overdue');
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      throw error;
    }
  }
};

export default taskService;