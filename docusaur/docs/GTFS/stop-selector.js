import React, { useState } from 'react';

export const StopSelector = ({ stops, selectedStopId, setSelectedStopId }) => {
  const alphabetizedStops = stops.sort((a, b) =>
    a.stop_name.localeCompare(b.stop_name)
  );

  const handleStopSelect = (event) => {
    const stopId = event.target.value;
    setSelectedStopId(stopId);
  };

  return (
    <>
      <select defaultValue="" onChange={handleStopSelect}>
        <option value="" disabled>
          Select a stop
        </option>
        {alphabetizedStops.map((stop) => (
          <option key={stop.stop_id} value={stop.stop_id}>
            {stop.stop_name}
          </option>
        ))}
      </select>
    </>
  );
};
