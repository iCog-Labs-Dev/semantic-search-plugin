import React, { Fragment, useEffect, useRef, useState } from 'react'

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
    const RETRYTIMEINSECONDS = 10 * 1000;

    const [loading, setLoading] = useState(false);
    const [wasSuccessful, setWasSuccessful] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [isInProgress, setIsInProgress] = useState(false);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [reRunEvent, setReRunEvent] = useState(false);

    const eventSource = useRef<EventSource>();

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
                setIsInProgress(jsonRes.in_progress);
            } else {
                const jsonErr = await response?.json();

                setHasError(true);
                setErrorMessage(jsonErr.message);
            }
        };

        fetchSettings();
    }, []);

    useEffect(() => {
        // console.log('reRun: ', reRunEvent);
        if (eventSource.current) {
            eventSource.current.close();
        }

        let interval:NodeJS.Timer;

        eventSource.current = new EventSource(`${apiURL}/sync/is_started`, {withCredentials: true});

        eventSource.current.onmessage = (event) => {
            const isSyncingTemp = event.data === 'True'; // convert to bool

            // console.log('Syncing: ', isSyncingTemp);

            setIsSyncing((previousValue) => {
                return previousValue === isSyncingTemp ? previousValue : isSyncingTemp;
            });
        };
        eventSource.current.onerror = (error) => {
            // console.error('Sync SSE Error:', error);

            eventSource.current?.close();

            interval = setInterval(async () => {
                setReRunEvent((previousValue) => {
                    return !previousValue;
                });
            }, RETRYTIMEINSECONDS);
        };

        return () => {
            clearInterval(interval);
        };
    }, [reRunEvent, eventSource]);

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

    useEffect(() => {
        setWasSuccessful(true);
    }, [isSyncing]);

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
        } catch (err: any) {
            // eslint-disable-next-line no-console
            console.warn('Error', err);

            setHasError(true);
            setErrorMessage(err.message);
        }

        if (response?.ok) {
            const eventSourcePercentage = new EventSource(`${apiURL}/sync/sync_percentage`, {withCredentials: true});

            eventSourcePercentage.onmessage = (event) => {
                console.log('Sync progress... ', event.data);

                setIsInProgress(true);
                setProgressPercentage(event.data);

                if (event.data >= 1) {
                    setIsInProgress(false);
                }
            };
            eventSourcePercentage.onerror = (error) => {
                console.error('Sync SSE Error:', error);

                eventSourcePercentage.close();
            };

            // --------------------

            const jsonRes = await response.json();

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
                await startSync();
            } else {
                await stopSync();
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
            {isInProgress ? <div className='ss-setting-sync-progress-wrapper'>
                <progress
                    className='ss-setting-sync-progress'
                    value={progressPercentage}
                />
                <span className='ss-setting-sync-progress-percentage'>{ ((progressPercentage * 100).toFixed(1)) + '%' }</span>
            </div> : <div className='ss-setting-toggle-sync'>
                <label className='switch'>
                    <input
                        type='checkbox'
                        checked={isSyncing}
                        onChange={(e) => handleSetIsSyncing(e.target.checked)}
                        disabled={loading}
                    />
                    <span className='slider round'/>
                </label>
            </div>}
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