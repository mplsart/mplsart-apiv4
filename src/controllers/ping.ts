import { Get, Route } from 'tsoa';
import supabase from '../infrastructure/supabase';
interface PingResponse {
  message: string;
}

@Route('ping')
export default class PingController {
  @Get('/')
  public async getMessage(): Promise<PingResponse> {
    const { data, error } = await supabase.from('Tasks').select();

    let test = 'ol';
    if (data && data.length > 0) {
      test = JSON.stringify(data[0]);
    }

    return {
      message: `pong ${test}`
    };
  }
}
