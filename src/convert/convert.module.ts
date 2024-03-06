import { Module } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { ConvertController } from './convert.controller';

export const ProcessorService = Symbol('ProcessorService');

@Module({
  controllers: [ConvertController],
  providers: [ConvertService],
})
export class ConvertModule {}
