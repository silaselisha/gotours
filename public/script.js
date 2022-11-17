const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken = 'pk.eyJ1Ijoic2lsYXMtODciLCJhIjoiY2xhbDFlcWswMDE0NjNwbnMyNmc3dDgxMSJ9.-yyEa1IjRL1h1HQPSfsKew';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/silas-87/clal1rze4000q15laka14wpzj',
    scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    const mapper = document.createElement('div');
    mapper.className = 'marker';

    new mapboxgl.Marker({
        element: mapper,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    new mapboxgl.Popup({offset: 30}).setLngLat(loc.coordinates).setHTML(`<p>${loc.day}: ${loc.description}</p>`).addTo(map)

    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});