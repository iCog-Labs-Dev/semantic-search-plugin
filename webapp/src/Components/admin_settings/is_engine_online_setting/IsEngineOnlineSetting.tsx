import React, { Fragment, useEffect, useRef, useState } from 'react'

import './isEngineOnlineSettingStyle.css'

function IsEngineOnlineSetting() {
    const RETRYTIMEINSECONDS = 5 * 1000;
    // eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const [retryTime, setRetryTime] = useState<number>(RETRYTIMEINSECONDS);
    const [numberOfRetries, setNumberOfRetries] = useState<number>(0);

    const eventSource = useRef<EventSource>();

    useEffect(() => {
        if (eventSource.current) {
            eventSource.current.close();
        }

        let interval:NodeJS.Timer;

        eventSource.current = new EventSource(`${apiURL}/sync/is_started`, {withCredentials: true});

        eventSource.current.onmessage = (event) => {
            // console.log('Online...');

            setIsOnline(true);
            setNumberOfRetries(0);
        };
        eventSource.current.onerror = (error) => {
            // console.error('Sync SSE Error:', error);

            // console.log('Offline...', numberOfRetries);

            eventSource.current?.close();

            interval = setInterval(async () => {
                if (numberOfRetries >= 1) {
                    setIsOnline(false);
                }

                setNumberOfRetries((previousValue) => {
                    return previousValue + 1;
                });

                setRetryTime((RETRYTIMEINSECONDS * numberOfRetries) + RETRYTIMEINSECONDS);
            }, RETRYTIMEINSECONDS * numberOfRetries);
        };

        return () => {
            clearInterval(interval);
            eventSource.current?.close();
        };
    }, [numberOfRetries, eventSource]);

    useEffect(() => {
        const interval = setInterval(() => {
            setRetryTime(retryTime - 1000);
        }, 1000);

        return () => clearInterval(interval);
    }, [retryTime]);

    return (
        <Fragment>
            <div
                className='is-engine-online-setting'
                style={{display: isOnline ? 'none' : 'flex', color: isOnline ? 'var(--online-indicator)' : 'var(--error-text)'}}
            >
                <div className='is-engine-online-setting__icon'>
                    <i className={isOnline ? 'icon fa fa-check' : 'icon fa fa-exclamation'}/>
                </div>
                <div className='is-engine-online-setting__text'>
                    { isOnline ? 'The Engine is Online' : 'The Engine is Offline'}
                </div>
                <div className='is-engine-online-setting__retry'>
                    { !isOnline && 'Retrying in: ' + (retryTime / 1000) }
                </div>
            </div>
        </Fragment>
    );
}

export default IsEngineOnlineSetting;
