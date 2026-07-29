import './style.css';

import { TaskFilterRegistry } from './application/filters/TaskFilterRegistry.js';
import { TaskService } from './application/services/TaskService.js';
import { LocalStorageTaskRepository } from './infrastructure/storage/LocalStorageTaskRepository.js';
import { TaskController } from './presentation/TaskController.js';
import { TaskView } from './presentation/TaskView.js';

function bootstrap() {
  const taskRepository = new LocalStorageTaskRepository(window.localStorage);
  const taskFilterRegistry = new TaskFilterRegistry();
  const taskService = new TaskService(taskRepository, taskFilterRegistry);
  const taskView = new TaskView(document);
  const taskController = new TaskController(taskService, taskView);

  taskController.initialize();
}

document.addEventListener('DOMContentLoaded', bootstrap);
