import { Module } from '@nestjs/common';
import { FfmpegProcessorService } from './processor.service';
import { ConvertModule, ProcessorService } from '../convert/convert.module';

@Module({
  imports: [ConvertModule],
  controllers: [],
  providers: [
    FfmpegProcessorService,
    {
      provide: ProcessorService,
      useClass: FfmpegProcessorService,
    },
  ],
})
export class ProcessorModule {}
