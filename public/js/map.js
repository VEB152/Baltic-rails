var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

var map = L.map('map', {center: [56.999, 24.675], zoom: 6});
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
    L.geoJSON(stations, {
    style: function (feature) {
        switch (feature.properties['Building Condition'])
        {
            case 'Active': return {fillColor: "#FC8D62"};
            case 'Dismantled/Not built': return {fillColor: "#66C2A5"};
            case 'Non-railway use': return {fillColor: "#FFD92F"};
            case 'Preserved, uncertain': return {fillColor: "#8DA0CB"};
            case 'Residential': return {fillColor: "#A6D854"};
            case 'Ruined/Disused': return {fillColor: "#E78AC3"};
        }},
    pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
    onEachFeature: function (feature, layer) {
            layer.bindPopup('<p>Station Name: '+feature.properties['Station Name']+
            '<br>Service Status: '+feature.properties['Service Status'] +' as of '+feature.properties['Status Year']+
            '<br>Part of '+feature.properties['Line Name']+' '+feature.properties['Gauge']+' line, opened in '+feature.properties['Year Opened']+
            '<br>Line is '+feature.properties['Line Status']+' as of '+feature.properties['Status Year.1']+
            '<br>Notes (if avalable): '+feature.properties['Station Notes']+', '+feature.properties['Line Notes']+'.');
        }
    }).addTo(map);
    var layerControl = L.control.layers().addTo(map);


/*Legend specific - https://codepen.io/haakseth/pen/KQbjdO by John*/
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Building Condition</h4>";
  div.innerHTML += '<i style="background: #FC8D62"></i><span>Active</span><br>';
  div.innerHTML += '<i style="background: #66C2A5"></i><span>Dismantled/Not built</span><br>';
  div.innerHTML += '<i style="background: #FFD92F"></i><span>Non-railway use</span><br>';
  div.innerHTML += '<i style="background: #8DA0CB"></i><span>Preserved, uncertain</span><br>';
  div.innerHTML += '<i style="background: #A6D854"></i><span>Residential</span><br>';
  div.innerHTML += '<i style="background: #E78AC3"></i><span>Ruined/Disused</span><br>';
  return div;
};

legend.addTo(map);