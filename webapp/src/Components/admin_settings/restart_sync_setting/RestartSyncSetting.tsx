import React from 'react'

import './restartSyncSettingStyle.css'

function RestartSyncSetting() {
    const handleRestartSync = (e) => {
        e.preventDefault();

        // eslint-disable-next-line no-console
        console.log('Restarting sync');
    };

    return (
        <div className='ss-restart-container'>
            <button
                type='button'
                className='btn btn-primary'
                onClick={handleRestartSync}
            >
                <i className='fa fa-refresh'/>
                {'Restart'}
            </button>
        </div>
    );
}

export default RestartSyncSetting;