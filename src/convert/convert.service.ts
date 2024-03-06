import { Inject, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { IProcessorService } from './processor-service.interface';
import { ProcessorService } from './convert.module';

type TConvertConfig = {
  toFormat: string;
  fromFormat: string;
  outputResolution: string;
};

type TConvertParams = {
  stream: Readable;
  config: TConvertConfig;
};

@Injectable()
export class ConvertService {
  constructor(
    @Inject(ProcessorService)
    private readonly processorService: IProcessorService,
  ) {}

  convertVideo({ stream, config }: TConvertParams) {
    this.processorService.processVideo({
      stream,
      config,
    });
  }
}
