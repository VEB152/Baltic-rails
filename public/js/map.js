//Markers for GeoJSON
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

//base layer OSM
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

//base layer ORM
var openrailwaymap = new L.TileLayer('http://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
{
	attribution: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>, Style: <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA 2.0</a> <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a> and OpenStreetMap',
	minZoom: 2,
	maxZoom: 19,
	tileSize: 256
});

//overlay layer - stations from geoJSON

var geosta = L.geoJSON(stations, {
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
            var popupContent = '<h4>'+feature.properties['Station Name']+'</h4>'+
            'Service Status: ' + feature.properties['Service Status'] + ' as of ' + feature.properties['Status Year']+
            '<br>Part of '+feature.properties['Line Name']+' '+feature.properties['Gauge']+' line, opened in '+feature.properties['Year Opened']+
            '<br>As of '+feature.properties['Status Year.1']+', line is '+feature.properties['Line Status'].toLowerCase();
            if (feature.properties['Station Notes'] !== ""){
                popupContent += '<br>Station-specific notes: '+feature.properties['Station Notes']
            }
            if (feature.properties['Notes'] !== "" ){
                popupContent += '<br>Line-specific notes: '+feature.properties['Notes']
            }
            layer.bindPopup (popupContent);
        },
    attribution: 'Station data collated by<a href="http://www.vebcoyote.com/contact">Veb</a>'
});

//actually making the map + combining layers for the controls
var map =
    L.map('map', {
        center: [56.999, 24.675],
        zoom: 7,
        layers: [osm, geosta]
    });

const baseLayers = {
    'OpenStreetMap': osm
};

const overlays = {
    'Stations': geosta,
    'OpenRailwayMap': openrailwaymap
};

var layerControl = L.control.layers(baseLayers, overlays).addTo(map);

//Legend specific - https://codepen.io/haakseth/pen/KQbjdO by John
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


/*function pop_stations(feature, layer) {
    var popupContent = '<p>Station Name: ' + feature.properties['Station Name']+
                '</br>Service Status: ' + feature.properties['Service Status'] + ' as of ' + feature.properties['Status Year']+
                '<br>Part of '+feature.properties['Line Name']+' '+feature.properties['Gauge']+' line, opened in '+feature.properties['Year Opened']+
                '<br>Line is '+feature.properties['Line Status']+' as of '+feature.properties['Status Year.1']+
                '</br>Station Notes' + (feature.properties['Station Notes'] !== null ? autolinker.link(feature.properties['Station Notes'].toLocaleString()) : '');
                '</br>Line Notes' + (feature.properties['Line Notes'] !== null ? autolinker.link(feature.properties['Line Notes'].toLocaleString()) : '');
                '<br>Notes (if avalable): '+feature.properties['Station Notes']+', '+feature.properties['Line Notes']+'.');
    layer.bindPopup(popupContent);
    var popup = layer.getPopup();
    var content = popup.getContent();
    var updatedContent = removeEmptyRowsFromPopupContent(content, feature);
    popup.setContent(updatedContent);
}*/

/*    onEachFeature: function (feature, layer) {
            layer.bindPopup('<p>Station Name: '+feature.properties['Station Name']+
            '<br>Service Status: '+feature.properties['Service Status'] +' as of '+feature.properties['Status Year']+
            '<br>Part of '+feature.properties['Line Name']+' '+feature.properties['Gauge']+' line, opened in '+feature.properties['Year Opened']+
            '<br>Line is '+feature.properties['Line Status']+' as of '+feature.properties['Status Year.1']+
            '<br>Notes (if avalable): '+feature.properties['Station Notes']+', '+feature.properties['Line Notes']+'.');
        },*/