import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder';
// import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

class LeafletSearch extends Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.leafletMap && this.props.leafletMap) {
      this._addSearchControl(this.props.leafletMap);
    }
  }

  _addSearchControl(map) {
    // Base geocoder provider restricted to India
    const baseProvider = L.Control.Geocoder.nominatim({
      geocodingQueryParams: { countrycodes: 'in' }
    });
    baseProvider.suggest = baseProvider.geocode.bind(baseProvider);

    // Helper to render results
    const renderResults = (results, list) => {
      list.innerHTML = '';
      const slice = results.slice(0, 5);
      slice.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r.name || r.html;
        li.onclick = () => { map.fitBounds(r.bbox); list.innerHTML = ''; };
        list.appendChild(li);
      });
      if (results.length === 0) {
        const li = document.createElement('li');
        li.className = 'fallback';
        li.textContent = 'No results found';
        li.onclick = () => { list.innerHTML = ''; };
        list.appendChild(li);
      }
    };

    const CustomSearch = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: () => {
        const container = L.DomUtil.create('div', 'leaflet-control leaflet-custom-geocoder');
        L.DomEvent.disableClickPropagation(container);

        const input = L.DomUtil.create('input', '', container);
        input.type = 'text';
        input.placeholder = 'Search';
        input.style.outline = 'none';

        const list = L.DomUtil.create('ul', 'leaflet-custom-geocoder-list', container);

        input.addEventListener('keydown', e => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          const raw = input.value.trim();
          if (!raw) return;

          // Detect 6-digit PIN codes
          const isPin = /^[1-9][0-9]{5}$/.test(raw);
          if (isPin) {
            // Create provider with postalcode filter
            const pinProv = L.Control.Geocoder.nominatim({
              geocodingQueryParams: { countrycodes: 'in', postalcode: raw }
            });
            pinProv.geocode(raw, results => renderResults(results, list));
          } else {
            baseProvider.geocode(raw, results => renderResults(results, list));
          }
        });

        return container;
      }
    });

    map.addControl(new CustomSearch());
  }

  render() { return null; }
}

export default LeafletSearch;