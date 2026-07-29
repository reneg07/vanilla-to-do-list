import { APP_MESSAGE } from '../shared/constants.js';
import { TaskValidationError } from './errors/TaskValidationError.js';

export class Task {
  constructor({ id, text, completed = false, createdAt = new Date().toISOString() }) {
    this.id = Task.normalizeId(id);
    this.text = Task.normalizeText(text);
    this.completed = Boolean(completed);
    this.createdAt = Task.normalizeDate(createdAt);

    Object.freeze(this);
  }

  static create({ id, text, now = () => new Date() }) {
    return new Task({
      id,
      text,
      completed: false,
      createdAt: now().toISOString(),
    });
  }

  static fromJSON(taskData) {
    return new Task(taskData);
  }

  toggleCompletion() {
    return new Task({
      ...this.toJSON(),
      completed: !this.completed,
    });
  }

  toJSON() {
    return {
      id: this.id,
      text: this.text,
      completed: this.completed,
      createdAt: this.createdAt,
    };
  }

  static normalizeId(id) {
    const normalizedId = Number(id);

    if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
      throw new TaskValidationError('El identificador de la tarea no es válido.');
    }

    return normalizedId;
  }

  static normalizeText(text) {
    if (typeof text !== 'string' || text.trim() === '') {
      throw new TaskValidationError(APP_MESSAGE.EMPTY_TASK);
    }

    return text.trim();
  }

  static normalizeDate(value) {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? new Date().toISOString()
      : date.toISOString();
  }
}
