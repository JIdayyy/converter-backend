type TOutputResolution = '1080p' | '720p' | '480p' | '360p' | '240p' | '144p';
type TOutputFormat = 'mp4' | 'webm' | 'ogg' | 'mp3' | 'wav' | 'flac';

type InputFormat = 'mp4' | 'webm' | 'ogg' | 'mp3' | 'wav' | 'flac';
type OutputFormat = 'mp4' | 'webm' | 'ogg' | 'mp3' | 'wav' | 'flac';

type TConvertConfig = {
  toFormat: OutputFormat;
  exportResolution: TOutputResolution;
};
