import React from 'react';

export const FileUpload = ({ fileStateMap }) => {
  const handleFileUpload = (event) => {
    const files = event.target.files;

    Array.from(files).forEach((file) => {
      readCSVtoJSON(file).then((fileDataJSON) => {
        const { name: fileName } = file;

        const fileState = fileStateMap.find((fileState) => {
          const { name } = fileState;
          return name == fileName;
        });

        if (!fileState) {
          alert('Invalid file');
          return;
        }

        const { setState } = fileState;

        setState(fileDataJSON);
      });
    });
  };

  return (
    <>
      <div style={styles.fileIconContainer}>
        {fileStateMap.map((fileState, index) => {
          const { name: fileName, state: fileContents } = fileState;
          let fileIconStyle = styles.fileIcon;

          if (fileContents.length > 0) {
            fileIconStyle = { ...fileIconStyle, ...styles.fileIconSuccess };
          }

          return (
            <div key={index} style={fileIconStyle}>
              {fileName}
            </div>
          );
        })}
      </div>
      <div>
        <input type="file" onChange={handleFileUpload} multiple></input>
      </div>
    </>
  );
};

const styles = {
  fileIcon: {
    display: 'block',
    border: '1px solid',
    marginRight: '.5rem',
    padding: '0.2rem .6rem .2rem .6rem',
    borderRadius: '4px',
    opacity: 0.4,
    marginBottom: '.5rem',
  },
  fileIconSuccess: {
    opacity: 1,
    backgroundColor: '#28a745',
    color: 'white',
  },
  fileIconContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
};

function readCSVtoJSON(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const string = e.target.result;
        const all_rows = string.split('\n');
        const keys = all_rows[0].split(',');
        let data_rows = all_rows.slice(1);
        // Remove empty rows (typically final row will be empty because of trailing \n)
        data_rows = data_rows.filter((row) => row !== '');

        const json = [];

        data_rows.forEach((stop_time) => {
          const values = stop_time.split(',');
          const valueObject = {};

          keys.forEach((key, index) => {
            valueObject[key] = values[index];
          });

          json.push(valueObject);
        });

        resolve(json);
      };

      reader.readAsText(file);
    } catch (err) {
      reject(err);
    }
  });
}
