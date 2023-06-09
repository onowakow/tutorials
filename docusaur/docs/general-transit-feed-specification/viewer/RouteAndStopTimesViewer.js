import React, { useEffect, useState } from 'react';
import { StopSelector } from './stop-selector';
import { RouteMap } from './RouteMap';

import { StopTimesTable } from './tables/StopTimesTable';

// TODO: Working on organizing these components. Hence the strange combo of functions
export const RouteAndStopTimesViewer = ({
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
          stops={stops}
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
