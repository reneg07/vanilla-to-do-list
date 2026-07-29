import { Task } from '../../domain/Task.js';
import { TaskNotFoundError } from '../../domain/errors/TaskNotFoundError.js';
import { TASK_FILTER } from '../../shared/constants.js';

export class TaskService {
  constructor(taskRepository, taskFilterRegistry) {
    this.validateDependencies(taskRepository, taskFilterRegistry);

    this.taskRepository = taskRepository;
    this.taskFilterRegistry = taskFilterRegistry;
    this.tasks = [];
    this.nextTaskId = 1;
  }

  loadTasks() {
    const storedTasks = this.taskRepository.findAll();

    this.tasks = storedTasks;
    this.nextTaskId = this.calculateNextTaskId(storedTasks);

    return this.getTasks();
  }

  getTasks(filterName = TASK_FILTER.ALL) {
    return this.taskFilterRegistry.apply(filterName, this.tasks);
  }

  supportsFilter(filterName) {
    return this.taskFilterRegistry.has(filterName);
  }

  createTask(text) {
    const task = Task.create({
      id: this.nextTaskId,
      text,
    });

    const updatedTasks = [...this.tasks, task];
    this.persist(updatedTasks);

    this.nextTaskId += 1;
    return task;
  }

  toggleTask(taskId) {
    const normalizedTaskId = Number(taskId);
    const taskIndex = this.findTaskIndex(normalizedTaskId);
    const updatedTask = this.tasks[taskIndex].toggleCompletion();
    const updatedTasks = [...this.tasks];

    updatedTasks[taskIndex] = updatedTask;
    this.persist(updatedTasks);

    return updatedTask;
  }

  deleteTask(taskId) {
    const normalizedTaskId = Number(taskId);
    const taskIndex = this.findTaskIndex(normalizedTaskId);
    const updatedTasks = this.tasks.filter((_, index) => index !== taskIndex);

    this.persist(updatedTasks);
  }

  getStats() {
    return this.tasks.reduce(
      (stats, task) => {
        stats.total += 1;

        if (task.completed) {
          stats.completed += 1;
        } else {
          stats.active += 1;
        }

        return stats;
      },
      { total: 0, completed: 0, active: 0 },
    );
  }

  persist(updatedTasks) {
    this.taskRepository.saveAll(updatedTasks);
    this.tasks = updatedTasks;
  }

  findTaskIndex(taskId) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      throw new TaskNotFoundError(taskId);
    }

    return taskIndex;
  }

  calculateNextTaskId(tasks) {
    const highestId = tasks.reduce(
      (currentHighestId, task) => Math.max(currentHighestId, task.id),
      0,
    );

    return highestId + 1;
  }

  validateDependencies(taskRepository, taskFilterRegistry) {
    const isRepositoryValid =
      taskRepository &&
      typeof taskRepository.findAll === 'function' &&
      typeof taskRepository.saveAll === 'function';

    const isFilterRegistryValid =
      taskFilterRegistry &&
      typeof taskFilterRegistry.apply === 'function' &&
      typeof taskFilterRegistry.has === 'function';

    if (!isRepositoryValid) {
      throw new TypeError('TaskService requiere un repositorio de tareas válido.');
    }

    if (!isFilterRegistryValid) {
      throw new TypeError('TaskService requiere un registro de filtros válido.');
    }
  }
}
