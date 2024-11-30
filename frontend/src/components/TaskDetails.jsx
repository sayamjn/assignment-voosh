import React from 'react';

const TaskDetails = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-6">Task Details</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Title</h3>
            <p className="mt-1">{task.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Description</h3>
            <p className="mt-1">{task.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Status</h3>
            <p className="mt-1 capitalize">{task.status}</p>
          </div>

          {task.priority && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Priority</h3>
              <p className="mt-1 capitalize">{task.priority}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700">Created At</h3>
            <p className="mt-1">{formatDate(task.createdAt)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Last Updated</h3>
            <p className="mt-1">{formatDate(task.updatedAt)}</p>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;