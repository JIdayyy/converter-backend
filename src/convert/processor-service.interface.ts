import { OnModuleInit } from '@nestjs/common';
import { PassThrough } from 'stream';

export interface IProcessorService extends OnModuleInit {
  onModuleInit(): void;
  processVideo({ stream, config }: { stream: any; config: any }): PassThrough;
}
