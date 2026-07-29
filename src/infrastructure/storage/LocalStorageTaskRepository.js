import { Task } from '../../domain/Task.js';
import { StorageError } from '../../domain/errors/StorageError.js';
import { TaskRepository } from '../../domain/repositories/TaskRepository.js';
import { STORAGE_KEY } from '../../shared/constants.js';

export class LocalStorageTaskRepository extends TaskRepository {
  constructor(storage, storageKey = STORAGE_KEY) {
    super();

    if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
      throw new TypeError('Se requiere un mecanismo de almacenamiento válido.');
    }

    this.storage = storage;
    this.storageKey = storageKey;
  }

  findAll() {
    try {
      const serializedTasks = this.storage.getItem(this.storageKey);

      if (!serializedTasks) {
        return [];
      }

      const taskData = JSON.parse(serializedTasks);

      if (!Array.isArray(taskData)) {
        throw new TypeError('El contenido almacenado no es una lista de tareas.');
      }

      return taskData.reduce((validTasks, rawTask) => {
        try {
          validTasks.push(Task.fromJSON(rawTask));
        } catch (error) {
          console.warn('Se ignoró una tarea almacenada con datos inválidos.', error);
        }

        return validTasks;
      }, []);
    } catch (error) {
      throw new StorageError('No fue posible leer las tareas almacenadas.', {
        cause: error,
      });
    }
  }

  saveAll(tasks) {
    try {
      const taskData = tasks.map((task) => task.toJSON());
      this.storage.setItem(this.storageKey, JSON.stringify(taskData));
    } catch (error) {
      throw new StorageError('No fue posible guardar las tareas.', {
        cause: error,
      });
    }
  }
}
