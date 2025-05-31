import React, { Component } from 'react';
import L from 'leaflet';
import LeafletSearch from './Leaflet-Search';
import LeafletMapProviders from './LeafletMap-Providers';
import PointMarkersMap from './PointMarkersMap';
import LeafletZoomControls from './Leaflet-ZoomControls.js';
import { CP_MODES, CP_TYPES } from '../state/utils/controlpoints';
import config from '../config';


class LeafletMap extends Component {
  constructor() {
    super();

    this.onMarkerDragged = this.onMarkerDragged.bind(this);
    this.onMarkerDelete = this.onMarkerDelete.bind(this);
    this.onMarkerLock = this.onMarkerLock.bind(this);
    this.onMarkerMouseOut = this.onMarkerMouseOut.bind(this);
    this.onMarkerMouseOver = this.onMarkerMouseOver.bind(this);
    this.onMarkerToggle = this.onMarkerToggle.bind(this);
    this.onMapClick = this.onMapClick.bind(this);

    this.state = {
      leafletMap: null
    };
  }
  initResize = (e) => {
   e.preventDefault();
   window.addEventListener('mousemove', this.doResize);
   window.addEventListener('mouseup', this.stopResize);
 }
  doResize = (e) => {
   const mapWrapper = this.mapWrapperRef;
   const newHeight = e.clientY - mapWrapper.getBoundingClientRect().top;
   mapWrapper.style.height = `${newHeight}px`;
 }
  stopResize = () => {
   window.removeEventListener('mousemove', this.doResize);
   window.removeEventListener('mouseup', this.stopResize);
 }
 


  componentWillReceiveProps(nextProps) {
    let currentList = this.props.imagery.gcp_list;
    if (
      (nextProps.imagery.gcp_list && currentList !== nextProps.imagery.gcp_list) ||
      (!nextProps.imagery.gcp_list_preview && this.props.imagery.gcp_list_preview)
    ) {
      this.zoomMapToList(nextProps.controlpoints.points);
    }

    const prevAutomaticImagePoints = this.props.controlpoints.points.filter(p => p.type === CP_TYPES.IMAGE && p.isAutomatic);
    const nextAutomaticImagePoints = nextProps.controlpoints.points.filter(p => p.type === CP_TYPES.IMAGE && p.isAutomatic);
    if (nextAutomaticImagePoints.length > 0 && prevAutomaticImagePoints.length === 0) {
      const center = this.state.leafletMap.getCenter();
      this.props.addAutomaticControlPoint([center.lat, center.lng]);
    }
  }

  componentDidMount() {
    this.initializeMap();
  }

  zoomMapToList(pts) {
    const { leafletMap } = this.state;
    if (!leafletMap) return;
    let bds = L.latLngBounds();

    pts.filter(p => p.type === 'map').forEach(p => {
      let ll = p.coord;
      if (ll && ll.length === 2) {
        bds.extend(ll);
      }
    });

    if (bds.isValid()) {
      leafletMap.fitBounds(bds);
    }
  }

  initializeMap() {
    const { leafletMap } = this.state;
    const { onMapPositionChange } = this.props;
    if (leafletMap) return;

    let mapContainer = this.refs.lmap;
    let map = L.map(mapContainer, config.map_options)
      .setView(config.map_options.initialCenter, config.map_options.initialZoom);

    map.on('moveend', () => {
      onMapPositionChange(map.getCenter());
    });

    map.on('click', this.onMapClick);

  

    // Let others know center
    onMapPositionChange(map.getCenter());

    this.setState({ leafletMap: map });
  }

  onMapClick(evt) {
    const { addControlPoint, controlpoints, toggleControlPointMode } = this.props;
    if (controlpoints.mode === CP_MODES.ADDING) {
      let ll = evt.latlng;
      addControlPoint([ll.lat, ll.lng]);
    } else if (controlpoints.selected) {
      toggleControlPointMode(controlpoints.selected);
    }
  }

  onMarkerDragged(marker_id, pos) {
    this.props.setControlPointPosition('map', marker_id, pos);
  }

  onMarkerDelete(marker_id) {
    this.props.deleteControlPoint(marker_id);
    this.props.highlightControlPoint(null);
  }

  onMarkerLock(marker_id) {
    this.props.lockControlPoint(marker_id);
  }

  onMarkerMouseOut() {
    this.props.highlightControlPoint(null);
  }

  onMarkerMouseOver(marker_id) {
    if (!this.props.controlpoints.highlighted.includes(marker_id)) {
      this.props.highlightControlPoint(marker_id);
    }
  }
  onFitMarkers() {
      const { controlpoints } = this.props;
      const { leafletMap } = this.state;
      if (!controlpoints.points.length) return;
  
      let bds = L.latLngBounds();
  
      controlpoints.points.forEach(pt => {
        if (pt.type !== CP_TYPES.MAP) return;
  
        bds.extend(pt.coord);
      });
  
      if (!bds.isValid()) return;
  
      leafletMap.fitBounds(bds);
    }

  onMarkerToggle(marker_id, marker_img, latlng) {
    const { toggleControlPointMode, controlpoints, setPointProperties, joinControlPoint } = this.props;

    if (controlpoints.mode === CP_MODES.ADDING) {
      return setPointProperties(false, null, null, null, marker_id, [latlng.lat, latlng.lng]);
    } else if (controlpoints.mode === CP_MODES.IMAGE_EDIT) {
      return joinControlPoint(marker_id);
    }

    toggleControlPointMode(marker_id);
  }

  render() {
    const { leafletMap } = this.state;
    const { controlpoints, imagery } = this.props;

    return (
      <div className='leaflet-map-wrapper' ref={(el) => this.mapWrapperRef = el} >
        <div className='leaflet-map' ref='lmap' />
        <LeafletSearch leafletMap={leafletMap} />
        <LeafletMapProviders leafletMap={leafletMap} />
        <LeafletZoomControls leafletMap={leafletMap} controlpoints={controlpoints} />
        <a  className='leaflet-control-fit-bounds gcp-recenter' href='#' title='Fit markers' onClick={()=>{this.onFitMarkers();}} ><span   role='presentation'/></a>
        
        <PointMarkersMap
          highlightedControlPoints={controlpoints.highlighted}
          leafletMap={leafletMap}
          selectedMarker={controlpoints.selected}
          selectedImage={imagery.selected}
          joins={controlpoints.joins}
          points={controlpoints.points}
          mode={controlpoints.mode}
          onMarkerDragged={this.onMarkerDragged}
          onMarkerDelete={this.onMarkerDelete}
          onMarkerLock={this.onMarkerLock}
          onMarkerMouseOut={this.onMarkerMouseOut}
          onMarkerMouseOver={this.onMarkerMouseOver}
          onMarkerToggle={this.onMarkerToggle}
        />
      </div>
    );
  }
}

export default LeafletMap;
