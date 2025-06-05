import ExifParser from 'exif-parser';

export function extractEV(buffer) {
  try {
    const parser = ExifParser.create(buffer);
    const result = parser.parse();
    const iso = result.tags.ISO || 100;
    const aperture = result.tags.FNumber || 2.8;
    const shutter = result.tags.ExposureTime || 1 / 60;
    const ev = Math.log2((aperture * aperture) / shutter) - Math.log2(iso / 100);
    return Math.round(ev * 100) / 100;
  } catch (e) {
    return 0;
  }
}
