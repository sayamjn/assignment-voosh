import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TaskColumn from '../components/TaskColumn';
import TaskModal from '../components/modals/TaskModal';
import DeleteConfirmation from '../components/DeleteConfirmation';
import TaskDetails from '../components/TaskDetails';
import { taskService } from '../services/taskService';

const Dashboard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getAllTasks();
      
      const groupedTasks = fetchedTasks.reduce((acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
      }, { todo: [], inProgress: [], done: [] });

      setTasks(groupedTasks);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks({
        ...tasks,
        [newTask.status]: [...tasks[newTask.status], newTask]
      });
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      const updatedTasks = { ...tasks };
      
      Object.keys(tasks).forEach(status => {
        updatedTasks[status] = tasks[status].filter(t => t._id !== taskId);
      });
      
      updatedTasks[updatedTask.status].push(updatedTask);
      
      setTasks(updatedTasks);
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      const updatedTasks = { ...tasks };
      
      Object.keys(tasks).forEach(status => {
        updatedTasks[status] = tasks[status].filter(t => t._id !== taskId);
      });
      
      setTasks(updatedTasks);
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(tasks[source.droppableId]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setTasks({
        ...tasks,
        [source.droppableId]: items
      });
    } else {
      try {
        await taskService.updateTaskStatus(draggableId, destination.droppableId);
        
        const sourceItems = Array.from(tasks[source.droppableId]);
        const destItems = Array.from(tasks[destination.droppableId]);
        const [movedItem] = sourceItems.splice(source.index, 1);
        movedItem.status = destination.droppableId;
        destItems.splice(destination.index, 0, movedItem);

        setTasks({
          ...tasks,
          [source.droppableId]: sourceItems,
          [destination.droppableId]: destItems
        });
      } catch (err) {
        setError('Failed to update task status');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 p-4 flex justify-between items-center">
        <div className="text-white text-2xl font-semibold">Task Manager</div>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100"
        >
          Logout
        </button>
      </nav>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
          {error}
        </div>
      )}
      
      <div className="p-8">
        <button
          onClick={() => {
            setSelectedTask(null);
            setIsTaskModalOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 mb-8"
        >
          Add Task
        </button>
        
        <div className="flex gap-8 overflow-x-auto pb-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <TaskColumn
              title="TODO"
              tasks={tasks.todo}
              id="todo"
              onEdit={(task) => {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}
              onDelete={(task) => {
                setSelectedTask(task);
                setIsDeleteModalOpen(true);
              }}
              onView={(task) => {
                setSelectedTask(task);
                setIsDetailsModalOpen(true);
              }}
            />
            <TaskColumn
              title="IN PROGRESS"
              tasks={tasks.inProgress}
              id="inProgress"
              onEdit={(task) => {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}
              onDelete={(task) => {
                setSelectedTask(task);
                setIsDeleteModalOpen(true);
              }}
              onView={(task) => {
                setSelectedTask(task);
                setIsDetailsModalOpen(true);
              }}
            />
            <TaskColumn
              title="DONE"
              tasks={tasks.done}
              id="done"
              onEdit={(task) => {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}
              onDelete={(task) => {
                setSelectedTask(task);
                setIsDeleteModalOpen(true);
              }}
              onView={(task) => {
                setSelectedTask(task);
                setIsDetailsModalOpen(true);
              }}
            />
          </DragDropContext>
        </div>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={selectedTask ? 
          (data) => handleUpdateTask(selectedTask._id, data) : 
          handleCreateTask
        }
        task={selectedTask}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDeleteTask(selectedTask?._id)}
        taskTitle={selectedTask?.title}
      />

      <TaskDetails
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        task={selectedTask}
      />
    </div>
  );
};

export default Dashboard;
