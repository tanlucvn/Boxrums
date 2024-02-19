import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'
import ffprobeStatic from 'ffprobe-static'
import { fileURLToPath } from 'url'

ffmpeg.setFfmpegPath(ffmpegStatic)
ffmpeg.setFfprobePath(ffprobeStatic.path)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createThumbnail = (file, dest, thumbFilename) => {
    return new Promise((resolve, reject) => {
        ffmpeg(file)
            .screenshots({
                folder: path.join(__dirname, '..', '..', '..', 'public', dest, 'thumbnails'),
                filename: thumbFilename,
                timestamps: ['1%'],
                size: '480x?'
            })
            .on('error', (err) => {
                reject(err)
            })
            .on('end', () => {
                resolve(thumbFilename)
            })
    })
}

export default createThumbnail