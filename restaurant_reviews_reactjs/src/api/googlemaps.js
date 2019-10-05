// Load Google Maps
export function load_google_maps() {
  return new Promise(function(resolve, reject) {
    // define the global callback that will run when google maps is loaded
    window.resolveGoogleMapsPromise = function() {
      // resolve the google object
      resolve(window.google);
      // delete the global callback to tidy up since it is no longer needed
      delete window.resolveGoogleMapsPromise;
    };
    // Now, Load the Google Maps API
    const script = document.createElement('script');
    const API_KEY = 'AIzaSyA-JzU5ew5rLamZhT-_iTq3uKs1GE7yUIM';
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${API_KEY}&callback=resolveGoogleMapsPromise`;
    script.async = true;
    document.body.appendChild(script);
  });
}

export function getGoogleImage(restaurantsMarkers) {
  return (
    'https://maps.googleapis.com/maps/api/streetview?size=300x300&location=' +
    restaurantsMarkers.lat +
    ',' +
    restaurantsMarkers.lng +
    '&heading=151.78&pitch=-0.76&key=AIzaSyA-JzU5ew5rLamZhT-_iTq3uKs1GE7yUIM'
  );
}
