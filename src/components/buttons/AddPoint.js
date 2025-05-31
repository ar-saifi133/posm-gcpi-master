import React from 'react';
                                                                                                                                                                                                  
const AddPoint = (props) => {
    return (
      <div className='add-point-wrapper'>
        <button className='add-point'  onClick={props.onClick}>
        <div className='add-point-svg'>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"  viewBox="0 0 12 12" fill="none">
  <g clip-path="url(#clip0_4502_3567)">
    <path d="M6 11.25C8.8995 11.25 11.25 8.8995 11.25 6C11.25 3.10051 8.8995 0.75 6 0.75C3.10051 0.75 0.75 3.10051 0.75 6C0.75 8.8995 3.10051 11.25 6 11.25Z" stroke="#262626" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3.75 6H8.25001" stroke="#262626" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 3.75V8.25" stroke="#262626" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_4502_3567">
      <rect width="12" height="12" fill="white"/>
    </clipPath>
  </defs>
</svg>
        </div>
<span style={{ marginLeft: '6px' }}>Add Point</span>
        </button>
        {/* <div className='helper'>
          <p>Click on the image or map to add a point.</p>
        </div> */}

      </div>
    )
}

export default AddPoint;