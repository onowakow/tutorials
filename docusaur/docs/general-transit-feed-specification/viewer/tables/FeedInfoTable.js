import React from 'react';
import { formatDate } from '../utilities/formatDate';

export const FeedInfoTable = ({ feedInfo }) => {
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
