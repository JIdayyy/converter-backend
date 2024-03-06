import { Controller, Post, Query, Req, Res } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { Request, Response } from 'express';

@Controller('convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @Post()
  async convert(
    @Req() req: Request,
    @Res() res: Response,
    @Query('fileName') fileName: string,
    @Query('resolution') resolution: string,
    @Query('format') format: string,
  ) {
    try {
      const [name, fromFormat] = fileName.split('.');

      const url = await this.convertService.convertVideo({
        stream: req,
        config: {
          toFormat: format,
          fromFormat,
          outputResolution: resolution,
        },
        serverPath: `/tmp/${name}_${resolution}_${new Date().getTime()}.${format}`,
      });
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send({ url });
      return url;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
