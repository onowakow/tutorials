import React from 'react';
import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from '@react-google-maps/api';
import { Polyline } from '@react-google-maps/api';
import { useMemo } from 'react';

const IS_DEV = process.env.NODE_ENV == 'development';

// At least one key must be exposed for frontend Google Maps Javascript API to load.
// API keys are restricted by IP/Website and by API
const GOOGLE_MAPS_API_KEY = IS_DEV
  ? 'AIzaSyAxIn8GmC_bsfeVQRoaCFWFVmLj49qdubs'
  : 'AIzaSyDNooT4WjByxOzYQ06_6RqE9LHrx8b39hI';

export const RouteMap = ({
  routePolylines,
  stops,
  selectedStopId,
  setSelectedStopId,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const handleStopMarkerClick = (stop_id) => {
    setSelectedStopId(stop_id);
  };

  const scrollToStopTimes = () => {
    const timesByStopEl = document.getElementById('times-by-stop');
    timesByStopEl.scrollIntoView(true);
  };

  const center = useMemo(
    () => ({
      lat: 41.313464,
      lng: -105.581285,
    }),
    []
  );

  const mapStyles = [
    {
      featureType: 'all',
      elementType: 'all',
      stylers: [
        {
          saturation: -60, // Decrease saturation for subdued colors
        },
        {
          lightness: 10, // Increase lightness for subdued colors
        },
      ],
    },
  ];

  return (
    <div
      id="Map"
      style={{
        height: '35rem',
        width: '100%',
      }}
    >
      {!isLoaded ? (
        <em>Loading...</em>
      ) : (
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={14}
          options={{
            styles: mapStyles,
          }}
        >
          {stops.map((stop) => {
            const position = {
              lat: Number(stop.stop_lat),
              lng: Number(stop.stop_lon),
            };
            const is_station = Number(stop.location_type) === 1;
            const displayStopInfo = stop.stop_id === selectedStopId;

            const icon_size = new window.google.maps.Size(15, 15);
            const hidden_icon_size = new window.google.maps.Size(0, 0);

            return (
              <Marker
                key={stop.stop_id}
                position={position}
                icon={{
                  url: 'https://www.geocodezip.net/mapIcons/bus_blue.png',
                  // Hide stations, but allow InfoWindow to show.
                  scaledSize: is_station ? hidden_icon_size : icon_size,
                }}
                onClick={() => handleStopMarkerClick(stop.stop_id)}
              >
                {displayStopInfo ? (
                  <InfoWindow
                    options={{
                      pixelOffset: new window.google.maps.Size(0, -5),
                    }}
                    position={position}
                  >
                    <div>
                      <h4>{stop.stop_name}</h4>
                      <button onClick={scrollToStopTimes}>
                        View stop times
                      </button>
                    </div>
                  </InfoWindow>
                ) : null}
              </Marker>
            );
          })}
          {routePolylines.map((routePolyline) => {
            return (
              <Polyline
                key={routePolyline.route_id}
                path={routePolyline.polyline}
                options={{
                  strokeColor: '#' + routePolyline.route_color,
                  strokeWeight: 3,
                }}
              />
            );
          })}
        </GoogleMap>
      )}
    </div>
  );
};
