import React, { useState } from 'react';
import { FileUpload } from './file-upload';
import { GTFSViewer } from './gtfs-viewer';

// Stages files as they are 'uploaded' into memory. When all files are uploaded
// render gtfs viewer
export const GTFSViewerStaging = () => {
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

  return (
    <>
      <h2>Upload GTFS Files</h2>
      <FileUpload fileStateMap={fileStateMap} />

      {areAllFilesLoaded() ? (
        <GTFSViewer
          routes={routes}
          stops={stops}
          stopTimes={stopTimes}
          trips={trips}
        />
      ) : null}
    </>
  );

  function areAllFilesLoaded() {
    let filesAreLoaded = true;

    fileStateMap.forEach((fileState) => {
      if (fileState.state.length === 0) {
        filesAreLoaded = false;
      }
    });

    return filesAreLoaded;
  }
};
