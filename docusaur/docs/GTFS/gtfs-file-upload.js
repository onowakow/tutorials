import React from 'react';
import { useState } from 'react';

const readCSVtoJSON = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const string = e.target.result;
        const all_rows = string.split('\n');
        const keys = all_rows[0].split(',');
        const data_rows = all_rows.slice(1);

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
};

export const FileUpload = () => {
  const [areFilesUploaded, setAreFilesUploaded] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [stopTimes, setStopTimes] = useState([]);
  const [trips, setTrips] = useState([]);

  const fileStateMap = [
    {
      name: 'stop_times.txt',
      state: stopTimes,
      setState: setStopTimes,
    },
    {
      name: 'routes.txt',
      state: routes,
      setState: setRoutes,
    },
    {
      name: 'stops.txt',
      state: stops,
      setState: setStops,
    },
    {
      name: 'trips.txt',
      state: trips,
      setState: setTrips,
    },
  ];

  const handleFileUpload = (event) => {
    setAreFilesUploaded(true);

    const files = event.target.files;

    Array.from(files).forEach((file) => {
      readCSVtoJSON(file).then((json) => {
        const { name: fileName } = file;

        const fileState = fileStateMap.find((fileState) => {
          const { name } = fileState;
          return name == fileName;
        });

        if (!fileState) {
          alert('Invalid file');
          return;
        }

        fileState.setState(json);
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
            console.log(fileIconStyle);
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
