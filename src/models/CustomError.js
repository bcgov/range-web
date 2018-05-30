export default class CustumError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CustomError';
  }
}
