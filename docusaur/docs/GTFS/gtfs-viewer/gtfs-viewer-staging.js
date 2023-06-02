import React, { useState } from 'react';
import { FileUpload } from './file-upload';
import { AgencyTable } from './tables/AgencyTable';
import { RouteTable } from './tables/RouteTable';
import { FeedInfoTable } from './tables/FeedInfoTable';
import { CalendarTable } from './tables/CalendarTable';
import { CalendarExceptionsTable } from './tables/CalendarExceptionsTable';
import { RouteAndStopTimesViewer } from './RouteAndStopTimesViewer';

export const GTFSViewerStaging = () => {
  // States below are populated by <FileUpload />
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
      <p>
        Upload all of the files listed below. You may hold <em>shift</em> or{' '}
        <em>ctrl</em> to select multiple files at once, but do not upload them
        in a folder.
      </p>
      <FileUpload fileStateMap={fileStateMap} />

      <h2>Agency (agency.txt)</h2>
      <p>
        Information about the transit agency(s) that provide service in this
        dataset.
      </p>
      {agency.length > 0 ? (
        <AgencyTable agency={agency} />
      ) : (
        <p>
          <em>No agency.txt</em>
        </p>
      )}

      <h2>Routes (routes.txt)</h2>
      <p>A route is a single service as seen by riders.</p>
      {routes.length > 0 ? (
        <RouteTable routes={routes} />
      ) : (
        <p>
          <em>No route.txt</em>
        </p>
      )}

      <h2>Service (calendar.txt)</h2>
      <p>
        Shows the start and end date for a given service, along with which days
        of the week bus service is provided. Note that the 'ServiceID' is not
        customer-facing.
      </p>
      {calendar.length > 0 ? (
        <CalendarTable calendar={calendar} />
      ) : (
        <p>
          <em>No calendar.txt</em>
        </p>
      )}

      <h2>Calendar Exceptions (calendar_dates.txt)</h2>
      <p>Exceptions to typical days of service like holidays.</p>
      {calendarDates.length > 0 ? (
        <CalendarExceptionsTable calendarDates={calendarDates} />
      ) : (
        <p>
          <em>No calendar_dates.txt</em>
        </p>
      )}

      <h2>Feed Info</h2>
      <p>
        Information about the GTFS feed. Contact information should be for
        technical support regarding the feed, not the service (issues with data,
        etc.).
      </p>
      {feedInfo.length > 0 ? (
        <FeedInfoTable feedInfo={feedInfo} />
      ) : (
        <p>
          <em>No feed_info.txt</em>
        </p>
      )}

      {isFileUploaded(routes) &&
      isFileUploaded(shapes) &&
      isFileUploaded(stops) &&
      isFileUploaded(stopTimes) &&
      isFileUploaded(trips) ? (
        <RouteAndStopTimesViewer
          routes={routes}
          shapes={shapes}
          stops={stops}
          stopTimes={stopTimes}
          trips={trips}
        />
      ) : null}
    </>
  );

  function isFileUploaded(state) {
    return state.length > 0;
  }
};
