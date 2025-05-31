import React from 'react';
import classNames from 'classnames';

const backArrowSvg = (
  <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.55093 1.05078L1.70093 6.9213L7.55093 12.7918" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default (props) => {
  if (!props.imageSelected) return null; // Don't render if no image selected

  return (
    <button
      className={classNames('toggle-grid', 'to-grid')}
      onClick={props.onClick}
    >
      {backArrowSvg}
    </button>
  );
};
