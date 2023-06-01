import React from 'react';

export const StopTimesTable = ({
  selectedStopId,
  informationRichStopTimes,
}) => {
  const stopTimes = informationRichStopTimes
    .filter((stopTime) => stopTime.stop_id === selectedStopId)
    .sort((a, b) => a.departure_time.localeCompare(b.departure_time));

  return (
    <div>
      {stopTimes.length === 0 ? (
        <em style={{ color: 'gray' }}>No rides available from this stop.</em>
      ) : null}
      {stopTimes.length !== 0 && (
        <table>
          <thead>
            <tr>
              <th>Departure Time</th>
              <th>Pickup type</th>
              <th>Drop off type</th>
              <th>Stop Headsign</th>
              <th>Timepoint</th>
              <th>Route</th>
            </tr>
          </thead>
          <tbody>
            {stopTimes.map((stopTime, index) => (
              <tr key={index}>
                <td>{stopTime.departure_time}</td>
                <td>{stopTime.pickupTypeDescription}</td>
                <td>{stopTime.dropOffTypeDescription}</td>
                <td>{stopTime.stop_headsign}</td>
                <td>{stopTime.timepointDescription}</td>
                <td style={stopTime.routeStyle}>{stopTime.route_long_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ul></ul>
    </div>
  );
};
