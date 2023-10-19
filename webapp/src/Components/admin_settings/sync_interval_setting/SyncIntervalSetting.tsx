import React, { Fragment, useCallback, useEffect, useState } from 'react'

import './syncintervalSettingStyle.css'

function SyncIntervalSetting(props: { helpText: { props: { text: string } } }) {
    // eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [syncInterval, setSyncInterval] = useState({
        hour: 0,
        minute: 0,
    });

    const syncWithServer = useCallback(async () => {
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
            const api = `${apiURL}/`;

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

            const fetchedInterval = {
                hour: Math.floor(jsonRes.fetch_interval / (60 * 60)),
                minute: Math.floor((jsonRes.fetch_interval % (60 * 60)) / (60)),
            };

            // eslint-disable-next-line no-console
            // console.log('jsonRes.fetch_interval', fetchedInterval);

            setSyncInterval(fetchedInterval);
        } else {
            const jsonErr = await response?.json();

            setHasError(true);
            setErrorMessage(jsonErr.message);
        }
    }, [apiURL]);

    useEffect(() => {
        syncWithServer();
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

    const handleSyncIntervalHourChange = (e) => {
        e.preventDefault();

        if (e.target.value === '') {
            return;
        }

        const hourInterval = parseInt(e.target.value, 10);

        if (hourInterval > 23 || hourInterval < 0) {
            // eslint-disable-next-line no-console
            console.warn('invalid hour interval');
            return;
        }

        setSyncInterval({...syncInterval, hour: hourInterval});
    };

    const handleSyncIntervalMinuteChange = (e) => {
        e.preventDefault();

        if (e.target.value === '') {
            return;
        }

        const minuteInterval = parseInt(e.target.value, 10);

        if (minuteInterval > 59 || minuteInterval < 0) {
            // eslint-disable-next-line no-console
            console.warn('invalid minute interval');
            return;
        }

        setSyncInterval({...syncInterval, minute: minuteInterval});
    };

    const handleSyncIntervalSubmit = async (e) => {
        e.preventDefault();

        if (syncInterval.hour === 0 && syncInterval.minute === 0) {
            return;
        }

        const interval = ((syncInterval.hour * 60) + syncInterval.minute) * 60;

        const reqObj = {
            fetch_interval: interval,
        };

        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(reqObj),
        };

        // eslint-disable-next-line no-console
        // console.log('postOptions', postOptions);

        setLoading(true);

        let response;

        try {
            const api = `${apiURL}/set_fetch_interval`;

            response = await fetch(api!, postOptions);
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
            // eslint-disable-next-line no-console
            console.log('jsonRes', jsonRes);
        } else {
            const jsonErr = await response?.json();

            setHasError(true);
            setErrorMessage(jsonErr.message);
        }
    };

    return (
        <Fragment>
            <div className='ss-setting-sync-interval'>
                {/* TODO: wrap the input fields in a form element */}
                <div className='ss-setting-sync-interval__item'>
                    <input
                        className='ss-setting-sync-interval-input'
                        type='number'
                        min={0}
                        max={23}
                        value={syncInterval.hour}
                        onChange={handleSyncIntervalHourChange}
                    />
                    <span className='ss-setting-sync-interval-label'>{ 'hours' }</span>
                </div>
                <span className='ss-setting-sync-interval-divider'>{ ':' }</span>
                <div className='ss-setting-sync-interval__item'>
                    <input
                        className='ss-setting-sync-interval-input'
                        type='number'
                        min={0}
                        max={59}
                        value={syncInterval.minute}
                        onChange={handleSyncIntervalMinuteChange}
                    />
                    <span className='ss-setting-sync-interval-label'>{ 'minutes' }</span>
                </div>
                <button
                    onClick={handleSyncIntervalSubmit}
                    className='btn btn-primary'
                    disabled={loading || (syncInterval.hour === 0 && syncInterval.minute === 0)}
                > {'Save'} </button>
            </div>
            <p
                className='ss-sync-interval-error-message'
                style={{display: hasError ? 'block' : 'none'}}
            >
                {errorMessage}
            </p>
            <p className='ss-sync-interval-help-text'>
                {props.helpText.props.text}
            </p>
        </Fragment>
    );
}

export default SyncIntervalSetting;