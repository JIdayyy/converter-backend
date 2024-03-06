import { Inject, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { ProcessorService } from '../processor/processor.service';
import { MinioService } from 'nestjs-packages';

type TConvertConfig = {
  toFormat: string;
  fromFormat: string;
  outputResolution: string;
};

type TConvertParams = {
  stream: Readable;
  config: TConvertConfig;
  serverPath: string;
  onProgress?: (progress: string) => void;
  onEnd?: () => void;
};

@Injectable()
export class ConvertService {
  constructor(
    private readonly processorService: ProcessorService,
    private readonly minioService: MinioService,
  ) {}

  async convertVideo({ stream, config, serverPath }: TConvertParams) {
    const passThrough = this.processorService.processVideo({
      stream,
      config,
    });

    await this.minioService.writeStream({
      stream: passThrough,
      serverPath,
    });

    return this.minioService.getPresignedUrl(serverPath);
  }
}
