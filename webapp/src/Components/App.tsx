import React, { useEffect, useState } from 'react';
import { Store, Action } from 'redux';
import { GlobalState } from '@mattermost/types/lib/store';

import './App.css';
import Home from './Home/Home'
import Result from './Result/Result'
import Error from './Error/Error'


function App({ store }: { store: Store<GlobalState, Action<Record<string, unknown>>> }) { 

  const handleSearchQuery = (e : any) => {
    e.preventDefault();
  }

  return (
    <div className="ss-root">
      <div className="search-input-wrapper">
          <form onSubmit={handleSearchQuery}>
            <input type="text" placeholder='Search'/>
          </form>
      </div>
      <div className="bottom-content-wrapper">
        <Home/>
        {/* <Result/> */}
        {/* <Error/> */}
      </div>
    </div>
  )
}

export default App;