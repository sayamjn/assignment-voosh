import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, tasks, status, onUpdateTaskStatus, onEdit, onDelete, onView }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => {
      if (item.originalStatus !== status) {
        onUpdateTaskStatus(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className={`flex-1 bg-blue-100 rounded-lg p-4 min-w-[300px] ${
        isOver ? 'bg-blue-200' : ''
      }`}
    >
      <h2 className="text-xl font-bold mb-4 bg-blue-500 text-white p-2 rounded-lg select-none">
        {title}
      </h2>
      <div className="min-h-[200px] space-y-2">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;