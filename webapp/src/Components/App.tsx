import React, { useEffect, useState } from 'react';
import { Store, Action } from 'redux';
import { GlobalState } from '@mattermost/types/lib/store';

import './App.css';
declare global {
  interface Window { openSSModal: any; }
}
function App({ store }: { store: Store<GlobalState, Action<Record<string, unknown>>> }) {

  return (
    <div className="ss-root">
      
    </div>
  )
}

export default App;