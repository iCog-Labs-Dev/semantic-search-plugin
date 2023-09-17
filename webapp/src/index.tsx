import React from 'react'

import { Action, Store } from 'redux'

import { GlobalState } from '@mattermost/types/lib/store'

import { manifest } from '@/manifest'

import App from './Components/App'
const Icon = () => <i className='icon fa fa-search'/>;

export default class Plugin {
    globalRegistry: any;
    registeredComponents: any[] = [];

    public async initialize(registry: any, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        const {
            id,
            toggleRHSPlugin,
        } = registry.registerRightHandSidebarComponent(() => <App store={store}/>, 'Semantic Search');

        registry.registerChannelHeaderButtonAction(
            <Icon/>,
            (): void => store.dispatch(toggleRHSPlugin),
            'Semantic search',
        );

        this.globalRegistry = registry;
        this.registeredComponents.push(id);
    }

    public uninitialize() {
        // eslint-disable-next-line no-console
        console.log(manifest.id + '::uninitialize()');

        if (this.globalRegistry) {
            for (const component of this.registeredComponents) {
                this.globalRegistry.unregisterComponent(component);
            }
        }
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void
    }
}

window.registerPlugin(manifest.id, new Plugin());