import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskCard = ({ task, index, onDelete, onEdit, onView }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleView = (e) => {
    e.stopPropagation();
    onView(task);
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-lg shadow mb-2"
        >
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <div className="text-sm text-gray-500 mt-2">
            Created at: {formatDate(task.createdAt)}
          </div>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button 
              onClick={handleEdit}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={handleView}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
