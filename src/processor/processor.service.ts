import { Injectable, OnModuleInit } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import { path } from '@ffmpeg-installer/ffmpeg';
import { PassThrough } from 'stream';
import { FFMPEG_VIDEO_CODEC } from '../convert/constants';
import { Readable } from 'stream';
import { IProcessorService } from '../convert/processor-service.interface';

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
export class FfmpegProcessorService implements IProcessorService {
  onModuleInit() {
    ffmpeg.setFfmpegPath(path);
  }

  processVideo({ stream, config }: TVideoProcessorParams): PassThrough {
    const passThrough = new PassThrough();

    ffmpeg(stream)
      .videoCodec(FFMPEG_VIDEO_CODEC)
      .on('progress', (progress) => {
        console.log('Processing: ' + progress.timemarks + '% done');
      })
      .on('codecData', function (data) {
        console.log('CODEC DATA', data);
      })
      .on('stderr', function (stderrLine) {
        console.log('Stderr output: ' + stderrLine);
      })
      .on('stdout', function (err) {
        console.log('Stdout output: ' + err.message);
      })
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
      .toFormat('mp4')
      .stream(passThrough);

    return passThrough;
  }
}
