import React from 'react';
import ExportButton from './ExportButton';
import ImagesGetter from '../connectors/ImagesGetter';
import ImageNav from '../connectors/ImageNav'; // ← add this
import Directions from './Directions';

const Header = (props) => {
  const { status, onExportClick, onBack, showAddPoint, onAddPoint, setControlPoint } = props;
  const disabled = status === undefined;

  return (
    <header className="header" style={{
      background: '#262626',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' ,width: '100%' , justifyContent: 'center', 
        // paddingLeft:showAddPoint? '40px ': '0',
      }}>

        <ImageNav setControlPoint={setControlPoint} />
      <ImagesGetter />
      <ExportButton onClick={onExportClick} disabled={disabled} />
      <Directions />
      </div>

      <div style={{ display: 'flex', gap: '10px',  alignItems: 'center' }}>
        { /* {showAddPoint && (
          <button
            onClick={onAddPoint}
            style={{
              backgroundColor: '#2acfff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Add Point
          </button>
        )} */ }
      </div>
    </header>
  );
};

export default Header;
