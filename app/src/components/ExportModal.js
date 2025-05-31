import classNames from 'classnames';
import React, { Component } from 'react';
import FileSaver from 'file-saver';
import L from 'leaflet';
import isEqual from 'lodash.isequal';
import uniqWith from 'lodash.uniqwith';
import { generateGcpOutput } from '../state/utils/controlpoints';
import { getUtmZoneFromLatLng, getProj4Utm } from '../common/coordinate-systems';


class ExportModal extends Component {
 constructor(props) {
   super(props);


   // detect if we can use FileSaver
   try {
       /*eslint-disable */
       this.isFileSaverSupported = !!new Blob;
       /*eslint-enable */
   } catch (e) {}


   this.state = {
     destinationProjection: '',
     exportText: '',
     error: null
   };
 }


 componentDidMount() {
   L.DomUtil.addClass(document.body, 'prevent-overflow');
   this.updateProps(this.props);
 }


 componentWillUnmount() {
   L.DomUtil.removeClass(document.body, 'prevent-overflow');
 }


 copyText(evt) {
   evt.preventDefault();
    if (this.editableDiv) {
     const range = document.createRange();
     range.selectNodeContents(this.editableDiv);
      const selection = window.getSelection();
     selection.removeAllRanges();
     selection.addRange(range);
      try {
       const successful = document.execCommand('copy');
       selection.removeAllRanges();
        if (!successful) {
         alert('Copy command failed. Please use Ctrl/Cmd+C to copy.');
       }
     } catch (err) {
       alert('Sorry, copy is not working. Please use Ctrl/Cmd+C to copy.');
     }
   }
 }


 saveText(evt) {
   evt.preventDefault();
  
   if (this.editableDiv) {
     const textContent = this.editableDiv.innerText;
     const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
     FileSaver.saveAs(blob, `gcp_file_${Date.now()}.txt`);
   }
 }


 updateProps(props) {
   let destinationProjection = 'EPSG:4326';
   const { points, status } = props.controlpoints;
   const { sourceProjection } = props;


   if (!sourceProjection || sourceProjection === 'EPSG:4326') {
     let utmZones = points.filter(p => p.type === 'map')
       .map(p => getUtmZoneFromLatLng(p.coord[0], p.coord[1]));
     utmZones = uniqWith(utmZones, isEqual);
     if (utmZones.length === 1) {
       const { zone, hemisphere } = utmZones[0];
       destinationProjection = getProj4Utm(zone, hemisphere);
     }
   }
   else {
     destinationProjection = sourceProjection;
   }


   let error = status.errors.map((err, index) => {
       return <p key={index} dangerouslySetInnerHTML={{ __html: err }} />
     });


   const exportText = this.renderGcpOutput(destinationProjection);
   this.setState({ destinationProjection, error, exportText });
 }


 componentWillReceiveProps(nextProps) {
   this.updateProps(nextProps);
 }


 updateDestinationProjection(destinationProjection) {
   let exportText = '';
   let error;
   try {
     exportText = this.renderGcpOutput(destinationProjection);
   }
   catch (e) {
     error = <p>Invalid coordinate reference system. Please enter a valid <a href="http://proj4.org/">proj.4</a> string.</p>;
   }
   this.setState({ destinationProjection, error, exportText });
 }


 renderGcpOutput(destinationProjection) {
   const { controlpoints, projection } = this.props;
   let sourceProjection = projection ? projection : 'EPSG:4326';


   const rows = generateGcpOutput(controlpoints.joins, controlpoints.points, sourceProjection, destinationProjection);
   const proj = `${destinationProjection}\t`;
   rows.unshift(proj);
   return rows.join('\n');
 }


 render() {
   const { controlpoints } = this.props;
   const { status } = controlpoints;
   const { destinationProjection, error, exportText } = this.state;
  
  


   return (
     <div className={classNames('export-modal', 'modal-dialog', {
       'no-pts': !status.valid
     })}>
       <div className='bk' onClick={(evt) => {this.props.onClick(evt);} }/>
       <div className='overlay'></div>
       <div className='inner'>
        
         {/* <div className='head'>
           <div className='head-inside'>
              <div className='head-inside-content'>
              
              Ground control point file
              
              
              </div>
              <div className='icon' onClick={(evt) => {this.props.onClick(evt);} }>
                 <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12.5 4.5L4.5 12.5M4.5 4.5L12.5 12.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                 </svg>


              </div>
             
           </div>
         </div> */}
         <div className='head'>
         <div className='head-inside'>
           <div className='head-inside-content'>
           Ground control point file
           </div>
         </div>


         <div className='icon' onClick={(evt) => {this.props.onClick(evt);} }>
                       <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M12.5 4.5L4.5 12.5M4.5 4.5L12.5 12.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                       </svg>
         </div>
       </div>
       <div className='main-line-head'>
         <div className='line-head'>


         </div>
       </div>
         <div className='output'>
          
           <div>
             <div>
               <input
                 className='destination-projection'
                 type="text"
                 value={destinationProjection}
                 onChange={(e) => this.updateDestinationProjection(e.target.value)}
               />
              
               {/* <textarea style={{ resize:'none' }} ref={el => {this.txtarea = el;}} readOnly value={exportText}/> */}
               
             <div className="file-content">
 <table className="custom-table">
   <tbody>
     {exportText.split('\n').map((line, idx) => {
       const words = line.trim().split(/\s+/);
       const lastWord = words.pop();
       const reorderedWords = [lastWord, ...words];


       return (
         <tr key={idx}>
           {reorderedWords.map((word, wordIdx) => (
             <td key={wordIdx} className={wordIdx === 0 ? 'first-word' : 'word'}>
               {word}
             </td>
           ))}
         </tr>
       );
     })}
   </tbody>
 </table>
</div>
             </div>





             {error &&
             <div className='errors'>{error}</div>
             }
             <div className='actions'>
             
               <button className='copy-btn' onClick={e => {this.copyText(e);}} disabled={!status.valid}>
                 <div className='copy-btn-content'>
                 Copy
                 </div>
               </button>
               { this.isFileSaverSupported &&
               <button className='save-btn' onClick={e => {this.saveText(e);}} disabled={!status.valid}>
                 <div className='save-btn-content'>
                 Save
                 </div>
               </button>
               }
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }
}


export default ExportModal;




