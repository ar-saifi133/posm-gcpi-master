import { connect } from 'react-redux';
import App from '../components/App';

import {
  onWindowResize,
  toggleExport,
  addControlPoint,
  clearSelectedImage,
  toggleImagePanel,
  getPositions,
  setControlPoint
} from '../state/actions';

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  {
    onWindowResize,
    toggleExport,
    addControlPoint,
    clearSelectedImage,
    toggleImagePanel,
    getPositions,
    setControlPoint
  }
)(App);
