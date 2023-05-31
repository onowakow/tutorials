import React, { useEffect, useState } from 'react';
import { StopSelector } from './stop-selector';
import { RouteMap } from './RouteMap';

// TABLE COMPONENTS
import { AgencyTable } from './tables/AgencyTable';
import { CalendarTable } from './tables/CalendarTable';
import { CalendarExceptionsTable } from './tables/CalendarExceptionsTable';
import { RouteTable } from './tables/RouteTable';
import { StopTimesTable } from './tables/StopTimesTable';

// UTILITIES
import { formatDate } from './utilities/formatDate';

export const GTFSViewer = ({
  agency,
  calendar,
  calendarDates,
  feedInfo,
  routes,
  shapes,
  stops,
  stopTimes,
  trips,
}) => {
  const [selectedStopId, setSelectedStopId] = useState('');
  const [informationRichStopTimes, setInformationRichStopTimes] = useState([]);
  // RoutePolylines combine routes and shapes
  const [routePolylines, setRoutePolylines] = useState([]);

  useEffect(() => {
    const informationRichStopTimes = createInformationRichStopTimes(
      stopTimes,
      trips,
      routes
    );
    setInformationRichStopTimes(informationRichStopTimes);

    const routePolylines = createRoutePolylines(routes, shapes);
    setRoutePolylines(routePolylines);
  }, []);

  return (
    <>
      <h2>Agency (agency.txt)</h2>
      <AgencyTable agency={agency} />
      <h2>Routes (routes.txt)</h2>
      <RouteTable routes={routes} />
      <h2>Service (calendar.txt)</h2>
      <p>
        Shows the start and end date for a given service, along with which days
        of the week bus service is provided. Note that the 'ServiceID' is not
        customer-facing.
      </p>
      <CalendarTable calendar={calendar} />
      <h2>Calendar Exceptions (calendar_dates.txt)</h2>
      <CalendarExceptionsTable calendarDates={calendarDates} />
      <h2>Feed Info</h2>
      <p>
        Information about the GTFS feed. Contact information should be for
        technical support (issues with data, etc.).
      </p>
      <FeedInfoTable feedInfo={feedInfo} />
      <h2>Route Map</h2>
      {routePolylines.length > 0 ? (
        <RouteMap
          selectedStopId={selectedStopId}
          setSelectedStopId={setSelectedStopId}
          stops={stops}
          routePolylines={routePolylines}
        />
      ) : (
        <em>Map data not yet loaded.</em>
      )}
      <h2 id="times-by-stop">View Times by Stop</h2>
      <p>Select a stop to view the scheduled leave times.</p>
      <StopSelector
        stops={stops}
        selectedStopId={selectedStopId}
        setSelectedStopId={setSelectedStopId}
      />

      {selectedStopId ? (
        // TODO: This could be a general display component that
        // takes a 'query' argument instead of specifically a stop_id
        <StopTimesTable
          selectedStopId={selectedStopId}
          informationRichStopTimes={informationRichStopTimes}
        />
      ) : null}
    </>
  );
};

function createRoutePolylines(routes, shapes) {
  const routePolylines = routes.map((route) => {
    const routePolyline = {
      ...route,
      polyline: [],
    };

    // shape_id is equal to route_id in the current setup.
    const pointsOnRoute = shapes.filter(
      (point) => point.shape_id === route.route_id
    );

    const orderedPointsOnRoute = pointsOnRoute.sort(
      (a, b) => a.shape_pt_sequence - b.shape_pt_sequence
    );

    const polyline = orderedPointsOnRoute.map((point) => ({
      lat: Number(point.shape_pt_lat),
      lng: Number(point.shape_pt_lon),
    }));

    routePolyline.polyline = polyline;
    return routePolyline;
  });

  return routePolylines;
}

function createInformationRichStopTimes(stopTimes, trips, routes) {
  const informationRichStopTimes = stopTimes.map((stopTime) => {
    const {
      trip_id,
      departure_time,
      pickup_type,
      stop_id,
      drop_off_type,
      stop_headsign,
      timepoint,
    } = stopTime;

    const pickupTypeDescription =
      pickup_type == 3
        ? 'Notify driver for pickup'
        : pickup_type == 1
        ? 'No pickup'
        : 'Normal pickup';

    const dropOffTypeDescription =
      drop_off_type == 3
        ? 'Notify driver for drop off'
        : drop_off_type == 1
        ? 'No drop off'
        : 'Normal drop off';

    const timepointDescription = timepoint == 0 ? 'Approximate' : 'Strict';

    const trip = trips.find((trip) => trip.trip_id === trip_id);
    const { route_id } = trip;
    const route = routes.find((route) => route.route_id === route_id);
    const { route_long_name, route_color, route_text_color } = route;
    const routeStyle = {
      backgroundColor: `#${route_color}`,
      color: `#${route_text_color}`,
    };

    return {
      route_long_name,
      routeStyle,
      stop_id,
      pickupTypeDescription,
      dropOffTypeDescription,
      timepointDescription,
      stop_headsign,
      departure_time,
    };
  });

  return informationRichStopTimes;
}

const FeedInfoTable = ({ feedInfo }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Publisher</th>
          <th>Publisher URL</th>
          <th>Language</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Version</th>
          <th>Contact Email</th>
        </tr>
      </thead>
      <tbody>
        {feedInfo.map((feed) => (
          <tr key={feed.feed_version}>
            <td>{feed.feed_publisher_name}</td>
            <td>
              <a href={feed.feed_publisher_url}>{feed.feed_publisher_url}</a>
            </td>
            <td>{feed.feed_lang}</td>
            <td>{formatDate(feed.feed_start_date)}</td>
            <td>{formatDate(feed.feed_end_date)}</td>
            <td>{feed.feed_version}</td>
            <td>{feed.feed_contact_email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
