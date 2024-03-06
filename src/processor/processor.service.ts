import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from '@ffmpeg-installer/ffmpeg';
import { PassThrough } from 'stream';
import { FFMPEG_VIDEO_CODEC } from '../convert/constants';
import { Readable } from 'stream';
import { IProcessorService } from './processor-service.interface';

type TVideoProcessorConfig = {
  toFormat: string;
  fromFormat: string;
  outputResolution: string;
};

type TVideoProcessorParams = {
  stream: Readable;
  config: TVideoProcessorConfig;
};

@Injectable()
export class ProcessorService implements IProcessorService {
  onModuleInit() {
    ffmpeg.setFfmpegPath(path.path);
  }

  processVideo({ stream, config }: TVideoProcessorParams): PassThrough {
    const passThrough = new PassThrough();
    let totalTime = 0;

    ffmpeg(stream)
      .videoCodec(FFMPEG_VIDEO_CODEC)
      .on('codecData', (data) => {
        // HERE YOU GET THE TOTAL TIME
        totalTime = parseInt(data.duration.replace(/:/g, ''));
      })
      .on('progress', (progress) => {
        // HERE IS THE CURRENT TIME
        const time = parseInt(progress.timemark.replace(/:/g, ''));

        // AND HERE IS THE CALCULATION
        const percent = (time / totalTime) * 100;

        console.log('PERCENT', percent);
      })
      /*    .on('stderr', function (stderrLine) {
        console.log('Stderr output: ' + stderrLine);
      })
      .on('stdout', function (err) {
        console.log('Stdout output: ' + err.message);
      })*/
      .on('end', (data) => {
        console.log('-------------------------------------');
        console.log(`Converted to ${config.toFormat}`, data);
      })
      .on('error', function (err, stdout, stderr) {
        console.log(`Error: ${err}`);
        console.log('Stdout: %o', stdout);
        console.log('Stderr: %o', stderr);
      })
      .outputOption('-movflags frag_keyframe+empty_moov')
      .withSize(config.outputResolution)
      .toFormat('mp4')
      .stream(passThrough);

    return passThrough;
  }
}
