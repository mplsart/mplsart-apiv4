// Common Exception Types

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
