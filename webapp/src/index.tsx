import React from 'react';
// import {useSelector} from 'react-redux';

import { Store, Action } from 'redux';

import { GlobalState } from '@mattermost/types/lib/store';

import { manifest } from '@/manifest';

import { PluginRegistry } from '@/types/mattermost-webapp';
// import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import App from './Components/App';
const Icon = () => <i className='icon fa fa-search' />;
// eslint-disable-next-line
const al = (window: any) => window.openSSModal = true;
const r = (state: any, action: any) => {
    if (!state) {
        state = { openModal: true }
    }
    if (action?.type?.hasOwnProperty("openModal")) {
        state.openModal = action.type.openModal
    }
    return state
}
const openModalAction = { type: { openModal: true } }
export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: any, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        // @see https://developers.mattermost.com/extend/plugins/webapp/reference/
        // const currentUser = useSelector(getCurrentUser);
        registry.registerChannelHeaderButtonAction(<Icon />, () => store.dispatch(openModalAction), 'Semantic search');
        registry.registerGlobalComponent(() => <App store={store} />);
        console.log("heyyy");
        // console.log({currentUser});

        registry.registerReducer(r);

    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void
    }
}

window.registerPlugin(manifest.id, new Plugin());