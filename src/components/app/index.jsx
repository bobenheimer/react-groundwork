import React, { Component } from 'react';
import Modal from '../modal';
import exampleImg from 'assets/example.png';
import './app.scss';

class App extends Component {
  state = { modalOpen: false };

  render () {
    const { modalOpen } = this.state;
    return (
      <div className='main-app'>
        <div>hello, world</div>
        <div><img src={exampleImg} /></div>
        <div>
          <button onClick={() => this.setState({ modalOpen: true })}>
            Open Modal
          </button>
        </div>

        {modalOpen && (
          <Modal onClose={() => this.setState({ modalOpen: false })}>
            {({ close }) => (
              <div>
                <div>This is a modal</div>
                <button onClick={close}>Close this modal</button>
              </div>
            )}
          </Modal>
        )}
      </div>
    );
  }
}

export default App;