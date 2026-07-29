export class StorageError extends Error {
  constructor(message, options = {}) {
    super(message, options);
    this.name = 'StorageError';
  }
}
