import React from 'react';

import { Store, Action } from 'redux';

import { GlobalState } from '@mattermost/types/lib/store';

import { manifest } from '@/manifest';

import { PluginRegistry } from '@/types/mattermost-webapp';
import App from './Components/App';
const Icon = () => <i className='icon fa fa-search' />;


export default class Plugin {
    public async initialize(registry: any, store: Store<GlobalState, Action<Record<string, unknown>>>) {        
        const {
            rhsID, 
            showRHSPlugin, 
            hideRGSPlugin, 
            toggleRHSPlugin
        } = registry.registerRightHandSidebarComponent(() => <App store={store} />);

        registry.registerChannelHeaderButtonAction(
            <Icon />, 
            (): void => store.dispatch(toggleRHSPlugin), 
            'Semantic search'
        );
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void
    }
}

window.registerPlugin(manifest.id, new Plugin());