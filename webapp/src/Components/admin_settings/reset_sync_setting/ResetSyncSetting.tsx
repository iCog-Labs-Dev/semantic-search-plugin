import React, { Fragment, useEffect, useState } from 'react'

import './resetSyncSettingStyle.css'

function ResetSyncSetting(props: { helpText: { props: { text: string } } }) {
    // eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [mattermostChecked, setMattermostChecked] = useState(false);
    const [slackChecked, setSlackChecked] = useState(false);

    const restoreState = () => {
        setMattermostChecked(false);
        setSlackChecked(false);
    };

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

    const handleResetSync = async (e) => {
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

        let response;

        try {
            const api = `${apiURL}/reset`;

            response = await fetch(api!, postOptions);
        } catch (err: any) {
            // eslint-disable-next-line no-console
            console.warn('Error', err);
        } finally {
            setLoading(false);
        }

        if (response?.ok) {
            restoreState();
        } else {
            const jsonErr = await response?.json();

            setHasError(true);
            setErrorMessage(jsonErr.message);
        }
    };

    return (
        <Fragment>
            <div className='ss-reset-container'>
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
                    onClick={handleResetSync}
                >
                    <i className='fa fa-refresh'/>
                    {'Reset'}
                </button>
            </div>
            <p
                className='ss-reset-help-error-message'
                style={{display: hasError ? 'block' : 'none'}}
            >
                {errorMessage}
            </p>
            <p className='ss-reset-help-text'>
                {props.helpText.props.text}
            </p>
        </Fragment>
    );
}

export default ResetSyncSetting;