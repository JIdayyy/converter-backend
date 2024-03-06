import { Module } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { ConvertController } from './convert.controller';
import { ProcessorService } from '../processor/processor.service';
import { MinioModule } from 'nestjs-packages';

@Module({
  controllers: [ConvertController],
  providers: [ConvertService, ProcessorService],
  imports: [MinioModule],
})
export class ConvertModule {}
