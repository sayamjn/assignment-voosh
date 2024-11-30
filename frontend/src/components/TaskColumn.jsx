import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, tasks, id, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg w-80">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px]"
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task._id} 
                task={task} 
                index={index}
                onDelete={onDelete}
                onEdit={onEdit}
                onView={onView}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
