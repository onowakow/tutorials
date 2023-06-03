import React from 'react';

export const StopTimesTable = ({
  stops,
  selectedStopId,
  informationRichStopTimes,
}) => {
  const getStopFilter = (stops, selectedStopId) => {
    let stopsFilter = () => {};

    const selectedStop = stops.find((stop) => stop.stop_id === selectedStopId);
    const selectedStopIsStation = Number(selectedStop.location_type) === 1;

    if (selectedStopIsStation) {
      const stopsAtStation = stops.filter(
        (stop) => stop.parent_station === selectedStopId
      );

      stopsFilter = (stopTime) =>
        stopsAtStation.findIndex(
          (stop) => stop.stop_id === stopTime.stop_id
        ) !== -1;
    } else {
      stopsFilter = (stopTime) => stopTime.stop_id === selectedStopId;
    }

    return stopsFilter;
  };

  const stopTimes = informationRichStopTimes
    .filter(getStopFilter(stops, selectedStopId))
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
