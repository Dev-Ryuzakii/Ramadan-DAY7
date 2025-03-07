let map;
let service;
let infowindow;

function initMap() {
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 40.7128, lng: -74.006 }, // Default to New York
    zoom: 12,
  });
}

document.getElementById('findMasjids').addEventListener('click', () => {
  const location = document.getElementById('locationInput').value;
  if (!location) {
    alert('Please enter a location.');
    return;
  }

  // Use Geocoding API to convert location to coordinates
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: location }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const locationCoords = results[0].geometry.location;
      map.setCenter(locationCoords);

      // Search for nearby mosques
      const request = {
        location: locationCoords,
        radius: '5000', // 5km radius
        keyword: 'mosque',
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          displayResults(results);
          addMarkers(results);
        } else {
          alert('No mosques found nearby.');
        }
      });
    } else {
      alert('Location not found. Please try again.');
    }
  });
});

function displayResults(results) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  results.forEach((place) => {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'masjid-result';
    resultDiv.innerHTML = `
      <h3>${place.name}</h3>
      <p>${place.vicinity}</p>
      <p>Rating: ${place.rating || 'N/A'}</p>
    `;
    resultsDiv.appendChild(resultDiv);
  });
}

function addMarkers(results) {
  results.forEach((place) => {
    const marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name,
    });

    google.maps.event.addListener(marker, 'click', () => {
      infowindow.setContent(`<strong>${place.name}</strong><br>${place.vicinity}`);
      infowindow.open(map, marker);
    });
  });
}

// Initialize the map when the page loads
window.onload = initMap;