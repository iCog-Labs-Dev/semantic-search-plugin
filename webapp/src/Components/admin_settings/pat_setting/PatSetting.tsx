import React, { Fragment, useEffect, useState } from 'react'

import './PatSettingStyle.css'

function PersonalAccessTokenSetting(props: { helpText: { props: { text: string } } }) {
    // eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;

    const [pat, setPat] = useState('')
    const [wasPatSuccessful, setWasPatSuccessful] = useState(false);
    const [hasPatError, setHasPatError] = useState(false);

    useEffect(() => {
        const fetchOptions: RequestInit = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        };
        try {
            const api = `${apiURL}/settings/get_pat`;
            fetch(api!, fetchOptions).then((res) => {
                const jsonRes = res.json().then((resp) => {
                    setPat(resp.personal_access_token)
                });
            })
        } catch (err: any) {
            console.warn('Error', err);
        }
    }, [])

    useEffect(() => {
        if (wasPatSuccessful) {
            setTimeout(() => {
                setWasPatSuccessful(false);
            }, 5000);
        }
        if (hasPatError) {
            setTimeout(() => {
                setHasPatError(false);
            }, 5000);
        }
    }, [setWasPatSuccessful, hasPatError]);

    const handlePatSubmit = async (e: any) => {
        e.preventDefault();

        const reqObj = {
            personal_access_token: pat,
        };

        const postOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(reqObj),
        };

        let response;

        try {
            const api = `${apiURL}/settings/set_pat`;

            response = await fetch(api!, postOptions);
        } catch (err: any) {
            console.warn('Error', err);
        }

        if (response?.ok) {
            setWasPatSuccessful(true);
        } else {
            setHasPatError(true);
        }
    };

    return (
        <Fragment>
            <div className='ss-setting-sync-interval'>
                {/* TODO: wrap the input fields in a form element */}
                <div className='ss-setting-sync-interval__item'>
                    <input
                        className='ss-setting-sync-interval-input'
                        type='password'
                        value={pat}
                        onChange={(e) => setPat(e.target.value)}
                    />
                </div>
                <p
                className='ss-sync-interval-success-message'
                style={{display: wasPatSuccessful ? 'block' : 'none'}}
                >
                    {'Personal access token set successfully!'}
                </p>
                <p
                    className='ss-sync-interval-error-message'
                    style={{display: hasPatError ? 'block' : 'none'}}
                >
                    {'Error setting personal access token!'}
                </p>
                <button
                    onClick={handlePatSubmit}
                    className='btn btn-primary'
                > {'Save'} </button>
            </div>
        </Fragment>
    );
}

export default PersonalAccessTokenSetting;