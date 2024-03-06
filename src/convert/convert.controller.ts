import { Controller, Post, Req, Res, StreamableFile } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { Request, Response } from 'express';

@Controller('convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @Post()
  async convert(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    /* const stream = this.convertService.convertVideo({
      stream: req,
      config: {
        toFormat: 'mp4',
      },
    });

    stream.on('error', (err) => {
      console.log('Error', err);
    });

    stream.on('end', () => {
      console.log('Stream ended');
    });

    stream.on('data', (chunk) => {
      console.log('Chunk', chunk);
    });

    return new StreamableFile(stream);*/
  }
}
