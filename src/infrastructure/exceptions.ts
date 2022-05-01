// Common Exception Types

export class FieldError extends Error {
  public code = 'field-error';
  private field: string;

  constructor(message: string, field: string) {
    super(message);
    this.field = field;
  }
  public toData() {
    return { code: this.code, field: this.field, message: this.message };
  }
}
export class DataValidationError extends Error {
  public code = 'data-validation-error';
  private errors: FieldError[];

  constructor(message: string, errors: FieldError[]) {
    super(message);
    this.errors = errors;
  }
  public toData() {
    return {
      code: this.code,
      message: this.message,
      errors: this.errors.map((e) => e.toData())
    };
  }
}

export class DoesNotExistException extends Error {
  constructor(message: string) {
    super(message);
    this.constructor = DoesNotExistException;
    //this.__proto__   = InvalidResourceId.prototype;
    this.message = message;
  }
}

export class BadRequestException extends Error {
  constructor(message: string) {
    super(message);
    this.constructor = BadRequestException;
    //this.__proto__   = InvalidResourceId.prototype;
    this.message = message;
  }
}

export class AuthenticationException extends Error {
  constructor(message: string) {
    super(message);
    this.constructor = AuthenticationException;
    //this.__proto__   = InvalidResourceId.prototype;
    this.message = message;
  }
}

export class PermissionException extends Error {
  constructor(message: string) {
    super(message);
    this.constructor = PermissionException;
    //this.__proto__   = InvalidResourceId.prototype;
    this.message = message;
  }
}

export class HTTPMethodNotAllowed extends Error {
  constructor(message: string) {
    super(message);
    this.constructor = PermissionException;
    //this.__proto__   = InvalidResourceId.prototype;
    this.message = message;
  }
}

export class ConflictException extends Error {
  constructor(message: string) {
    super(message);
    this.constructor = PermissionException;
    //this.__proto__   = InvalidResourceId.prototype;
    this.message = message;
  }
}
