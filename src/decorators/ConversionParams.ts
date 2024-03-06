import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ConversionParams = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    console.log(data);
    const req: Request = ctx.switchToHttp().getRequest();

    const { toFormat, exportResolution } = req.query;

    if (!toFormat || !exportResolution) {
      throw new Error('Invalid conversion parameters');
    }

    if (toFormat === 'mp4') {
      return {
        toFormat,
        exportResolution,
        type: 'video',
      };
    }

    if (toFormat === 'mp3') {
      return {
        toFormat,
        type: 'audio',
      };
    }
  },
);
