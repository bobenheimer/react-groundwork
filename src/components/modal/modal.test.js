import React from 'react';
import { expect } from'chai'
import { mount } from 'enzyme';
import sinon from 'sinon';
import Modal from './index';

describe('Modal test', () => {
  let onClose, wrapper, clock;

  beforeEach(() => {
    onClose = sinon.spy();
    wrapper = mount(
      <Modal onClose={onClose}>
        <div id='test-modal'>Modal</div>
      </Modal>
    );
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore()
  });

  it('Renders children and calls onClose on outside click', () => {
    expect(wrapper.find('#test-modal')).to.have.length(1);

    const modalWrapper = wrapper.find('.modal-wrapper');
    expect(modalWrapper).to.have.length(1);
    modalWrapper.simulate('click');
    clock.tick(500);
    expect(onClose.callCount).to.equal(1);
  });

  it('Doesn\'t call onClose when clicking inside modal content', () => {
    wrapper.find('#test-modal').simulate('click');
    clock.tick(500);
    expect(onClose.callCount).to.equal(0);
  });

  it('Renders children as function and calls onclose', () => {
    wrapper = mount(
      <Modal onClose={onClose}>
        {({ close }) => <div id='test-close' onClick={close}>Close</div>}
      </Modal>
    );

    const closeEl = wrapper.find('#test-close');
    expect(closeEl).to.have.length(1);
    closeEl.simulate('click');
    clock.tick(500);
    expect(onClose.callCount).to.equal(1);
  })
});
