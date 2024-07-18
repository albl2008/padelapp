<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import SectionMain from '../SectionMain.vue';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const emit = defineEmits();

const address = ref(null);

const props = defineProps({
  center: {
    type: Object,
    default: () => ({ lat: -32.88945870, lng: -68.84583860 })
  },
  zoom: {
    type: Number,
    default: 8
  },
  locationSaved : {
    type: Object,
    default: null
  },
  addressSaved : {
    type: String,
    default: null
  }
});



watch(props, () => {
  if (props.locationSaved) {
    console.log(props.locationSaved)
    delete props.locationSaved.id
    setMarker(props.locationSaved)
    updateMapCenterAndZoom(props.locationSaved, 17);
  }
  if (props.addressSaved) {
    address.value = props.addressSaved
  }
});

const setMarker = (location) => {
  
  if (marker) {
    marker.setPosition(location);
  } else {
    marker = new google.maps.Marker({
      position: location,
      map: mapInstance
    });
  }

  
}

const mapRef = ref(null);
const inputRef = ref(null);
let mapInstance = null;
let autocomplete = null;
let marker = null;

const darkModeStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#212121" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#212121" }]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#bdbdbd" }]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#181818" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#1b1b1b" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [{ "color": "#2c2c2c" }]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#8a8a8a" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{ "color": "#373737" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#3c3c3c" }]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [{ "color": "#4e4e4e" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#000000" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#3d3d3d" }]
  }
];

const initMap = () => {
  const mapOptions = {
    center: props.center,
    zoom: props.zoom,
  };
  mapInstance = new google.maps.Map(mapRef.value, mapOptions);

  // Initialize Autocomplete and bind it to the input element
  autocomplete = new google.maps.places.Autocomplete(inputRef.value);
  autocomplete.bindTo('bounds', mapInstance);
  
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    debugger
    address.value = place.formatted_address;
    if (!place.geometry || !place.geometry.location) {
      console.log("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      mapInstance.fitBounds(place.geometry.viewport);
    } else {
      mapInstance.setCenter(place.geometry.location);
      mapInstance.setZoom(17);  // Zoom in on the selected place
    }

    // Set the marker at the selected place
    if (!marker) {
      marker = new google.maps.Marker({
        map: mapInstance,
        position: place.geometry.location,
        title: place.name
      });
      const lat = marker.position.lat();
      const lng = marker.position.lng();
      console.log('Latitude:', lat);
      console.log('Longitude:', lng);

      emit('location-selected', { lat, lng });
      emit('address-selected', address.value);

    } else {

      marker.position = place.geometry.location;
      marker.title = place.name;
      
    }

  });
};


// Make initMap a global function
window.initMap = initMap;

onMounted(() => {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places,marker`;
  script.async = true;
  document.head.appendChild(script);
  marker = null;
});

onUnmounted(() => {
  // Clean up map instance if needed
  mapInstance = null;
  autocomplete = null;
});


const updateMapCenterAndZoom = (location, zoom) => {
  mapInstance.setCenter(location);
  mapInstance.setZoom(zoom);
};
</script>

<template>
  

  <div class="w-full h-96 mb-24">
    <div class="flex justify-center mb-4">
      <input v-model="address" id="pac-input" ref="inputRef" class="controls" type="text" placeholder="Buscar" />
    </div>
    
    <div id="map" ref="mapRef" style="width: 100%; height: 100%;"></div>
  </div>

  
</template>

<style>
  /* Style the search box */
  .controls {
    border: 1px solid #334155;
    border-radius: 2px 0 0 2px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    height: 46px;
    color: #fff;
    outline: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    background-color: #1e293b;
    font-family: Roboto;
    font-size: 15px;
    font-weight: 300;
    text-overflow: ellipsis;
    width: 100%; /* Half of the width to center */
    z-index: 5;
  }

  
 
</style>
