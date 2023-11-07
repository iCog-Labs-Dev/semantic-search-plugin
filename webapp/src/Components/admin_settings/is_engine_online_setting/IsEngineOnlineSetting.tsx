import React, { Fragment, useEffect, useState } from 'react'

import './isEngineOnlineSettingStyle.css'

function IsEngineOnlineSetting() {
    const RETRYTIMEINSECONDS = 60 * 1000;   
    // eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const [retryTime, setRetryTime] = useState<number>(RETRYTIMEINSECONDS);

    useEffect(() => {
        const interval = setInterval(async () => {
            let response;
            try {
                response = await fetch(`${apiURL}/root/ping`, {
                    method: 'HEAD',
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
