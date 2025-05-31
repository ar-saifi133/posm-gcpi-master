import { Component } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import './LeafletMap-Providers-Control';
import config from '../config';

class LeafletMapProviders extends Component {
  static propTypes = {
    leafletMap: PropTypes.object
  };

  static defaultProps = {
    leafletMap: null
  };

  constructor(props) {
    super(props);
    this.state = {
      initialized: false
    };
  }

  componentDidUpdate(prevProps) {
    if (!this.state.initialized && this.props.leafletMap && this.props.leafletMap !== prevProps.leafletMap) {
      this.initialize(this.props.leafletMap);
    }
  }

  initialize(map) {
    L.control.mapProviders({
      position: 'topright',
      selected: config.map_providers[0].id, // default to 'osm'
      providers: config.map_providers,
      custom_desc: config.custom_description || '',
      initial_open: false
    }).addTo(map);

    this.setState({ initialized: true });
  }

  render() {
    return null; // This component doesn't render visible elements
  }
}

export default LeafletMapProviders;
