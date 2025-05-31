import React, { Component } from 'react';
import Dropzone from 'react-dropzone';


const DROPZONE_STYLE_ACTIVE = { borderStyle: 'solid', backgroundColor: '#eee' };
const DROPZONE_STYLE_REJECT = { borderStyle: 'solid', backgroundColor: '#ffdddd' };


class ImagesGetter extends Component {
 constructor(props) {
   super(props);
   this.state = {
     showDropdown: false
   };


   this.onImagesDrop = this.onImagesDrop.bind(this);
   this.onTextDrop = this.onTextDrop.bind(this);
   this.submitLocalFiles = this.submitLocalFiles.bind(this);
   this.onToggle = this.onToggle.bind(this);
   this.toggleDropdown = this.toggleDropdown.bind(this);
 }


 onImagesDrop(acceptedFiles, rejectedFiles) {
   const { receiveImageFiles, imagery } = this.props;
   let items = imagery.items ? imagery.items.map(d => d.name) : [];
    this.images = acceptedFiles.filter(f => items.indexOf(f.name) < 0);
   if (!this.images.length) return;
    receiveImageFiles(this.images, this.gcpText);


   this.setState({ showDropdown: false });
 }


 onTextDrop(acceptedFiles, rejectedFiles) {
   if (!acceptedFiles.length) return;
   const { previewGcpFile } = this.props;
   const name = acceptedFiles[0].name;
   const fReader = new FileReader();
   fReader.readAsText(acceptedFiles[0]);
    fReader.onload = () => {
     previewGcpFile(name, fReader.result);
     this.setState({ showDropdown: false });
   };
 }


 submitLocalFiles(evt) {
   evt.preventDefault();
   const { receiveImageFiles } = this.props;
   receiveImageFiles(this.images, this.gcpText);
 }


 onToggle() {
   this.gcpText = null;
   this.images = null;
 }


 toggleDropdown() {
   this.setState(prev => ({ showDropdown: !prev.showDropdown }));
 }


 renderFileText() {
   const { imagery } = this.props;
   return imagery.gcp_list_name
     ? <div>GCP file loaded: <b>{imagery.gcp_list_name}</b></div>
     : <div>Upload an existing GCP file</div>;
 }


 render() {
   const { showDropdown } = this.state;


   return (
     <div className="images-getter">
     <button className="upload-toggle-button" onClick={this.toggleDropdown}>
    
       <span >Upload File/image</span>
     </button>
  
     {showDropdown && (
       <aside className="images-form">
         <div className="dropdown-title">ADD</div>
  
         <div className="dropzone-wrapper">
           <Dropzone
             className="dropzone"
             disablePreview={true}
             onDrop={this.onTextDrop}
             activeStyle={DROPZONE_STYLE_ACTIVE}
             rejectStyle={DROPZONE_STYLE_REJECT}
             accept="text/plain"
           >
             <div className="dropzone-content">
            
               <span className="icon"><svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.66667 4.63158C6.13623 4.63158 5.62753 4.44859 5.25245 4.12287C4.87738 3.79715 4.66667 3.35538 4.66667 2.89474V0.578947H2C1.64638 0.578947 1.30724 0.700939 1.05719 0.918087C0.807142 1.13523 0.666667 1.42975 0.666667 1.73684V9.26316C0.666667 9.57025 0.807142 9.86477 1.05719 10.0819C1.30724 10.2991 1.64638 10.4211 2 10.4211H8C8.35362 10.4211 8.69276 10.2991 8.94281 10.0819C9.19286 9.86477 9.33333 9.57025 9.33333 9.26316V4.63158H6.66667ZM5.33333 2.89474C5.33333 3.20183 5.47381 3.49634 5.72386 3.71349C5.97391 3.93064 6.31305 4.05263 6.66667 4.05263H9.06L5.33333 0.816316V2.89474ZM2 0H5.33333L10 4.05263V9.26316C10 9.7238 9.78929 10.1656 9.41421 10.4913C9.03914 10.817 8.53043 11 8 11H2C1.46957 11 0.960859 10.817 0.585787 10.4913C0.210714 10.1656 0 9.7238 0 9.26316V1.73684C0 1.2762 0.210714 0.83443 0.585787 0.508709C0.960859 0.182988 1.46957 0 2 0Z" fill="white"/>
</svg>
</span>


               <span className="text" > Upload an existing GCP file</span>
             </div>
           </Dropzone>
         </div>
  
         <div className="dropzone-wrapper">
           <Dropzone
             className="dropzone"
             disablePreview={true}
             onDrop={this.onImagesDrop}
             activeStyle={DROPZONE_STYLE_ACTIVE}
             rejectStyle={DROPZONE_STYLE_REJECT}
             accept="image/jpeg,image/png"
           >
             <div className="dropzone-content">
               <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
 <path d="M2.01 11.5C1.72208 11.5 1.48187 11.4037 1.28937 11.2112C1.09687 11.0187 1.00042 10.7783 1 10.49V2.51C1 2.22208 1.09646 1.98187 1.28937 1.78937C1.48229 1.59687 1.7225 1.50042 2.01 1.5H9.99062C10.2781 1.5 10.5183 1.59646 10.7112 1.78937C10.9042 1.98229 11.0004 2.2225 11 2.51V10.4906C11 10.7781 10.9037 11.0183 10.7112 11.2112C10.5187 11.4042 10.2783 11.5004 9.99 11.5H2.01ZM2.01 10.875H9.99062C10.0865 10.875 10.1746 10.835 10.255 10.755C10.3354 10.675 10.3754 10.5867 10.375 10.49V2.51C10.375 2.41375 10.335 2.32542 10.255 2.245C10.175 2.16458 10.0867 2.12458 9.99 2.125H2.01C1.91375 2.125 1.82542 2.165 1.745 2.245C1.66458 2.325 1.62458 2.41333 1.625 2.51V10.4906C1.625 10.5865 1.665 10.6746 1.745 10.755C1.825 10.8354 1.91312 10.8754 2.00937 10.875M3.1875 9.3125H8.90875L7.14187 6.95625L5.5075 9.02375L4.41375 7.70187L3.1875 9.3125Z" fill="white"/>
</svg></span>
               <span className="text"  >Upload an image / drag</span>
             </div>
           </Dropzone>
         </div>
       </aside>
     )}
   </div>
  
   );
 }
}


export default ImagesGetter;








