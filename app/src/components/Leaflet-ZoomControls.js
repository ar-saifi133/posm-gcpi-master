import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
import { CP_TYPES } from '../state/utils/controlpoints';

class LeafletZoomControls extends Component {
  static propTypes = {
    leafletMap: PropTypes.object,
    controlpoints: PropTypes.object
  };

  static defaultProps = {
    leafletMap: null
  };

  onZoomIn() {
    const { leafletMap } = this.props;
    let max = leafletMap.getMaxZoom();
    let z = leafletMap.getZoom();
    if (z < max) leafletMap.setZoom(z + 1);
  }

  onZoomOut() {
    const { leafletMap } = this.props;
    let min = leafletMap.getMinZoom();
    let z = leafletMap.getZoom();
    if (z > min) leafletMap.setZoom(z - 1);
  }

  render() {
    const { leafletMap } = this.props;
    if (!leafletMap) return null;
  
    return (
<div className="leaflet-zoom-controls">
  <div className="stack ">
    <a className="" href="#" title="Zoom in" onClick={() => this.onZoomIn()}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4465_3629)">
<path d="M0 5.60195C0 2.50916 2.50721 0.00195312 5.6 0.00195312H22.4C25.4928 0.00195312 28 2.50916 28 5.60195V28.002H0V5.60195Z" fill="white"/>
<path d="M14.8 8.66719C14.8 8.45501 14.7157 8.25153 14.5657 8.1015C14.4157 7.95147 14.2122 7.86719 14 7.86719C13.7879 7.86719 13.5844 7.95147 13.4343 8.1015C13.2843 8.25153 13.2 8.45501 13.2 8.66719V13.2005H8.6667C8.45453 13.2005 8.25104 13.2848 8.10101 13.4348C7.95098 13.5849 7.8667 13.7883 7.8667 14.0005C7.8667 14.2127 7.95098 14.4162 8.10101 14.5662C8.25104 14.7162 8.45453 14.8005 8.6667 14.8005H13.2V19.3339C13.2 19.546 13.2843 19.7495 13.4343 19.8995C13.5844 20.0496 13.7879 20.1339 14 20.1339C14.2122 20.1339 14.4157 20.0496 14.5657 19.8995C14.7157 19.7495 14.8 19.546 14.8 19.3339V14.8005H19.3334C19.5455 14.8005 19.749 14.7162 19.8991 14.5662C20.0491 14.4162 20.1334 14.2127 20.1334 14.0005C20.1334 13.7883 20.0491 13.5849 19.8991 13.4348C19.749 13.2848 19.5455 13.2005 19.3334 13.2005H14.8V8.66719Z" fill="#262626"/>
</g>
<defs>
<clipPath id="clip0_4465_3629">
<rect width="28" height="28" fill="white"/>
</clipPath>
</defs>
</svg>

    </a>
    <a className="" href="#" title="Zoom out" onClick={() => this.onZoomOut()}>
    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="path-1-inside-1_4465_3633" fill="white">
<path d="M0 0.597656H28V22.9977C28 26.0905 25.4928 28.5977 22.4 28.5977H5.6C2.50721 28.5977 0 26.0905 0 22.9977V0.597656Z"/>
</mask>
<path d="M0 0.597656H28V22.9977C28 26.0905 25.4928 28.5977 22.4 28.5977H5.6C2.50721 28.5977 0 26.0905 0 22.9977V0.597656Z" fill="white"/>
<path d="M0 -0.202344H28V1.39766H0V-0.202344ZM28 28.5977H0H28ZM0 28.5977V0.597656V28.5977ZM28 0.597656V28.5977V0.597656Z" fill="white" mask="url(#path-1-inside-1_4465_3633)"/>
<rect x="7.6001" y="13.7988" width="12.8" height="1.6" rx="0.8" fill="#262626"/>
</svg>

    </a>
  </div>
</div>

    );
  }
  
}

export default LeafletZoomControls;
