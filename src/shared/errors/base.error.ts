export abstract class BaseError extends Error {
  public readonly code: string;

  public readonly metadata?: Record<string, unknown>;

  constructor(message: string, code: string, metadata?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name; // Nombre de la clase para facilitar el debug
    this.code = code; // Código de error único
    this.metadata = metadata; // Información adicional para el contexto del error
  }
}
