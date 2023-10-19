import React from 'react'

import { Action, Store } from 'redux'

import { GlobalState } from '@mattermost/types/lib/store'

import { manifest } from '@/manifest'

import IsEngineOnlineSetting from './Components/admin_settings/is_engine_online_setting/IsEngineOnlineSetting'
import ResetSyncSetting from './Components/admin_settings/reset_sync_setting/ResetSyncSetting'
import SyncIntervalSetting from './Components/admin_settings/sync_interval_setting/SyncIntervalSetting'
import TimeLeftUntilNextSyncSetting from './Components/admin_settings/time_left_until_next_sync_setting/TimeLeftUntilNextSyncSetting'
import ToggleSyncSetting from './Components/admin_settings/toggle_sync_setting/ToggleSyncSetting'
import UploadSlackExportFileSetting from './Components/admin_settings/upload_slack_export_file_setting/UploadSlackExportFileSetting'
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

        registry.registerAdminConsoleCustomSetting('isEngineOnline', IsEngineOnlineSetting);

        registry.registerAdminConsoleCustomSetting('syncInterval', SyncIntervalSetting, {showTitle: true});

        registry.registerAdminConsoleCustomSetting('toggleSync', ToggleSyncSetting, {showTitle: true});

        registry.registerAdminConsoleCustomSetting('resetSync', ResetSyncSetting, {showTitle: true});

        registry.registerAdminConsoleCustomSetting('timeLeftUntilNextSync', TimeLeftUntilNextSyncSetting, {showTitle: true});

        registry.registerAdminConsoleCustomSetting('uploadSlackExportFile', UploadSlackExportFileSetting, {showTitle: true});

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