import { TASK_FILTER } from '../../shared/constants.js';

const DEFAULT_FILTERS = Object.freeze({
  [TASK_FILTER.ALL]: (tasks) => [...tasks],
  [TASK_FILTER.ACTIVE]: (tasks) => tasks.filter((task) => !task.completed),
  [TASK_FILTER.COMPLETED]: (tasks) => tasks.filter((task) => task.completed),
});

export class TaskFilterRegistry {
  constructor(filters = DEFAULT_FILTERS) {
    this.filters = { ...filters };
  }

  has(filterName) {
    return typeof this.filters[filterName] === 'function';
  }

  apply(filterName, tasks) {
    const filter = this.filters[filterName] ?? this.filters[TASK_FILTER.ALL];
    return filter(tasks);
  }
}

export { DEFAULT_FILTERS };
