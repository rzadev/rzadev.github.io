function initMap() {
  var marbella = {lat: 29.7442412, lng: -95.3890479};
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 15, center: marbella});
  var marker = new google.maps.Marker({position: marbella, map: map});
}