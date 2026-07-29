export class TaskRepository {
  constructor() {
    if (new.target === TaskRepository) {
      throw new TypeError('TaskRepository es un contrato y no puede instanciarse directamente.');
    }
  }

  findAll() {
    throw new Error('El método findAll debe ser implementado.');
  }

  saveAll(_tasks) {
    throw new Error('El método saveAll debe ser implementado.');
  }
}
