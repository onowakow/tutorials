import React, { useState } from 'react';

export const TimesByStop = ({
  selectedStopId,
  routes,
  stops,
  allStopTimes,
  trips,
}) => {
  const stopTimes = allStopTimes
    .filter((stopTime) => stopTime.stop_id === selectedStopId)
    .sort((a, b) => a.departure_time.localeCompare(b.departure_time));

  return (
    <div>
      {stopTimes.length === 0 ? <em>No rides available.</em> : null}
      {stopTimes.length !== 0 && (
        <table>
          <thead>
            <tr>
              <th>Departure Time</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {stopTimes.map((stopTime, index) => (
              <tr key={index}>
                <td>{stopTime.departure_time}</td>
                <td>
                  {stopTime.pickup_type == 3
                    ? 'Stop request'
                    : stopTime.pickup_type == 1
                    ? 'Drop off only'
                    : 'Normal pickup/drop off'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ul></ul>
    </div>
  );
};
