import React, { useState } from 'react'

import './resetSyncSettingStyle.css'

function RestartSyncSetting() {
    // eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;
    const [loading, setLoading] = useState(false);
    const [mattermostChecked, setMattermostChecked] = useState(false);
    const [slackChecked, setSlackChecked] = useState(false);

    const restoreState = () => {
        setMattermostChecked(false);
        setSlackChecked(false);
    };

    const handleRestartSync = async (e) => {
        e.preventDefault();

        if (!mattermostChecked && !slackChecked) {
            return;
        }

        const postObj = {
            mattermost: mattermostChecked,
            slack: slackChecked,
        };

        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(postObj),
        };

        setLoading(true);

        try {
            const api = `${apiURL}/reset`;

            const res = await fetch(api!, postOptions);

            // eslint-disable-next-line no-console
            console.log('Resetting sync', res.statusText);

            restoreState();
        } catch (err: any) {
            // eslint-disable-next-line no-console
            console.warn('Error', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ss-restart-container'>
            <input
                id='mm'
                type='checkbox'
                checked={mattermostChecked}
                onChange={(e) => setMattermostChecked(e.target.checked)}
            />
            <label htmlFor='mm'>{'Mattermost'}</label>
            <input
                id='sl'
                type='checkbox'
                checked={slackChecked}
                onChange={(e) => setSlackChecked(e.target.checked)}
            />
            <label htmlFor='sl'>{'Slack'}</label>
            <button
                type='button'
                className='btn btn-primary'
                disabled={loading || (!mattermostChecked && !slackChecked)}
                onClick={handleRestartSync}
            >
                <i className='fa fa-refresh'/>
                {'Reset'}
            </button>
        </div>
    );
}

export default RestartSyncSetting;