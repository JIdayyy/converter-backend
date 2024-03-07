import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from '@ffmpeg-installer/ffmpeg';
import * as ffprobe from '@ffprobe-installer/ffprobe';

import { PassThrough } from 'stream';
import { FFMPEG_VIDEO_CODEC } from '../convert/constants';
import { Readable } from 'stream';
import { IProcessorService } from './processor-service.interface';
import { EventsService } from '../events/events.service';

type TVideoProcessorConfig = {
  toFormat: string;
  fromFormat: string;
  outputResolution: string;
};

type TVideoProcessorParams = {
  stream: Readable;
  config: TVideoProcessorConfig;
};

const getHHMMSS = () => {
  const date = new Date();
  return date.toTimeString().split(' ')[0];
};

@Injectable()
export class ProcessorService implements IProcessorService {
  constructor(private readonly socketService: EventsService) {}

  onModuleInit() {
    console.log(path.path, path.version);

    ffmpeg.setFfmpegPath(path.path);
    ffmpeg.setFfprobePath(ffprobe.path);
  }

  processVideo({ stream, config }: TVideoProcessorParams): PassThrough {
    const passThrough = new PassThrough();
    let totalTime = 0;
    const socketService = this.socketService;
    ffmpeg(stream).ffprobe(0, function (err, data) {
      if (err) {
        console.log('Error: ' + err);
        return;
      }
      console.log('-------------------------------------');

      console.dir(data, { depth: null, colors: true });

      console.log('FORMAT: ' + data.format.format_name);
      console.log('DURATION: ' + data.format.duration);
      console.log('SIZE: ' + data.format.size);
      console.log('BITRATE: ' + data.format.bit_rate);
      console.log('CODEC: ' + data.format.codec_long_name);
    });

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
      .on('stdout', function (err) {
        console.log('Stdout output: ' + err.message);
      })
      .on('stderr', function (stderrLine) {
        console.log('Stderr output: ' + stderrLine);
        socketService.handleEvent(
          'conversion-event',
          `${getHHMMSS()} ${stderrLine}`,
        );
      })
      .on('end', (data) => {
        console.log('-------------------------------------');
        console.log(`Converted to ${config.toFormat}`, data);
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
