import React from 'react';
import { formatDate } from '../utilities/formatDate';

export const CalendarExceptionsTable = ({ calendarDates }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Exception Type</th>
        </tr>
      </thead>
      <tbody>
        {calendarDates.map((exception) => (
          <tr key={exception.date}>
            <td>{formatDate(exception.date)}</td>
            <td>
              {exception.exception_type == 1
                ? 'Service Added'
                : exception.exception_type == 2
                ? 'Service Removed'
                : 'INVALID GTFS.'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
