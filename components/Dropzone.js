import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

import { getExifData } from '../utils/exifData';

import styles from './Dropzone.module.css';

const upload = async (data) => {
  return await axios({
    method: 'post',
    url: 'http://localhost:3001/upload',
    data,
  }).catch(e => {
    console.error(e.message);
  });
};

const handleClick = (evt) => {
  evt.preventDefault();
}

const Dropzone = () => {
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(async (file) => {
      console.log(file);
      const fr = new FileReader(file);

      fr.onload = async () => {
        const binaryStr = fr.result;
        const exifData = await getExifData(binaryStr, file);
        const formData = new FormData();

        formData.append('fileUpload', file);
        formData.append('exifData', JSON.stringify(exifData, null, 2));

        const res = await upload(formData);
        console.log(res);
      };

      fr.readAsArrayBuffer(file);
    });

  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className={styles.dropzone}>
      <div className={styles.dropzone__zone} {...getRootProps()} onClick={handleClick}>
        <input className={styles.dropzone__input} {...getInputProps()} />
        {
          isDragActive ?
            <p className={styles.dropzone__zone__message}>Drop</p> :
            <p className={styles.dropzone__zone__message}>Drag 'n' drop</p>
        }
      </div>
    </div>
  )
}

export default Dropzone;
