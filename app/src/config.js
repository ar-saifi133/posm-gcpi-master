const config = {
  map_options: {
    minZoom: 2,
    scrollWheelZoom: true,
    zoomControl: false,
    initialZoom: 2,
    initialCenter: [30, -20]
  },
  map_providers: [
    {
      id: 'osm', 
      label: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    },
    {
      id: 'satellite', 
      label: 'Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles © Esri',
      maxZoom: 19
    }
  ],
  custom_placeholder: 'Enter template url...',
  custom_description: 'Enter a tile URL template. Valid tokens are {z}, {x}, {y}, for Z/X/Y scheme and {u} for quadtile scheme.',
  image_slider_zoom_max: 4,
  image_slider_step: 0.01,
  image_initial_scale: 0.5
};

export default config;
