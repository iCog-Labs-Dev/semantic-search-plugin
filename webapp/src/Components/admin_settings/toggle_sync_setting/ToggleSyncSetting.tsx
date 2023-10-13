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
        const postObj = {
            mm_api_url: store.getState().entities.general.config.SiteURL + '/api/v4',
        };

        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postObj),
        };

        try {
            const api = `${apiURL}/start_sync`;

            const res = await fetch(api!, postOptions);

            const jsonRes = await res.json();

            // handleSetIsSyncing(jsonRes.is_syncing);

            // eslint-disable-next-line no-console
            console.log('start sync', jsonRes);
        } catch (err: any) {
            // handleSetIsSyncing(false);
            // eslint-disable-next-line no-console
            console.warn('Error', err);
        }
    };

    const stopSync = async () => {
        const fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const api = `${apiURL}/stop_sync`;

            const res = await fetch(api!, fetchOptions);

            const jsonRes = await res.json();

            // handleSetIsSyncing(jsonRes.is_syncing);

            // eslint-disable-next-line no-console
            console.log('stop sync', jsonRes);
        } catch (err: any) {
            // handleSetIsSyncing(true);
            // eslint-disable-next-line no-console
            console.warn('Error', err);
        }
    };

    const postPersonalAccessToken = async () => {
        const postObj = {
            personal_access_token: '15dzsi3wejbofdub1rn4brs5ir',
        };

        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postObj),
        };

        try {
            const api = `${apiURL}/set_personal_access_token`;

            const res = await fetch(api!, postOptions);

            const jsonRes = await res.json();

            // eslint-disable-next-line no-console
            console.log('personal access token: ', jsonRes);
        } catch (err: any) {
        // eslint-disable-next-line no-console
            console.warn('Error', err);
        }
    };

    const handleSetIsSyncing = (checked: boolean) => {
        setLoading(true);

        setIsSyncing((currentIsSyncingValue) => {
            if (checked && !currentIsSyncingValue) {
                if (lastFetchTime === 0) {
                    postPersonalAccessToken();
                }
                startSync();
            } else if (!checked && currentIsSyncingValue) {
                stopSync();
            }
            return checked;
        });

        setLoading(false);
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