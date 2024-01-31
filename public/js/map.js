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

//Markers for GeoJSON
var geojsonMarkerOptions = {
    radius: 8,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

function getColor(ch) {
    return ch == 'Active' ? '#FC8D62' :
           ch == 'Non-railway use'  ? '#FFD92F' :
           ch == 'Residential'  ? '#A6D854' :
           ch == 'Preserved, uncertain'  ? '#8DA0CB' :
           ch == 'Ruined/Disused'   ? '#E78AC3' :
                      '#66C2A5';
}

var act = L.layerGroup();
var nrr = L.layerGroup();
var unc = L.layerGroup();
var gon = L.layerGroup();

function stationfeature (feature, layer) {
    switch (layer.feature.properties['Building Condition']) {
        case 'Active': layer.addTo(act)
        break;
        case 'Residential': layer.addTo(nrr)
        break;
        case 'Non-railway use': layer.addTo(nrr)
        break;
        case 'Ruined/Disused': layer.addTo(unc)
        break;
        case 'Preserved, uncertain': layer.addTo(unc)
        break;
        case 'Dismantled/Not built': layer.addTo(gon)
        break;
    };
    var popupContent = '<h4>'+feature.properties['Station Name']+'</h4>'+
    'Service Status: ' + feature.properties['Service Status'] + ' as of ' + feature.properties['Service Status Year']+
    '<br>Part of '+feature.properties['Line Name']+' '+feature.properties['Gauge']+' line, opened in '+feature.properties['Year Opened']+
    '<br>As of '+feature.properties['Line Status Year']+', line is '+feature.properties['Line Status'].toLowerCase();
    if (feature.properties['Station Notes'] !== ""){
        popupContent += '<br>Station-specific notes: '+feature.properties['Station Notes']
    }
    if (feature.properties['Line Notes'] !== "" ){
        popupContent += '<br>Line-specific notes: '+feature.properties['Line Notes']
    }
    layer.bindPopup (popupContent);
};

//overlay layer - stations from geoJSON
L.geoJSON(stations, {
    style: function (feature) {
            return {fillColor: getColor(feature.properties['Building Condition'])};
        },
    onEachFeature: stationfeature,
    pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
});

var map =
    L.map('map', {
        center: [56.999, 24.675],
        zoom: 7,
        layers: [osm, act, nrr],
        maxBounds: L.latLngBounds ([60, 19.5] , [53.5, 30.5]),
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

//hide and unhide markers for switching countries
//setInteractive - from Jadaw1n @ https://github.com/Leaflet/Leaflet/issues/5442
L.Layer.prototype.setInteractive = function (interactive) {
    if (this.getLayers) {
        this.getLayers().forEach(layer => {
            layer.setInteractive(interactive);
        });
        return;
    }
    if (!this._path) {
        return;
    }

    this.options.interactive = interactive;

    if (interactive) {
        L.DomUtil.addClass(this._path, 'leaflet-interactive');
    } else {
        L.DomUtil.removeClass(this._path, 'leaflet-interactive');
    }
};

var hidmark = {
    opacity: 0,
    fillOpacity: 0
};
    
var showmark = {
    opacity: 1,
    fillOpacity: 0.8
};

var selectedCountries = [];
let layers = [act, unc, nrr, gon];
function cngctr () {
    const ctselm = document.getElementById('nationselect');
    selectedCountries = Array.from(ctselm.options).filter(option => option.selected).map(option => option.value);
    for (const gjlayer of layers){
        gjlayer.eachLayer(function (layer) {
            if(selectedCountries.includes(layer.feature.properties['Country']) == false) {
                layer.setStyle(hidmark),
                layer.setInteractive(false)
            } else {
                layer.setStyle(showmark),
                layer.setInteractive(true)
            };
        })
    };
    alert (nation);
};

//cngctr();