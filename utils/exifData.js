import ExifReader from 'exifreader';
import { pick, transform } from 'lodash';
import browserImageSize from 'browser-image-size';
import to from 'to-case';

const { Photo } = require('./Photo');
const { dateFormatter } = require('./formatDate');

const getExifData = async (buffer, file) => {
  const update = {};
  const paths = [
    'ImageWidth',
    'ImageLength',
    'Make',
    'Model',
    'FNumber',
    'ExposureProgram',
    'ISOSpeedRatings',
    'DateTimeOriginal',
    'ShutterSpeedValue',
    'FocalLength',
    'WhiteBalance',
    'LensModel'
  ];

  const transforms = {
    'ShutterSpeedValue': (result, value) =>  result['ShutterSpeedValue'] = value['description'],
    'FNumber': (result, value) => result['FNumber'] = value['description'],
    'FocalLength': (result, value) => result['FocalLength'] = `${value['description']}`.replace(' ', ''),
    'DateTimeOriginal': (result, value) => result['DateTimeOriginal'] = dateFormatter(value['description']),
    'Model': (result, value) => result['Model'] = value['description'].split('-')[1],
    'ExposureProgram': (result, value) => result['ExposureProgram'] = value['description'],
    'WhiteBalance': (result, value) => result['WhiteBalance'] = value['description'],
    'LensModel': (result, value) => result['LensModel'] = value['description'].substring(0, value['description'].lastIndexOf('(')).trim() //?
  };

  const data = transform(pick(ExifReader.load(buffer), paths), (result, value, key) => {
    result[key] = value['value'].length < 2 && Array.isArray(value['value']) ? value['value'][0] : value['value'];

    transforms[key] && transforms[key](result, value);
  }, {});


  if (data['ImageWidth'] && data['ImageLength']) {
    const photo = new Photo(data['ImageWidth'], data['ImageLength']);
    data.orientation = photo.orientation;
  } else {
    const blob = new Blob([buffer], { type: file.type });
    const { width, height } = await browserImageSize(blob);
    const photo = new Photo(width, height);
    data.orientation = photo.orientation;
  }

  for (let [key, value] of Object.entries(data)) {
    if (key === 'ISOSpeedRatings') {
      update['iso_speed_ratings'] = value;
      continue;
    }

    update[to.snake(key)] = value;
  }

  return update;
};

export { getExifData };
