import { Get, Route } from 'tsoa';

interface PingResponse {
  message: string;
}

@Route('ping')
export default class PingController {
  @Get('/')
  public async getMessage(): Promise<PingResponse> {
    return {
      message: 'pong'
    };
  }
}

interface Test {
  thing: number;
}

const x1: Test = { thing: 1 };
const x2: Test = { thing: 2 };
console.log([x1, x2]);
