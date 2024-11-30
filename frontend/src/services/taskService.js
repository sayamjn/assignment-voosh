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
  }
};

export default taskService;