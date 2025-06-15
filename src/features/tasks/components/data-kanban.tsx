import React from "react";
import { Task, TaskStatus, TasksState } from "../types";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";

const boards: TaskStatus[] = [TaskStatus.BACKLOG, TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW, TaskStatus.DONE];

interface DataKanbanProps {
  data: Task[];
  onChange: (tasks: { $id: string; status: TaskStatus; position: number }[]) => void;
}

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  const [tasks, setTasks] = React.useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort((a, b) => (a.position || 0) - (b.position || 0));
    });

    return initialTasks;
  });

  React.useEffect(() => {
    const newTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach((status) => {
      newTasks[status as TaskStatus].sort((a, b) => (a.position || 0) - (b.position || 0));
    });

    setTasks(newTasks);
  }, [data]);

  const onDragEnd = React.useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const sourceStatus = source.droppableId as TaskStatus;
      const destStatus = destination.droppableId as TaskStatus;

      let updatesPayload: { $id: string; status: TaskStatus; position: number }[] = [];

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };

        // Safely remove the task from the source column
        const sourceColumn = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);

        // If there's no moved task (shouldn't happen, just in case), return the previous state
        if (!movedTask) {
          console.error("No task found at the source index");
          return prevTasks;
        }

        // Create a new task object with the potentially updated status
        const updatedMovedTask = sourceStatus !== destStatus ? { ...movedTask, status: destStatus } : movedTask;

        // Update tasks
        newTasks[sourceStatus] = sourceColumn;
        const destColumn = [...newTasks[destStatus]];
        destColumn.splice(destination.index, 0, updatedMovedTask);
        newTasks[destStatus] = destColumn;

        // Create the updates payload
        updatesPayload = [
          {
            $id: updatedMovedTask.$id || updatedMovedTask.id,
            status: destStatus,
            position: Math.min((destination.index + 1) * 1000, 1_000_000),
          },
        ];

        // Update positions for other tasks in the destination column if needed
        newTasks[destStatus].forEach((task, index) => {
          if (task && (task.$id || task.id) !== (updatedMovedTask.$id || updatedMovedTask.id)) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if ((task.position || 0) !== newPosition) {
              updatesPayload.push({
                $id: task.$id || task.id,
                status: destStatus,
                position: newPosition,
              });
            }
          }
        });

        // Update positions for other tasks in the source column if different from destination
        if (sourceStatus !== destStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if ((task.position || 0) !== newPosition) {
              updatesPayload.push({
                $id: task.$id || task.id,
                status: sourceStatus,
                position: newPosition,
              });
            }
          });
        }

        return newTasks;
      });

      onChange(updatesPayload);
    },
    [onChange]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='flex overflow-x-auto'>
        {boards.map((board) => {
          return (
            <div key={board} className='flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]'>
              <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
              <Droppable droppableId={board}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`min-h-[200px] py-1.5 ${snapshot.isDraggingOver ? "bg-muted-foreground/20" : "transparent"}`}>
                    {tasks[board].map((task, index) => (
                      <Draggable key={task.$id || task.id} draggableId={task.$id || task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={provided.draggableProps.style}
                            className={snapshot.isDragging ? "opacity-75" : "opacity-100"}>
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
