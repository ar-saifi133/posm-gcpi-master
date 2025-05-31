import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class SlidingPanel extends Component {
 static propTypes = {
   panelOpen: PropTypes.bool.isRequired
 };

 static defaultProps = {
   panelOpen: false
 };

 render() {
   const { panelOpen } = this.props;

   return (
     <div
       className={classNames('sliding-panel', { open: panelOpen })} >
       {this.props.children}

       {/* <div className='resizer' onMouseDown={this.handleMouseDown}></div> */}
     </div>
   );
 }
}

export default SlidingPanel;




