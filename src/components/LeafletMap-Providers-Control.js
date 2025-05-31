// LeafletMapProviders.js
(function (factory) {
  var L;
  if (typeof module !== 'undefined') {
    L = require('leaflet');
    module.exports = factory(L);
  } else {
    if (typeof window.L === 'undefined') {
      throw new Error('Leaflet must be loaded first');
    }
    factory(window.L);
  }
}(function (L) {
  // small check-mark SVG
  const CHECK_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
      <path d="M4.571 8.667L1.238 5.333 0 6.571 4.571 11.143 12 3.714 10.762 2.476 4.571 8.667Z" fill="#FFFFFF"/>
    </svg>`;

  L.Control.MapProviders = L.Control.extend({
    options: {
      position: 'topright',
      providers: [],         // pass in [{ id: 'osm', url: '…', attribution: '…' }, { id: 'satellite', … }]
      selected: 'osm'
    },

    initialize: function (options) {
      L.Util.setOptions(this, options);
      this.state = {
        selected: this.options.selected,
        currentLayer: null
      };
    },

    onAdd: function (map) {
      this._map = map;

      // container + toggle button
      const container = this._container = L.DomUtil.create('div', 'map-style-toggle leaflet-bar leaflet-control');
      const button    = L.DomUtil.create('button', 'layer-icon', container);
      button.title = 'Toggle map style';

      // dropdown menu
      const menu = L.DomUtil.create('div', 'layer-menu hidden', container);

      // “Map” option
      const mapOption = L.DomUtil.create('div', 'layer-option', menu);
      mapOption.innerHTML = `
        <span class="option-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
            <path d="M8 10.0853L4 8.94159V0.914502L8 2.05825V10.0853ZM8.66667 10.0603V2.00825L11.3146 0.947836C11.6437 0.816585 12 1.05825 12 1.41242V8.38742C12 8.59159 11.875 8.77492 11.6854 8.852L8.66667 10.0583V10.0603ZM0.314583 2.14784L3.33333 0.941586V8.99367L0.685417 10.052C0.35625 10.1833 0 9.94159 0 9.58742V2.61242C0 2.40825 0.125 2.22492 0.314583 2.14784Z" fill="white" fill-opacity="0.95"/>
          </svg>
          <span>Map</span>
        </span>
        <span class="check-icon">${CHECK_SVG}</span>
      `;

      // “Satellite” option
      const satelliteOption = L.DomUtil.create('div', 'layer-option', menu);
      satelliteOption.innerHTML = `
        <span class="option-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
            <g clip-path="url(#clip0_4451_4328)">
              <path d="M5.46082 0.664014C5.24051 0.443701 4.88426 0.443701 4.66629 0.664014L2.41629 2.91401C2.19598 3.13433 2.19598 3.49058 2.41629 3.70855L4.5116 5.80386L4.14832 6.16714C3.56942 5.89995 2.92723 5.74995 2.24989 5.74995C1.50692 5.74995 0.808479 5.93042 0.192073 6.24683C-0.0188643 6.35698 -0.0493331 6.63823 0.119417 6.80464L2.64129 9.32886L2.25692 9.71323C2.19598 9.69683 2.13035 9.68745 2.06239 9.68745C1.64754 9.68745 1.31239 10.0226 1.31239 10.4375C1.31239 10.8523 1.64754 11.1875 2.06239 11.1875C2.47723 11.1875 2.81239 10.8523 2.81239 10.4375C2.81239 10.3695 2.80301 10.3062 2.7866 10.2429L3.17098 9.85855L5.69285 12.3804C5.8616 12.5492 6.14285 12.5187 6.25067 12.3078C6.56942 11.6914 6.74989 10.9929 6.74989 10.25C6.74989 9.57261 6.59989 8.93042 6.3327 8.35386L6.69598 7.99058L8.78895 10.0859C9.00926 10.3062 9.36551 10.3062 9.58348 10.0859L11.8335 7.83589C12.0538 7.61558 12.0538 7.25933 11.8335 7.04136L9.73817 4.94605L11.0272 3.65698C11.3202 3.36401 11.3202 2.88823 11.0272 2.59526L9.90223 1.47026C9.60926 1.1773 9.13348 1.1773 8.84051 1.47026L7.55145 2.75933L5.46082 0.664014ZM9.18739 8.89058L7.49051 7.1937L8.94598 5.73823L10.6429 7.43745L9.18739 8.89292V8.89058ZM5.30379 5.00933L3.60692 3.31245L5.06239 1.85698L6.75926 3.55386L5.30379 5.00933Z" fill="white" fill-opacity="0.95"/>
            </g>
            <defs>
              <clipPath id="clip0_4451_4328">
                <rect width="12" height="12" fill="white" transform="translate(0 0.5)"/>
              </clipPath>
            </defs>
          </svg>
          <span>Satellite</span>
        </span>
        <span class="check-icon">${CHECK_SVG}</span>
      `;

      container.appendChild(menu);

      // initialize default layer
      const defaultProvider = this.options.providers.find(p => p.id === this.state.selected)
                              || this.options.providers[0];
      this.state.currentLayer = this._createLayer(defaultProvider).addTo(map);

      // helper to toggle the “active” class
      const updateActive = () => {
        mapOption.classList.toggle('active', this.state.selected === 'osm');
        satelliteOption.classList.toggle('active', this.state.selected === 'satellite');
      };
      updateActive();

      // event listeners
      button.addEventListener('click', () => menu.classList.toggle('hidden'));
      mapOption.addEventListener('click', () => {
        this._handleClick('osm', menu);
        updateActive();
      });
      satelliteOption.addEventListener('click', () => {
        this._handleClick('satellite', menu);
        updateActive();
      });

      return container;
    },

    _handleClick: function (providerId, menu) {
      const provider = this.options.providers.find(p => p.id === providerId);
      if (!provider) return;

      if (this.state.currentLayer) {
        this._map.removeLayer(this.state.currentLayer);
      }
      this.state.currentLayer = this._createLayer(provider).addTo(this._map);
      this.state.selected = providerId;
      menu.classList.add('hidden');
    },

    _createLayer: function (provider) {
      return L.tileLayer(provider.url, {
        attribution: provider.attribution,
        maxZoom: provider.maxZoom || 19
      });
    },

    onRemove: function (map) {
      if (this.state.currentLayer) {
        map.removeLayer(this.state.currentLayer);
      }
    }
  });

  // factory shortcut
  L.control.mapProviders = function (options) {
    return new L.Control.MapProviders(options);
  };
}));
