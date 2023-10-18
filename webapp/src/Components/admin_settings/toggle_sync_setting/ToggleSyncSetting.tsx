import { GlobalState } from '@mattermost/types/lib/store'
import React, { useEffect, useState } from 'react'
import { Action, Store } from 'redux'

import './toggleSyncSettingStyle.css'

function ToggleSyncSetting({
    store,
}: {
    store: Store<GlobalState, Action<Record<string, unknown>>>;
}) {
    // eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;
    const [loading, setLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState<boolean>();
    const [lastFetchTime, setLastFetchTime] = useState<number>();

    useEffect(() => {
        const fetchSettings = async () => {
            const fetchOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            };

            setLoading(true);

            try {
                const api = `${apiURL}/`;

                const res = await fetch(api!, fetchOptions);

                const jsonRes = await res.json();

                setLastFetchTime(jsonRes.last_fetch_time); // used to check if the sync is running for the first time

                handleSetIsSyncing(jsonRes.is_syncing);
            } catch (err: any) {
                // eslint-disable-next-line no-console
                console.warn('Error', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const startSync = async () => {
        // const postObj = {
        //     mm_api_url: store.getState().entities.general.config.SiteURL + '/api/v4',
        // };

        const postOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',

            // body: JSON.stringify(postObj),
        };

        try {
            const api = `${apiURL}/start_sync`;

            const res = await fetch(api!, postOptions);

            const jsonRes = await res.json();

            console.log(jsonRes);

            return jsonRes.is_syncing;
        } catch (err: any) {
            // eslint-disable-next-line no-console
            console.warn('Error', err);

            return false;
        }
    };

    const stopSync = async () => {
        const fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        };

        try {
            const api = `${apiURL}/stop_sync`;

            const res = await fetch(api!, fetchOptions);

            const jsonRes = await res.json();

            return jsonRes.is_syncing;
        } catch (err: any) {
            // eslint-disable-next-line no-console
            console.warn('Error', err);
            return true;
        }
    };

    const handleSetIsSyncing = async (checked: boolean) => {
        setLoading(true);

        try {
            if (checked) {
                const syncStartRes = await startSync();
                setIsSyncing(syncStartRes);
            } else {
                const syncStoptRes = await stopSync();
                setIsSyncing(syncStoptRes);
            }
        } catch (err: any) {
            // eslint-disable-next-line no-console
            console.warn('Error', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ss-setting-form'>
            <label className='switch'>
                <input
                    type='checkbox'
                    checked={isSyncing}
                    onChange={(e) => handleSetIsSyncing(e.target.checked)}
                    disabled={loading}
                />
                <span className='slider round'/>
            </label>
        </div>
    );
}

export default ToggleSyncSetting;