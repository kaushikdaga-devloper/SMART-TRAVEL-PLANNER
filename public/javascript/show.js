 // Set your location (latitude, longitude)
 var myLocation = [28.6139, 77.2090]; // Example: New Delhi, India
    
 // Initialize the map
 var map = L.map('map').setView(myLocation, 13); // 13 = zoom level

 // Add OpenStreetMap tiles
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '© OpenStreetMap contributors'
 }).addTo(map);

 // Add a marker at the location
 L.marker(myLocation).addTo(map)
   .bindPopup('<b>SMT Location</b><br>Here is where you will be.')
   .openPopup();