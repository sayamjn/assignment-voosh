import React from 'react';

const TaskDetails = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  const formatDate = (date) => {
    if (!date) return null;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Task Details</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Title</h3>
              <p className="mt-1">{task.title}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium">Description</h3>
              <p className="mt-1">{task.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium">Status</h3>
              <p className="mt-1 capitalize">{task.status}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium">Due Date</h3>
              <p className="mt-1">{formatDate(task.dueDate)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium">Priority</h3>
              <span className={`inline-block mt-1 px-2 py-1 rounded text-sm ${
                task.priority === 'high' 
                  ? 'bg-red-100 text-red-800' 
                  : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
            </div>

            {task.labels && task.labels.length > 0 && (
              <div>
                <h3 className="text-sm font-medium">Labels</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {task.labels.map((label, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium">Created At</h3>
              <p className="mt-1">{formatDate(task.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;