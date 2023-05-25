import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useMemo } from 'react';

export const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAxIn8GmC_bsfeVQRoaCFWFVmLj49qdubs',
  });

  const center = useMemo(
    () => ({
      lat: 41.313464,
      lng: -105.581285,
    }),
    []
  );

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoon={14}
        />
      )}
    </div>
  );
};
