/* eslint-disable no-nested-ternary */
import React, { Fragment, useCallback, useEffect, useState } from 'react'

import './timeLeftUntilNextSyncSettingStyle.css'

function TimeLeftUntilNextSyncSetting(props: { helpText: { props: { text: string } } }) {
    //eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // UNCOMMENT THIS WHEN TESTING
    // const [lastFetchTime, setLastFetchTime] = useState(new Date('2023-10-04T13:21:00.000Z').getTime());

    const [lastFetchTime, setLastFetchTime] = useState(0);
    const [fetchInterval, setFetchInterval] = useState(0);
    const [isSyncing, setIsSyncing] = useState<boolean>();
    const [countDown, setCountDown] = useState(0);

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

            setLastFetchTime(jsonRes.last_sync_time);
            setFetchInterval(jsonRes.sync_interval * 1000);

            // setIsSyncing(jsonRes.is_syncing);
        } else {
            const jsonErr = await response?.json();

            setHasError(true);
            setErrorMessage(jsonErr.message);
        }
    }, [apiURL]);

    useEffect(() => {
        const firstRun = async () => {
            await syncWithServer();
        };

        firstRun();

        const eventSource = new EventSource(`${apiURL}/sync/is_started`, {withCredentials: true});

        eventSource.onmessage = (event) => {
            const isSyncingTemp = event.data === 'True'; // convert to bool

            // console.log('Counter started ', isSyncingTemp);

            setIsSyncing(isSyncingTemp);
        };
        eventSource.onerror = (error) => {
            console.error('Sync SSE Error:', error);

            eventSource.close();
        };
    }, []);

    useEffect(() => {
        console.log('LastFetchTime: ', lastFetchTime);
        const remainingTime = (lastFetchTime + fetchInterval) - new Date().getTime();

        let firstCountDown = remainingTime;

        if (remainingTime < 1000) {
            firstCountDown = 0;
        }

        setCountDown(firstCountDown);
    }, [lastFetchTime]);

    useEffect(() => {
        const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

        // eslint-disable-next-line no-console
        // console.log(hours, minutes, seconds);

        if (countDown >= 0) {
            setTimeLeft({
                hours,
                minutes,
                seconds,
            });
        }

        const interval = setInterval(async () => {
            if (countDown < 1000) { // since we are counting down every second
                clearInterval(interval);
                if (isSyncing) {
                    await syncWithServer();
                }
            }

            const remainingTime = (lastFetchTime + fetchInterval) - new Date().getTime();

            setCountDown(remainingTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [countDown, lastFetchTime, fetchInterval]);

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

    return (
        <Fragment>
            <Fragment>
                {loading ? (
                    <p> {'Loading ...'} </p>
                ) : (
                    <Fragment>
                        {isSyncing ? (
                            lastFetchTime === 0 ? (
                                <p>{'Sync has not finished performing yet.'}</p>
                            ) : (
                                <div className='ss-time-left-counter'>
                                    <div className='ss-time-left-counter__item'>
                                        <span className='ss-time-left-counter__item__number'>
                                            { timeLeft.hours }
                                        </span>
                                        <span className='ss-time-left-counter__item__label'>
                                            { 'Hours' }
                                        </span>
                                    </div>
                                    <span className='ss-time-left-counter__divider'>{ ':' }</span>
                                    <div className='ss-time-left-counter__item'>
                                        <span className='ss-time-left-counter__item__number'>
                                            { timeLeft.minutes }
                                        </span>
                                        <span className='ss-time-left-counter__item__label'>
                                            { 'Minutes' }
                                        </span>
                                    </div>
                                    <span className='ss-time-left-counter__divider'>{ ':' }</span>
                                    <div className='ss-time-left-counter__item'>
                                        <span className='ss-time-left-counter__item__number'>
                                            { timeLeft.seconds }
                                        </span>
                                        <span className='ss-time-left-counter__item__label'>
                                            { 'Seconds' }
                                        </span>
                                    </div>
                                </div>
                            )
                        ) : (
                            <p> {'Not Syncing ...'} </p>
                        )}
                    </Fragment>
                )}
            </Fragment>
            <p
                className='ss-left-time-error-message'
                style={{display: hasError ? 'block' : 'none'}}
            >
                {errorMessage}
            </p>
            <p className='ss-left-time-text'>
                {props.helpText.props.text}
            </p>
        </Fragment>
    );
}

export default TimeLeftUntilNextSyncSetting;