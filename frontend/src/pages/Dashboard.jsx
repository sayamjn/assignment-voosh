//new
import React, { useState, useEffect } from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TaskColumn from "../components/TaskColumn";
import TaskModal from "../components/modals/TaskModal";
import DeleteConfirmation from "../components/DeleteConfirmation";
import TaskDetails from "../components/TaskDetails";
import { taskService } from "../services/taskService";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  // State Management
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch Tasks Function
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getAllTasks();

      const groupedTasks = fetchedTasks.reduce(
        (acc, task) => {
          const status = task.status || 'todo';
          if (!acc[status]) {
            acc[status] = [];
          }
          acc[status].push(task);
          return acc;
        },
        { todo: [], inProgress: [], done: [] }
      );

      setTasks(groupedTasks);
      setError("");
    } catch (err) {
      setError("Failed to fetch tasks. Please try again.");
      console.error("Fetch tasks error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Task Management Functions
  const handleCreateTask = async (taskData) => {
    try {
      setError("");
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => ({
        ...prev,
        [newTask.status]: [...(prev[newTask.status] || []), newTask],
      }));
      setIsTaskModalOpen(false);
    } catch (err) {
      setError("Failed to create task. Please try again.");
      console.error("Create task error:", err);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      setError("");
      const updatedTask = await taskService.updateTask(taskId, taskData);
      
      setTasks(prev => {
        const newTasks = { ...prev };
        // Remove task from all status columns
        Object.keys(newTasks).forEach(status => {
          newTasks[status] = newTasks[status].filter(t => t.id !== taskId);
        });
        // Add task to new status column
        const status = updatedTask.status || 'todo';
        newTasks[status] = [...(newTasks[status] || []), updatedTask];
        return newTasks;
      });
      
      setIsTaskModalOpen(false);
    } catch (err) {
      setError("Failed to update task. Please try again.");
      console.error("Update task error:", err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    console.log(taskId)
    try {
    if (!taskId) {
        console.error("Invalid task ID");
        return;
        }

      // Update task status in backend
      const updatedTask = await taskService.updateTaskStatus(taskId, newStatus);
      
      // Update local state
      setTasks(prevTasks => {
        const newTasks = { ...prevTasks };
        
        // Remove task from original status
        Object.keys(newTasks).forEach(status => {
          newTasks[status] = newTasks[status].filter(task => task.id !== taskId);
        });
        
        // Add task to new status
        newTasks[newStatus] = [...(newTasks[newStatus] || []), updatedTask];
        
        return newTasks;
      });
    } catch (error) {
      console.error("Failed to update task status", error);
      setError("Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setError("");
      await taskService.deleteTask(taskId);
      
      setTasks(prev => {
        const newTasks = { ...prev };
        Object.keys(newTasks).forEach(status => {
          newTasks[status] = newTasks[status].filter(t => t.id !== taskId);
        });
        return newTasks;
      });
      
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      console.error("Delete task error:", err);
    }
  };

  // Helper Functions
  const filterTasks = (taskList) => {
    if (!searchTerm) return taskList;
    const term = searchTerm.toLowerCase();
    return taskList.filter(task =>
      task.title?.toLowerCase().includes(term) ||
      task.description?.toLowerCase().includes(term) ||
      task.labels?.some(label => label.toLowerCase().includes(term))
    );
  };

  const sortTasks = (taskList) => {
    return [...taskList].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        default:
          return 0;
      }
    });
  };

  const getProcessedTasks = (status) => {
    const filtered = filterTasks(tasks[status] || []);
    return sortTasks(filtered);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      setError("Failed to logout. Please try again.");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-blue-600 p-4 flex justify-between items-center shadow-md">
          <div className="text-white text-2xl font-semibold">Task Manager</div>
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="text-white hover:text-blue-100 flex items-center gap-2"
            >
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
              <span className="font-medium">
                {user?.firstName} {user?.lastName}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="p-8">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <button
              onClick={() => {
                setSelectedTask(null);
                setIsTaskModalOpen(true);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>Add Task</span>
            </button>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Recent</option>
                  <option value="dueDate">Due Date</option>
                </select>
              </div>
            </div>
          </div>

          {/* Task Columns */}
          <div className="flex flex-col lg:flex-row gap-8 mt-4">
            <TaskColumn
              title="TODO"
              tasks={getProcessedTasks("todo")}
              status="todo"
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onEdit={task => {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}
              onDelete={task => {
                setSelectedTask(task);
                setIsDeleteModalOpen(true);
              }}
              onView={task => {
                setSelectedTask(task);
                setIsDetailsModalOpen(true);
              }}
            />
            <TaskColumn
              title="IN PROGRESS"
              tasks={getProcessedTasks("inProgress")}
              status="inProgress"
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onEdit={task => {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}
              onDelete={task => {
                setSelectedTask(task);
                setIsDeleteModalOpen(true);
              }}
              onView={task => {
                setSelectedTask(task);
                setIsDetailsModalOpen(true);
              }}
            />
            <TaskColumn
              title="DONE"
              tasks={getProcessedTasks("done")}
              status="done"
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onEdit={task => {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}
              onDelete={task => {
                setSelectedTask(task);
                setIsDeleteModalOpen(true);
              }}
              onView={task => {
                setSelectedTask(task);
                setIsDetailsModalOpen(true);
              }}
            />
          </div>
        </div>

        {/* Modals */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          onSubmit={selectedTask
            ? data => handleUpdateTask(selectedTask.id, data)
            : handleCreateTask}
          task={selectedTask}
        />

        <DeleteConfirmation
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTask(null);
          }}
          onConfirm={() => handleDeleteTask(selectedTask?.id)}
          taskTitle={selectedTask?.title}
        />

        <TaskDetails
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
        />
      </div>
    </DndProvider>
  );
};

export default Dashboard;