import { StorageError } from '../domain/errors/StorageError.js';
import { TaskValidationError } from '../domain/errors/TaskValidationError.js';
import { APP_MESSAGE, TASK_FILTER } from '../shared/constants.js';

export class TaskController {
  constructor(taskService, taskView) {
    this.taskService = taskService;
    this.taskView = taskView;
    this.currentFilter = TASK_FILTER.ALL;
  }

  initialize() {
    this.bindEvents();

    try {
      this.taskService.loadTasks();
    } catch (error) {
      this.handleError(error, APP_MESSAGE.LOAD_ERROR);
    }

    this.refreshView();
  }

  bindEvents() {
    this.taskView.bindAddTask(() => this.addTask());
    this.taskView.bindFilterChange((filterName) => this.changeFilter(filterName));
    this.taskView.bindTaskActions({
      onToggle: (taskId) => this.toggleTask(taskId),
      onDelete: (taskId) => this.deleteTask(taskId),
    });
  }

  addTask() {
    try {
      this.taskService.createTask(this.taskView.getTaskText());
      this.taskView.clearTaskInput();
      this.taskView.focusTaskInput();
      this.refreshView();
    } catch (error) {
      this.handleError(error, APP_MESSAGE.SAVE_ERROR);
    }
  }

  toggleTask(taskId) {
    try {
      this.taskService.toggleTask(taskId);
      this.refreshView();
    } catch (error) {
      this.handleError(error, APP_MESSAGE.SAVE_ERROR);
    }
  }

  deleteTask(taskId) {
    try {
      this.taskService.deleteTask(taskId);
      this.refreshView();
    } catch (error) {
      this.handleError(error, APP_MESSAGE.SAVE_ERROR);
    }
  }

  changeFilter(filterName) {
    if (!this.taskService.supportsFilter(filterName)) {
      return;
    }

    this.currentFilter = filterName;
    this.taskView.setActiveFilter(filterName);
    this.taskView.renderTasks(this.taskService.getTasks(filterName));
  }

  refreshView() {
    this.taskView.renderTasks(this.taskService.getTasks(this.currentFilter));
    this.taskView.renderStats(this.taskService.getStats());
    this.taskView.setActiveFilter(this.currentFilter);
  }

  handleError(error, fallbackMessage) {
    console.error(error);

    if (error instanceof TaskValidationError) {
      this.taskView.showError(error.message);
      return;
    }

    if (error instanceof StorageError) {
      this.taskView.showError(fallbackMessage);
      return;
    }

    this.taskView.showError(APP_MESSAGE.UNEXPECTED_ERROR);
  }
}
