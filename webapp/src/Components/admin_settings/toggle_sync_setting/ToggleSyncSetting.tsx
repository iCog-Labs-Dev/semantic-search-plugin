import React, { Fragment, useEffect, useState } from 'react'

import './toggleSyncSettingStyle.css'

// {
//     store,
// }: {
//     store: Store<GlobalState, Action<Record<string, unknown>>>;
// }

function ToggleSyncSetting(props: { helpText: { props: { text: string } } }) {
    // eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;
    const successMessage = 'Sync status changed successfully';

    const [loading, setLoading] = useState(false);
    const [wasSuccessful, setWasSuccessful] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
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

            let response;

            try {
                const api = `${apiURL}/root/get`;

                response = await fetch(api!, fetchOptions);
            } catch (err: any) {
                // eslint-disable-next-line no-console
                console.warn('Error', err);

                setHasError(true);
                setErrorMessage(err.message);
            } finally {
                setLoading(false);
            }

            if (response?.ok) {
                const jsonRes = await response.json();

                setIsSyncing(jsonRes.is_syncing);
                setLastFetchTime(jsonRes.last_sync_time); // used to check if the sync is running for the first time
            } else {
                const jsonErr = await response?.json();

                setHasError(true);
                setErrorMessage(jsonErr.message);

                setIsSyncing(false);
            }
        };

        fetchSettings();
    }, []);

    useEffect(() => {
        if (loading) {
            setHasError(false);
            setErrorMessage('');
        }
    }, [loading]);

    useEffect(() => {
        if (hasError) {
            setLoading(false);

            setTimeout(() => {
                setHasError(false);
                setErrorMessage('');
            }, 5000);
        }
    }, [hasError]);

    useEffect(() => {
        if (wasSuccessful) {
            setLoading(false);

            setTimeout(() => {
                setWasSuccessful(false);
                setErrorMessage('');
            }, 5000);
        }
    }, [wasSuccessful]);

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

        let response;

        try {
            const api = `${apiURL}/sync/start`;

            response = await fetch(api!, postOptions);
        
            const eventSource = new EventSource(`${apiURL}/sync/sync_percentage`, { withCredentials: true });
        
            eventSource.onmessage = (event) => {
                console.log('Sync progress... ', event.data )
            };
            eventSource.onerror = (error) => {
                console.error('Sync SSE Error:', error);
                eventSource.close();
            };

        } catch (err: any) {
            // eslint-disable-next-line no-console
            console.warn('Error', err);

            setHasError(true);
            setErrorMessage(err.message);
        }

        if (response?.ok) {
            const jsonRes = await response.json();

            setWasSuccessful(true);

            return jsonRes.is_syncing;
        }

        const jsonErr = await response?.json();

        setHasError(true);
        setErrorMessage(jsonErr.message);

        return false;
    };

    const stopSync = async () => {
        const fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        };

        let response;

        try {
            const api = `${apiURL}/sync/stop`;

            response = await fetch(api!, fetchOptions);
        } catch (err: any) {
            // eslint-disable-next-line no-console
            console.warn('Error', err);

            setHasError(true);
            setErrorMessage(err.message);
        }

        if (response?.ok) {
            const jsonRes = await response.json();

            setWasSuccessful(true);

            return jsonRes.is_syncing;
        }

        const jsonErr = await response?.json();

        setHasError(true);
        setErrorMessage(jsonErr.message);

        return true;
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
        <Fragment>
            <div className='ss-setting-toggle-sync'>
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
            <p
                className='ss-toggle-sync-success-message'
                style={{display: wasSuccessful ? 'block' : 'none'}}
            >
                {successMessage}
            </p>
            <p
                className='ss-toggle-sync-error-message'
                style={{display: hasError ? 'block' : 'none'}}
            >
                {errorMessage}
            </p>
            <p className='ss-toggle-sync-text'>
                {props.helpText.props.text}
            </p>
        </Fragment>
    );
}

export default ToggleSyncSetting;