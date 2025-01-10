export class InternalServerError extends Error {
  constructor({ cause }) {
    super('Ocorreu um erro não esperado', { cause });
    this.name = 'InternalServerError';
    this.action = 'Entre em contato com o suporte';
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}
