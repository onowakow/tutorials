import React, { useEffect, useState } from 'react';
import { TimesByStop } from './times-by-stop';
import { StopSelector } from './stop-selector';

export const GTFSViewer = ({ stops, routes, trips, stopTimes }) => {
  // When state changes, what is re-evaluated?
  const [selectedStopId, setSelectedStopId] = useState('');
  const [informationRichStopTimes, setInformationRichStopTimes] = useState([]);

  useEffect(() => {
    const informationRichStopTimes = stopTimes.map((stopTime) => {
      const {
        trip_id,
        departure_time,
        pickup_type,
        stop_id,
        drop_off_type,
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
        departure_time,
      };
    });

    setInformationRichStopTimes(informationRichStopTimes);
  }, []);

  return (
    <>
      <h2>Routes</h2>
      <table>
        <thead>
          <tr>
            <th>Route Long Name</th>
            <th>Route Color</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route, index) => (
            <tr key={index}>
              <td>{route.route_long_name}</td>
              <td
                style={{
                  backgroundColor: `#${route.route_color}`,
                  color: `#${route.route_text_color}`,
                }}
              >
                {route.route_color}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>View Times by Stop</h2>
      <p>Select a stop to view the scheduled leave times.</p>
      <StopSelector
        stops={stops}
        selectedStopId={selectedStopId}
        setSelectedStopId={setSelectedStopId}
      />

      {selectedStopId ? (
        // TODO: This could be a general display component that
        // takes a 'query' argument instead of specifically a stop_id
        <TimesByStop
          selectedStopId={selectedStopId}
          informationRichStopTimes={informationRichStopTimes}
        />
      ) : null}
    </>
  );
};
