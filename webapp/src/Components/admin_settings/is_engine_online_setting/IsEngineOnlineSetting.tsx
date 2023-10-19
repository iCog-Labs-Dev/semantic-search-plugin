import React, { Fragment, useEffect, useState } from 'react'

import './isEngineOnlineSettingStyle.css'

function IsEngineOnlineSetting() {
    const RETRYTIMEINSECONDS = 10000;
    // eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;
    const [isOnline, setIsOnline] = useState<boolean>();
    const [retryTime, setRetryTime] = useState<number>(RETRYTIMEINSECONDS);

    useEffect(() => {
        const interval = setInterval(async () => {
            let response;
            try {
                response = await fetch(`${apiURL}/img`, {
                    method: 'GET',
                });
            } catch (err) {
                console.warn('err', err);
            }

            if (response?.ok) {
                setIsOnline(true);
            } else {
                setIsOnline(false);
            }
            setRetryTime(RETRYTIMEINSECONDS);
        }, RETRYTIMEINSECONDS);

        return () => clearInterval(interval);
    }, []);

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
                    <i className='icon fa fa-check'/>
                </div>
                <div className='is-engine-online-setting__text'>
                    { isOnline ? 'Engine is Online' : 'Engine is Offline'}
                </div>
                <div className='is-engine-online-setting__retry'>
                    { !isOnline && 'Retrying in: ' + (retryTime / 1000) }
                </div>
            </div>
        </Fragment>
    );
}

export default IsEngineOnlineSetting;
