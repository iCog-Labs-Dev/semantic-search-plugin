import React from 'react'

import { Action, Store } from 'redux'

import { GlobalState } from '@mattermost/types/lib/store'

import { manifest } from '@/manifest'

import RestartSyncSetting from './Components/admin_settings/restart_sync_setting/RestartSyncSetting'
import SyncIntervalSetting from './Components/admin_settings/sync_interval_setting/SyncIntervalSetting'
import ToggleSyncSetting from './Components/admin_settings/toggle_sync_setting/ToggleSyncSetting'
import RHSView from './Components/right_hand_sidebar/RightHandSidebar'

export default class Plugin {
    globalRegistry: any;
    registeredComponents: any[] = [];

    public async initialize(registry: any, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        const {
            id,
            toggleRHSPlugin,
        } = registry.registerRightHandSidebarComponent(() => <RHSView store={store}/>, 'Semantic Search');

        registry.registerChannelHeaderButtonAction(
            <i className='icon fa fa-search'/>,
            (): void => store.dispatch(toggleRHSPlugin),
            'Semantic search',
        );

        registry.registerAdminConsoleCustomSetting('syncInterval', SyncIntervalSetting, {showTitle: true});

        registry.registerAdminConsoleCustomSetting('toggleSync', ToggleSyncSetting, {showTitle: true});

        registry.registerAdminConsoleCustomSetting('restartSync', RestartSyncSetting, {showTitle: true});

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