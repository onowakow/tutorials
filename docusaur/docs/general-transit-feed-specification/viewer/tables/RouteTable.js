import React from 'react';

export const RouteTable = ({ routes }) => {
  return (
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
  );
};
