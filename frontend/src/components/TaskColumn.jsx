import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, tasks, id, onEdit, onDelete, onView }) => {
  return (
    <div className="flex-1 bg-blue-100 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 bg-blue-500 text-white p-2 rounded-lg">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px]"
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
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