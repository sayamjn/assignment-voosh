import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TaskColumn from "../components/TaskColumn";
import TaskModal from "../components/modals/TaskModal";
import DeleteConfirmation from "../components/DeleteConfirmation";
import TaskDetails from "../components/TaskDetails";
import { taskService } from "../services/taskService";

const Dashboard = () => {
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getAllTasks();

      const groupedTasks = fetchedTasks.reduce(
        (acc, task) => {
          if (!acc[task.status]) {
            acc[task.status] = [];
          }
          acc[task.status].push(task);
          return acc;
        },
        { todo: [], inProgress: [], done: [] }
      );

      setTasks(groupedTasks);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks({
        ...tasks,
        [newTask.status]: [...tasks[newTask.status], newTask],
      });
      setIsTaskModalOpen(false);
    } catch (err) {
      setError("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      const updatedTasks = { ...tasks };

      Object.keys(tasks).forEach((status) => {
        updatedTasks[status] = tasks[status].filter((t) => t.id !== taskId);
      });

      updatedTasks[updatedTask.status].push(updatedTask);

      setTasks(updatedTasks);
      setIsTaskModalOpen(false);
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      const updatedTasks = { ...tasks };

      Object.keys(tasks).forEach((status) => {
        updatedTasks[status] = tasks[status].filter((t) => t.id !== taskId);
      });

      setTasks(updatedTasks);
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError("Failed to delete task");
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
        [source.droppableId]: items,
      });
    } else {
      try {
        await taskService.updateTaskStatus(
          draggableId,
          destination.droppableId
        );

        const sourceItems = Array.from(tasks[source.droppableId]);
        const destItems = Array.from(tasks[destination.droppableId]);
        const [movedItem] = sourceItems.splice(source.index, 1);
        movedItem.status = destination.droppableId;
        destItems.splice(destination.index, 0, movedItem);

        setTasks({
          ...tasks,
          [source.droppableId]: sourceItems,
          [destination.droppableId]: destItems,
        });
      } catch (err) {
        setError("Failed to update task status");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      setError("Failed to logout");
    }
  };

  const filterTasks = (taskList) => {
    return taskList.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortTasks = (taskList) => {
    const sortedTasks = [...taskList];
    if (sortBy === "recent") {
      sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return sortedTasks;
  };

  const getProcessedTasks = (status) => {
    const filtered = filterTasks(tasks[status] || []);
    return sortTasks(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 p-4 flex justify-between items-center">
        <div className="text-white text-2xl font-semibold">Task Manager</div>
        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="text-white hover:text-blue-100 flex items-center gap-2"
          >
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span>
              {user?.firstName} {user?.lastName}
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
          >
            Logout
          </button>
        </div>
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>

        <div className="flex justify-between items-center my-4">
          <div className="w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Recent</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8 mt-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <TaskColumn
              title="TODO"
              tasks={getProcessedTasks("todo")}
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
              tasks={getProcessedTasks("inProgress")}
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
              tasks={getProcessedTasks("done")}
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
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={
          selectedTask
            ? (data) => handleUpdateTask(selectedTask.id, data)
            : handleCreateTask
        }
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
  );
};

export default Dashboard;
