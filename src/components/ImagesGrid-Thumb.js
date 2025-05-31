import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import ImageLoader from 'blueimp-load-image';


class ImagesGridThumb extends Component {
  static propTypes = {
    src: PropTypes.object,
    filename: PropTypes.string,
    onThumbClick: PropTypes.func,
    onDeleteImage: PropTypes.func,
    selected: PropTypes.bool,
    points: PropTypes.number
  };

  static defaultProps = {
    src: null,
    filename: '',
    onThumbClick: () => {},
    onDeleteImage: () => {},
    selected: false,
    points: 0
  };

  loadImage(src) {
    if (!src) return;
    let imgElm = this.thumbImage;

    let options = {
      canvas: true,
      maxWidth: 150,
      maxHeight: 150,
      contain: true,
      pixelRatio: window.devicePixelRatio,
      orientation: true
    };

    ImageLoader(
      src,
      (canvas) => {
        imgElm.style.backgroundImage = `url(${canvas.toDataURL('image/jpeg', 0.5)})`;
      },
      options
    );
  }

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src) this.loadImage(nextProps.src);
  }

  componentDidMount() {
    this.loadImage(this.props.src);
  }

  onClickHandler(evt) {
    const { onThumbClick, src, selected } = this.props;
    evt.preventDefault();
    onThumbClick(src, selected);
  }

  onDeleteHandler(evt) {
    const { onDeleteImage, filename } = this.props;
    evt.preventDefault();
    evt.stopPropagation();
    onDeleteImage(filename);
  }

  render() {
    const { filename, points, selected, src } = this.props;

    return (
      <div
        className={classNames('image-card', {
          'no-img': !src,
          selected
        })}
        onClick={(evt) => this.onClickHandler(evt)}
      >
        <div className="card-header">
          <span className="image-title">{filename}</span>
          <button className="close-btn" onClick={(evt) => this.onDeleteHandler(evt)}>
            &times;
          </button>
        </div>
        <div className="points-label">
          <span className="dot">●</span> Points: {points}
        </div>
        <div className="thumb-img" ref={(el) => (this.thumbImage = el)} />
      </div>
    );
  }
}

export default ImagesGridThumb;
