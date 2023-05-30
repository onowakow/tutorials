import React, { useState } from 'react';
import { FileUpload } from './file-upload';
import { GTFSViewer } from './gtfs-viewer';

// Stages files as they are 'uploaded' into memory. When all files are uploaded
// render gtfs viewer
export const GTFSViewerStaging = () => {
  const [agency, setAgency] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [calendarDates, setCalendarDates] = useState([]);
  const [feedInfo, setFeedInfo] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [stops, setStops] = useState([]);
  const [stopTimes, setStopTimes] = useState([]);
  const [trips, setTrips] = useState([]);

  const fileStateMap = [
    {
      name: 'agency.txt',
      state: agency,
      setState: setAgency,
    },
    {
      name: 'calendar.txt',
      state: calendar,
      setState: setCalendar,
    },
    {
      name: 'calendar_dates.txt',
      state: calendarDates,
      setState: setCalendarDates,
    },
    {
      name: 'feed_info.txt',
      state: feedInfo,
      setState: setFeedInfo,
    },
    {
      name: 'routes.txt',
      state: routes,
      setState: setRoutes,
    },
    {
      name: 'shapes.txt',
      state: shapes,
      setState: setShapes,
    },
    {
      name: 'stops.txt',
      state: stops,
      setState: setStops,
    },
    {
      name: 'stop_times.txt',
      state: stopTimes,
      setState: setStopTimes,
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
          shapes={shapes}
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
