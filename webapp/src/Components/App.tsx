import React, { useEffect, useState } from 'react';

import './App.css';
import Modal from './Modal/Modal'
declare global {
  interface Window { openSSModal: any; }
}
function App() {
  return (
    <div className={`ss-container ${window.openSSModal?'':'ss-hidden'}`}>
      <div className='ss-container-bg' onClick={() => window.openSSModal = false} />
      <div className='ss-container-modal'>
        <Modal />
      </div>
    </div>
  )
}

export default App;