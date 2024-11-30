import React from "react";
import { useDrag } from 'react-dnd';

const TaskCard = ({ task, onDelete, onEdit, onView }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, originalStatus: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const isDueSoon = (date) => {
    if (!date) return false;
    const dueDate = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  const isOverdue = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <div
      ref={drag}
      className={`bg-blue-50 p-4 rounded-lg shadow-sm mb-2 border border-blue-100 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
      <p className="text-gray-600 text-sm mb-2">{task.description}</p>
      <div className="flex flex-col space-y-2">
        {task.dueDate && (
          <div
            className={`text-sm ${
              isOverdue(task.dueDate)
                ? "text-red-600"
                : isDueSoon(task.dueDate)
                ? "text-orange-600"
                : "text-gray-600"
            }`}
          >
            Due: {formatDate(task.dueDate)}
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(task);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(task);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onView(task);
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
              >
                View Details
              </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;