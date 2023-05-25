import React, { useState } from 'react';
import { FileUpload } from './file-upload';
import { TimesByStop } from './times-by-stop';
import { StopSelector } from './stop-selector';

export const GTFSViewer = () => {
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [stopTimes, setStopTimes] = useState([]);
  const [trips, setTrips] = useState([]);

  const [selectedStopId, setSelectedStopId] = useState(null);

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
        <>
          <h2>View Times by Stop</h2>
          <p>Select a stop to view the scheduled leave times.</p>
          <StopSelector stops={stops} setSelectedStopId={setSelectedStopId} />

          {selectedStopId ? (
            <TimesByStop
              selectedStopId={selectedStopId}
              routes={routes}
              stops={stops}
              allStopTimes={stopTimes}
              trips={trips}
            />
          ) : null}
        </>
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
