export class TaskNotFoundError extends Error {
  constructor(taskId) {
    super(`No se encontró la tarea con id ${taskId}.`);
    this.name = 'TaskNotFoundError';
    this.taskId = taskId;
  }
}
