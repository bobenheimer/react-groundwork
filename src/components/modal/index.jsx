import React, {Component} from 'react';
import {createPortal} from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash'
import './modal.scss';

const transitionTimeout = 300; // Must match the css!

// Container for all the modals
const $modalContainer = document.createElement('div');
$modalContainer.className = 'modal-container';
document.body.appendChild($modalContainer);

class Modal extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func
    ]).isRequired,
    onClose: PropTypes.func.isRequired,
    backgroundClose: PropTypes.bool
  };

  static defaultProps = {
    backgroundClose: true
  };

  state = {};

  close = () => {
    // If there are other modals active don't transition out
    if ($modalContainer.childNodes.length > 1) {
      this.props.onClose();
      return
    }

    // We need to keep the component mounted while we transition out
    this.setState({ transitioningOut: true });
    $modalContainer.classList.add('transitioning-out');
    setTimeout(this.props.onClose, transitionTimeout); // Must match the css
  };

  componentDidMount () {
    $modalContainer.classList.add('active');
  }

  componentWillUnmount () {
    if ($modalContainer.childNodes.length <= 1) {
      $modalContainer.classList.remove('active');
      $modalContainer.classList.remove('transitioning-out');
    }
  }

  render () {
    const { children } = this.props;
    const { transitioningOut } = this.state;

    return createPortal(
      (
        <div className='modal-wrapper' onClick={this.close}>
          <div className='modal-content' onClick={e => { e.stopPropagation() }}>
            {_.isFunction(children)
              ? children({ close: this.close })
              : children
            }
          </div>
          {/* Show overlay so the user can't click anywhere inside the content */}
          {transitioningOut && <div className='modal-overlay' />}
        </div>

      ),
      $modalContainer
    );
  }
}

export default Modal;
