import React, { useEffect, useState } from 'react';
import { Store, Action } from 'redux';
import { GlobalState } from '@mattermost/types/lib/store';

import './App.css';
import Modal from './Modal/Modal'
declare global {
  interface Window { openSSModal: any; }
}
function App({ store }: { store: Store<GlobalState, Action<Record<string, unknown>>> }) {
  const [openModal, setOpenModal] = useState(false)
  
  useEffect(() => {
    return store.subscribe(() => {
      const storeState: any = store.getState()
      const state = storeState['plugins-com.sing.semantic-search']
      setOpenModal(state.openModal)
    })
  }, [])
  const changeOpenModal = (val: boolean) => {
    const openModalAction = { type: { openModal: val } }
    store.dispatch(openModalAction)
  }
  const handleModalBg = () => {
    changeOpenModal(false)
  }
  return (
    <div className={`ss-container ${openModal ? '' : 'ss-hidden'}`}>
      <div className='ss-container-bg' onClick={handleModalBg} />
      <div className='ss-container-modal'>
          <Modal/>
      </div>
    </div>
  )
}

export default App;