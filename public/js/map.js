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

//base layer ESRI
var esri = L.tileLayer('http://services.arcgisonline.com/ArcGis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
    maxZoom: 19,
    attribution: '<a href="https://www.esri.com/">ESRI,</a>FAO,NOAA,USGS'
});

//overlay layer - stations from geoJSON
// 1 - adding active stations
var act = L.geoJSON(stations, {
    filter: function (feature) {
        return (feature.properties['Building Condition'] == 'Active');
    },
    style: function (feature) {
            return {fillColor: "#FC8D62"};
        },
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
});

// 2 - adding non-railway used stations
var nrr = L.geoJSON(stations, {
    filter: function (feature) {
        return ((feature.properties['Building Condition'] == 'Non-railway use') || (feature.properties['Building Condition'] == 'Residential'));
    },
    style: function (feature) {
        switch (feature.properties['Building Condition'])
        {
            case 'Non-railway use': return {fillColor: "#FFD92F"};
            case 'Residential': return {fillColor: "#A6D854"};
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
});

// 3 - adding disused and ruined stations
var unc = L.geoJSON(stations, {
    filter: function (feature) {
        return ((feature.properties['Building Condition'] == 'Preserved, uncertain') || (feature.properties['Building Condition'] == 'Ruined/Disused'));
    },
    style: function (feature) {
        switch (feature.properties['Building Condition'])
        {
            case 'Preserved, uncertain': return {fillColor: "#8DA0CB"};
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
});

// 4- all others
var gon = L.geoJSON(stations, {
    filter: function (feature) {
        return (feature.properties['Building Condition'] == 'Dismantled/Not built');
    },
    style: function (feature) {
           return {fillColor: "#66C2A5"};
        },
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
});

//actually making the map + combining layers for the controls; OSM + markers for existing stations enabled by default
var map =
    L.map('map', {
        center: [56.999, 24.675],
        zoom: 7,
        layers: [osm, act, nrr]
    });

const baseLayers = {
    'OpenStreetMap': osm,
    'ESRI World Imagery (aerial)': esri
};

const overlays = {
    'Active stations': act,
    'Freight, unknown use, and ruins': unc,
    'Various non-railway uses': nrr,
    'Fully destroyed or never built': gon,
    'OpenRailwayMap': openrailwaymap
};

var layerControl = L.control.layers(baseLayers, overlays).addTo(map);

//Legend specific - https://codepen.io/haakseth/pen/KQbjdO by John
var legend = L.control({ position: "bottomleft" });
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Building Condition</h4>";
  div.innerHTML += '<i style="background: #FC8D62"></i><span>Active</span><br>';
  div.innerHTML += '<i style="background: #FFD92F"></i><span>Private/Commercial spaces</span><br>';
  div.innerHTML += '<i style="background: #A6D854"></i><span>Residential</span><br>';
  div.innerHTML += '<i style="background: #8DA0CB"></i><span>Preserved, use uncertain</span><br>';
  div.innerHTML += '<i style="background: #E78AC3"></i><span>Ruined/Disused</span><br>';
  div.innerHTML += '<i style="background: #66C2A5"></i><span>Dismantled/Not built</span><br>';
  return div;
};
legend.addTo(map);

L.control.scale({position: 'bottomright'}).addTo(map);