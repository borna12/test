
function createMap(mapId, mapSizer, imageSrc, markers) {

  function addMarker(m, map) {
    var markerIcon = new L.icon({iconUrl: 'https://cdn1.iconfinder.com/data/icons/social-messaging-ui-color/254000/67-256.png',
        shadowUrl: "",
        iconSize: [40, 40],     // size of the icon
        shadowSize: [0, 0],       // size of the shadow
        iconAnchor: [20, 40],     // point of the icon which will correspond to marker s location
        shadowAnchor: [0, 0],       // the same for the shadow
        popupAnchor: [20, 0]
    });
    let id=m.id
    let latlng = pixelTolatlngPosition(m.pos, map);
    let marker = L.marker(latlng, {customId:id,icon: markerIcon}).addTo(map);
   
    marker["pos"] = latlng;
  
    
    marker.on("click", () => {
        markerClick(marker)
    });
    
  };
  function pixelTolatlngPosition(pos, map) {
    let LatLng = map.unproject(pos, map.getMaxZoom() - 1);
    return LatLng;
  };
  
  function latlngToPixelPosition(latlng, map) {
    let clientClick = map.project(latlng, map.getZoom());
    let overlay = map["imageOverlay"];
    let overlayImage = overlay["_image"]

    //Calculate the current image ratio from the original (deals with zoom)
    let yR = overlayImage.clientHeight / overlayImage.naturalHeight;
    let xR = overlayImage.clientWidth / overlayImage.naturalWidth;

    //scale the click coordinates to the original dimensions
    //basically compensating for the scaling calculated by the map projection
    let x = clientClick.x / xR;
    let y = clientClick.y / yR;

    return {x:x, y:y};
  }
  function loadMarkers(map, markers) {
    markers.forEach(m => {
       addMarker(m, map)
    })
  }
  function imageReady(map, mapSizer) {
    
     let w = mapSizer.firstElementChild.naturalWidth,
         h = mapSizer.firstElementChild.naturalHeight,
         url = imageSrc;
    let southWest = map.unproject([0, h], map.getMaxZoom() - 1);
    let northEast = map.unproject([w, 0], map.getMaxZoom() - 1);
    let bounds = L.latLngBounds(southWest, northEast);

    // add the image overlay, so that it covers the entire this.map
    var imageOverlay = L.imageOverlay(url, bounds); 
    map.setMaxBounds(bounds); //set limit where map can be
    map.fitBounds(bounds); //center in bounds
    imageOverlay.addTo(map);
    map["imageOverlay"] = imageOverlay;
  }
  
  var map = L.map(mapId, {
    minZoom: 1,
    maxZoom: 4,
    center: [0, 0],
    zoom: 4,
    crs: L.CRS.Simple,
  }); 
  map.attributionControl.setPrefix('<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | © <a href="https://www.lzmk.hr/">LZMK</a>')

  //create mapImgLoader
  let mapSz = document.getElementById(mapSizer);

  if (mapSz.firstElementChild)
      mapSz.firstElementChild.remove();

  let imgPlano = new Image();
  mapSz.appendChild(imgPlano);
  imgPlano.onload = (() => 
                     {
    imageReady(map, mapSz)
    loadMarkers(map, markers);
  });
  imgPlano.src = imageSrc;
  

  return map;
}
function markerClick(marker) {

  Swal.fire({
    title: '<strong>'+marker.options.customId+'</strong>',
    html:
      'Neki tekst',
    showCloseButton: true,
    focusConfirm: true,
    confirmButtonText:
      'zatvori',
  })

  
  console.log("Click on this marker", marker);
}

let imageSrc = "karta.png";


let pointsURL ="https://docs.google.com/spreadsheets/d/e/2PACX-1vR2BYSFkf_mpgdaGXTTriyZ3UcMbkMQDV5691rj-xj9YqyBaaxRALEvNqXeHYx7uRb2Le98RvIDv60v/pub?output=csv"
Papa.parse(pointsURL, {
  download: true,
  header: true,
  complete: addPoints,
});

let markers=[]
function addPoints(data) {
  data = data.data;
for (let row = 0; row < data.length; row++) {
  const obj = {pos: [data[row].lat, data[row].lon], id: data[row].naziv};
  markers.push(obj)
}
var myMap = createMap('image-map', 'map-sizer', imageSrc, markers)
}




/*
var map = L.map('image-map', {
  minZoom: 1,
  maxZoom: 4,
  center: [0, 0],
  zoom: 1,
  crs: L.CRS.Simple
}); 

//create mapImgLoader
let mapSizer = document.getElementById('map-sizer');

if (mapSizer.firstElementChild)
    mapSizer.firstElementChild.remove();

let imageSrc = "http://kempe.net/images/newspaper-big.jpg"
let imgPlano = new Image();
mapSizer.appendChild(imgPlano);
imgPlano.onload = (() => imageReady());
imgPlano.src = imageSrc;

//initMap();
 */