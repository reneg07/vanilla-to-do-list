import { APP_MESSAGE } from '../shared/constants.js';

const SELECTOR = Object.freeze({
  TASK_INPUT: '#taskInput',
  ADD_BUTTON: '#addBtn',
  TASK_LIST: '#taskList',
  STATS: '#stats',
  FILTER_BUTTONS: '.filter-btn',
});

export class TaskView {
  constructor(documentReference, showAlert = (message) => window.alert(message)) {
    this.document = documentReference;
    this.showAlert = showAlert;

    this.taskInput = this.getRequiredElement(SELECTOR.TASK_INPUT);
    this.addButton = this.getRequiredElement(SELECTOR.ADD_BUTTON);
    this.taskList = this.getRequiredElement(SELECTOR.TASK_LIST);
    this.stats = this.getRequiredElement(SELECTOR.STATS);
    this.filterButtons = [...this.document.querySelectorAll(SELECTOR.FILTER_BUTTONS)];
  }

  bindAddTask(handler) {
    this.addButton.addEventListener('click', handler);

    this.taskInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handler();
      }
    });
  }

  bindFilterChange(handler) {
    this.filterButtons.forEach((button) => {
      button.addEventListener('click', () => handler(button.dataset.filter));
    });
  }

  bindTaskActions({ onToggle, onDelete }) {
    this.taskList.addEventListener('click', (event) => {
      const actionButton = event.target.closest('button[data-action]');

      if (!actionButton || !this.taskList.contains(actionButton)) {
        return;
      }

      const taskId = Number(actionButton.dataset.id);

      if (!Number.isInteger(taskId)) {
        return;
      }

      if (actionButton.dataset.action === 'toggle') {
        onToggle(taskId);
      }

      if (actionButton.dataset.action === 'delete') {
        onDelete(taskId);
      }
    });
  }

  getTaskText() {
    return this.taskInput.value;
  }

  clearTaskInput() {
    this.taskInput.value = '';
  }

  focusTaskInput() {
    this.taskInput.focus();
  }

  renderTasks(tasks) {
    if (tasks.length === 0) {
      this.renderEmptyState();
      return;
    }

    const fragment = this.document.createDocumentFragment();
    tasks.forEach((task) => fragment.appendChild(this.createTaskElement(task)));

    this.taskList.replaceChildren(fragment);
  }

  renderStats({ total, completed, active }) {
    this.stats.textContent = `Total: ${total} | Completadas: ${completed} | Activas: ${active}`;
  }

  setActiveFilter(activeFilter) {
    this.filterButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.filter === activeFilter);
    });
  }

  showError(message) {
    this.showAlert(message);
  }

  renderEmptyState() {
    const emptyMessage = this.document.createElement('p');
    emptyMessage.className = 'empty-state';
    emptyMessage.textContent = APP_MESSAGE.EMPTY_LIST;

    this.taskList.replaceChildren(emptyMessage);
  }

  createTaskElement(task) {
    const taskItem = this.document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.classList.toggle('completed', task.completed);

    const taskText = this.document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    const taskButtons = this.document.createElement('div');
    taskButtons.className = 'task-buttons';
    taskButtons.append(
      this.createActionButton({
        taskId: task.id,
        action: 'toggle',
        className: 'complete-btn',
        text: task.completed ? 'Reactivar' : 'Completar',
      }),
      this.createActionButton({
        taskId: task.id,
        action: 'delete',
        className: 'delete-btn',
        text: 'Eliminar',
      }),
    );

    taskItem.append(taskText, taskButtons);
    return taskItem;
  }

  createActionButton({ taskId, action, className, text }) {
    const button = this.document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.dataset.id = String(taskId);
    button.dataset.action = action;
    button.textContent = text;

    return button;
  }

  getRequiredElement(selector) {
    const element = this.document.querySelector(selector);

    if (!element) {
      throw new Error(`No se encontró el elemento requerido: ${selector}`);
    }

    return element;
  }
}
