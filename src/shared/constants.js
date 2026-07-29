export const STORAGE_KEY = 'tasks';

export const TASK_FILTER = Object.freeze({
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
});

export const APP_MESSAGE = Object.freeze({
  EMPTY_TASK: 'Por favor escribe una tarea',
  LOAD_ERROR: 'No fue posible cargar las tareas guardadas.',
  SAVE_ERROR: 'No fue posible guardar los cambios.',
  UNEXPECTED_ERROR: 'Ocurrió un error inesperado.',
  EMPTY_LIST: 'No hay tareas para mostrar',
});
