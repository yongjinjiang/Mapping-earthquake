// Store our API endpoint inside queryUrl
// var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
//   "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

    
function getColor(d) {
 return d > 5? '#F06B6B' :
       d > 4? '#F0A76B' :
       d > 3  ? '#F3BA4D' :
       d > 2  ? '#F3DB4D' :
       d > 1   ? '#E1F34D' :
                  '#B7F34D';
}
   


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }


 
    
function style(feature) {
  var mag = feature.properties.mag; 
  var color_value=getColor(mag)

  return {radius: feature.properties.mag*2,
    color: "#000",
    fillColor:color_value,
    fillOpacity: 0.8,
    weight: 1,
    opacity: 0}
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

  pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, style(feature));
    },

  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
    
    
var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 18,
    subdomains:['mt0','mt1','mt2','mt3']
});
    
    
    
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "satellite":satellite, 
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
    

var APILink = "./GeoJSON/PB2002_boundaries.json";
//var fault_Line    
 
d3.json(APILink,function(data) {
    
    var myStyle = {
    "color": "#ff7800",
    "weight": 3,
    "opacity": 0.65
};

    
    fault_Line=L.geoJson(data,{style: myStyle});
                                
                                  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "fault Line": fault_Line 
  };
                                
      // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      39.320980, -111.093735
    ],
    zoom: 3,
    layers: [satellite, earthquakes,fault_Line]
  });
                              
               
      L.control.layers(baseMaps, overlayMaps).addTo(myMap);

                                
                                
      var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,  1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]+0.01 ) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
                                 
    })
    
}