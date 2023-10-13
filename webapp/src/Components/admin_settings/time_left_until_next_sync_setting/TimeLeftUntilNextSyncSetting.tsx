/* eslint-disable no-nested-ternary */
import React, { Fragment, useCallback, useEffect, useState } from 'react'

import './timeLeftUntilNextSyncSettingStyle.css'

function TimeLeftUntilNextSyncSetting() {
    //eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // UNCOMMENT THIS WHEN TESTING
    // const [lastFetchTime, setLastFetchTime] = useState(new Date('2023-10-04T13:21:00.000Z').getTime());

    const [lastFetchTime, setLastFetchTime] = useState(0);
    const [fetchInterval, setFetchInterval] = useState(15 * 60 * 1000); // 15 minutes default interval
    const [isSyncing, setIsSyncing] = useState<boolean>();
    const [countDown, setCountDown] = useState(0);

    const syncWithServer = useCallback(async () => {
        setLoading(true);

        const res = await fetch(`${apiURL}/`, {
            method: 'GET',
        });

        if (res.status !== 200) {
            // eslint-disable-next-line no-console
            console.error('failed to sync with server');
        }

        const jsonRes = await res.json();

        // eslint-disable-next-line no-console
        // console.log('jsonRes', jsonRes);

        setLastFetchTime(jsonRes.last_fetch_time);
        setFetchInterval(jsonRes.fetch_interval * 1000);
        setIsSyncing(jsonRes.is_syncing);

        setLoading(false);
    }, [apiURL]);

    useEffect(() => {
        const firstRun = async () => {
            await syncWithServer();
        };

        firstRun();
    }, []);

    useEffect(() => {
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

        setTimeLeft({
            hours,
            minutes,
            seconds,
        });

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

    return (
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
    );
}

export default TimeLeftUntilNextSyncSetting;