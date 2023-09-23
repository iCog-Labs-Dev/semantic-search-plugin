import React, { useEffect, useState } from 'react'

import './toggleSyncSettingStyle.css'

function ToggleSyncSetting() {
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log(isSyncing);
    }, [isSyncing]);

    return (
        <div className='ss-setting-form'>
            <label className='switch'>
                <input
                    type='checkbox'
                    checked={isSyncing}
                    onChange={(e) => setIsSyncing(e.target.checked)}
                />
                <span className='slider round'/>
            </label>
        </div>
    );
}

export default ToggleSyncSetting;