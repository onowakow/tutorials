import React from 'react';

export const AgencyTable = ({ agency }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>URL</th>
          <th>Timezone</th>
          <th>Phone</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {agency.map((agent) => (
          <tr key={agent.agency_id}>
            <td>{agent.agency_name}</td>
            <td>
              <a href={agent.agency_url}>{agent.agency_url}</a>
            </td>
            <td>{agent.agency_timezone}</td>
            <td>{agent.agency_phone}</td>
            <td>{agent.agency_email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
