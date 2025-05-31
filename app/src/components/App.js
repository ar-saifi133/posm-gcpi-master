import React, { Component } from 'react';
import { WindowResizeListener } from 'react-window-resize-listener';

import Header from './Header';
import LeafletMap from '../connectors/LeafletMap';
import ExportModal from './ExportModal';
import FilePreview from '../connectors/FilePreview';
import ImageEditor from '../connectors/ImageEditor';
import SlidingPanel from './SlidingPanel';
import ImagesGrid from '../connectors/ImagesGrid';
import ImageNav from '../connectors/ImageNav';
import { setControlPoint } from '../state/actions';

class App extends Component {
  constructor(props) {
    super(props);

    WindowResizeListener.DEBOUNCE_TIME = 200;
    this.onExportClick = this.onExportClick.bind(this);
    this.onAddHandler = this.onAddHandler.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
  }
  state = {
   height: 600, // default height
   resizing: false
 };


 componentDidMount() {
   window.addEventListener('mousemove', this.handleMouseMove);
   window.addEventListener('mouseup', this.handleMouseUp);
 }
  componentWillUnmount() {
   window.removeEventListener('mousemove', this.handleMouseMove);
   window.removeEventListener('mouseup', this.handleMouseUp);
 }


 handleMouseDown = (e) => {
   if (e.button !== 0) return; // Only left click
   this.resizing = true;
 };
  handleMouseMove = (e) => {
   if (!this.resizing) return;
    const newHeight = Math.max(e.clientY, 100); // prevent too small
   this.setState({ height: newHeight });
 };
  handleMouseUp = () => {
   this.resizing = false;
 };
 

  onResize(w) {
    this.props.onWindowResize(w);
  }


  getLeftDimensions() {
    if (!this.rightPanel) return ['auto', 'auto'];

    let parentHeight = this.LeftPanel.offsetHeight;
    let imageNavHeight = (this.imageNavElm) ? this.imageNavElm.offsetHeight : 0;

    if (!imageNavHeight) {
      console.warn('Could not find a height for ".image-nav" element!');
    }

    let imageHeight = parentHeight;
    return [`${parentHeight}px`, `${imageHeight}px`];
  }

  onExportClick(evt) {
    evt.preventDefault();
    this.props.toggleExport();
  }

  onAddHandler(evt) {
    const { getPositions, imagery, addControlPoint } = this.props;
    let positions = getPositions();

    addControlPoint({
      image: [...positions.image],
      map: [positions.map.lat, positions.map.lng]
    }, imagery.selected);
  }

  onBackClick() {
    this.props.clearSelectedImage();
    this.props.toggleImagePanel(false);
  }
  
  

  render() {
    const { exporter, controlpoints, imagery, imagepanel } = this.props;
    const { height } = this.state;

    let [panelHeight, imageHeight] = this.getLeftDimensions();

    return (
      <div className='app'>
        <WindowResizeListener onResize={(w) => { this.onResize(w); }} />

        {imagery.gcp_list_preview && <FilePreview />}

        {exporter.active &&
          <ExportModal
            projection={imagery.projection}
            sourceProjection={imagery.sourceProjection}
            controlpoints={controlpoints}
            onClick={(evt) => { this.onExportClick(evt); }}
          />
        }

        <Header
          onExportClick={this.onExportClick}
          status={controlpoints.status}
          onBack={this.onBackClick}
          showAddPoint={!!imagery.selected}

          onAddPoint={this.onAddHandler}
          setControlPoint={this.props.setControlPoint}
        />

        <main className='main'>
          <section className='inner'>
            <div className='panel left'style={{ height }} ref={(el) => { this.LeftPanel = el; }}>
              <div style={{ height: panelHeight }}>
                <div className='image-nav-container' ref={(el) => { this.imageNavElm = el; }}>
                  {/* <ImageNav setControlPoint={this.props.setControlPoint} /> */}
                </div>

                <ImageEditor
                  height={imageHeight}
                  onImagePositionChange={this.props.onImagePositionChange}
                  setPointProperties={this.props.setPointProperties}
                />

                <SlidingPanel style={{ height }} panelOpen={imagepanel.menu_active}>
                  <ImagesGrid />
                </SlidingPanel>
              </div>
            </div>
          <div  className='tututu' onMouseDown={this.handleMouseDown}>
                  <div className="resizer" ></div>
             </div>



          <div className='panel right' style={{ height: `calc(100% - ${ height }px)` }} ref={(el) => {this.rightPanel = el;}}>
               <LeafletMap {...this.props}/>
             </div>






          </section>
        </main>
      </div>
    );
  }
}

export default App;
