var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(data){
    console.log(data);
    MakeFeatures(data.features);
});

function MakeFeatures(earthquakeData){

    function EachFeature(feature,layer){
        layer.bindPopup(`<h3>Where: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    function Blips(feature,latlng){
        let options = {
            radius:feature.properties.mag*5,
            fillColor: ColorChoice(feature.geometry.coordinates[2]),
            color: ColorChoice(feature.geometry.coordinates[2]),
            weight: 2,
            opacity: 0.75,
            fillOpacity: 0.2
        }
        return L.circleMarker(latlng,options)
    }

    let earthquakes = L.geoJSON(earthquakeData,{
        onEachFeature: EachFeature,
        pointToLayer: Blips,
    });

    Mapping(earthquakes);
}

    function ColorChoice(depth){
        if(depth <10) return "#66ff00";
        else if (depth < 30) return "greenyellow";
        else if (depth < 50) return "yellow";
        else if (depth < 70) return "orange";
        else if (depth < 90) return "orangered";
        else return "#FF0000"
    }
    
    
    
    function Mapping(earthquakes){

        let basemap = L.tileLayer(
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
            {
              attribution:
                'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            });

        var BigMap = L.map("map",{
        center:[
            50,50
        ],
        zoom:5,
        layers: [basemap, earthquakes]
        });

        var legend = L.control({position:"bottomright"});
        legend.onAdd = function () {
            var div = L.DomUtil.create("div","info legend");
            var depth = [-10,10,30,50,70,90];
            div.innerHTML += "<h3 style='text-align:center'>Depth</h3>"
            for (var i = 0; i < depth.length; i++){
                div.innerHTML += 
                '<i style="background:'+ColorChoice(depth[i]+1) + '"></i>' + depth[i] + (depth[i+1] ? '&ndash;'+depth[i+1]+'<br>': '+');
            }
            return div;
        };

        legend.addTo(BigMap);

    }