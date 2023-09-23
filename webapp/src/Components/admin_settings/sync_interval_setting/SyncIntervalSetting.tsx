import React, { useEffect, useState } from 'react'

import './syncintervalSettingStyle.css'

function SyncIntervalSetting({
    store,
}: {
    store: Store<GlobalState, Action<Record<string, unknown>>>;
}) {
    const [syncInterval, setSyncInterval] = useState(0);

    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log('useEffect interval: ', syncInterval);
    }, [syncInterval]);

    const handleSyncIntervalChange = (e) => {
        e.preventDefault();

        let interval = syncInterval;

        if (e.target.value) {
            interval = parseInt(e.target.value, 10);
        }

        if (interval < 1 || interval > 1440) {
            return;
        }

        setSyncInterval(interval);
    };

    const handleSyncIntervalSubmit = (e) => {
        e.preventDefault();

        // eslint-disable-next-line no-console
        console.log('submit interval: ', syncInterval);
    };

    return (
        <div className='ss-setting-sync-interval'>
            <input
                className='ss-setting-sync-interval-input'
                type='number'
                min={1}
                max={1440}
                value={syncInterval}
                onChange={handleSyncIntervalChange}
            />
            <button
                onClick={handleSyncIntervalSubmit}
                className='btn btn-primary'
            > {'Save'} </button>
        </div>
    );
}

export default SyncIntervalSetting;