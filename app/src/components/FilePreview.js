import React, { Component } from 'react';




export default class FilePreview extends Component {
render () {
  const { errors, previewGcpFileCancel, previewText, receiveGcpFile } = this.props;
  document.querySelectorAll('file-preview textarea').forEach((el) => {
    el.setAttribute('draggable', 'false');
    el.addEventListener('dragstart', (e) => e.preventDefault());
  });
  return (
    <div className='file-preview modal-dialog'>
      <div className='bk' onClick={previewGcpFileCancel}/>
      <div className='overlay'></div>
      <div className='inner'>
        {/* <div className='head'>
        <div className='head-inside'>
            <div className='head-inside-content'>
          
             File Preview
          
          
            </div>
           
         
         </div>


         <div className='icon' onClick={previewGcpFileCancel}>
               <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12.5 4.5L4.5 12.5M4.5 4.5L12.5 12.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>








            </div>








        </div> */}
        <div className='head'>
         <div className='head-inside'>
           <div className='head-inside-content'>
             File Preview
           </div>
         </div>


         <div className='icon' onClick={previewGcpFileCancel}>
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
       
       
       <div className="file-content">
 <table className="custom-table">
   <tbody>
     {previewText.split('\n').map((line, idx) => {
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



         {errors && (
           <div className='errors'>
             {errors.map((error, i) => <p key={`error-${i}`}>{error}</p>)}
           </div>
         )}




















<div className='actions'>
        
          <button className='upload-btn'
            disabled={errors.length > 0}
            onClick={receiveGcpFile}
          >
            <div className='upload-content'>Upload</div>
          </button>
        </div>












        </div>
      </div>
    </div>
  );
}
}
















