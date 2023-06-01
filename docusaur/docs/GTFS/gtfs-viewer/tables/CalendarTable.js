import React from 'react';
import { formatDate } from '../utilities/formatDate';

export const CalendarTable = ({ calendar }) => {
  const formatServiceDay = (dayOfWeek) => {
    if (dayOfWeek == 0) {
      return 'No';
    } else {
      return 'Yes';
    }
  };
  return (
    <table>
      <thead>
        <tr>
          <th>Service ID</th>
          <th>Service Start Date</th>
          <th>Service End Date</th>
          <th>Monday</th>
          <th>Tuesday</th>
          <th>Wednesday</th>
          <th>Thursday</th>
          <th>Friday</th>
          <th>Saturday</th>
          <th>Sunday</th>
        </tr>
      </thead>
      <tbody>
        {calendar.map((ruleset) => {
          return (
            <tr key={ruleset.service_id}>
              <td>{ruleset.service_id}</td>
              <td>{formatDate(ruleset.start_date)}</td>
              <td>{formatDate(ruleset.end_date)}</td>
              <td>{formatServiceDay(ruleset.monday)}</td>
              <td>{formatServiceDay(ruleset.tuesday)}</td>
              <td>{formatServiceDay(ruleset.wednesday)}</td>
              <td>{formatServiceDay(ruleset.thursday)}</td>
              <td>{formatServiceDay(ruleset.friday)}</td>
              <td>{formatServiceDay(ruleset.saturday)}</td>
              <td>{formatServiceDay(ruleset.sunday)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
