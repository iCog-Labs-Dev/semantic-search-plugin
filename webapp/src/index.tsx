import React from 'react';

import {Store, Action} from 'redux';

import {GlobalState} from '@mattermost/types/lib/store';

import {manifest} from '@/manifest';

import {PluginRegistry} from '@/types/mattermost-webapp';
import App from './Components/App';
const Icon = () => <i className='icon fa fa-anchor'/>;
// eslint-disable-next-line
const al = (window:any) => window.openSSModal = true;
export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: any, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        // @see https://developers.mattermost.com/extend/plugins/webapp/reference/
        registry.registerChannelHeaderButtonAction(<Icon/>, ()=>al(window), 'Hello World');
        registry.registerGlobalComponent(App);
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void
    }
}

window.registerPlugin(manifest.id, new Plugin());