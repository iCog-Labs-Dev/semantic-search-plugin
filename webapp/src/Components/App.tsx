/* eslint-disable react/jsx-closing-bracket-location */
import { GlobalState } from '@mattermost/types/lib/store'
import React, { FormEvent, Fragment, useEffect, useState } from 'react'
import { Action, Store } from 'redux'

import './App.css'
import Error from './Error/Error'
import Home from './Home/Home'
import Loader from './Loader/Loader'
import Result from './Result/Result'

type PayloadType = {
    isError?: boolean;
    text: string;
    context?: string;
}

function App({ store }: { store: Store<GlobalState, Action<Record<string, unknown>>> }) {
    // eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [payload, setPayload] = useState<PayloadType>();
    useEffect(() => {
        fetch(apiURL + '/login').then(e => e.json()).then(token => localStorage.setItem('SSToken', token)).catch(console.error)
    }, []);
    const handleSearchQuery = async (e: FormEvent) => {
        e.preventDefault();

        if (searchInput === searchQuery && searchQuery !== '') {
            return;
        }

        setSearchQuery(searchInput);

        setLoading(true);
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('SSToken') || ''
            },
            body: JSON.stringify({
                query: searchQuery,
            }),
        };

        try {
            const res = await fetch(apiURL!, fetchOptions);

            const jsonRes = await res.json();

            if (!jsonRes) {
                throw Error('');
            }

            const responsePayload = { text: jsonRes.response, context: jsonRes.metadata };
            setPayload(responsePayload);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            // eslint-disable-next-line no-console
            console.warn('Error', err);

            const errorPayload = { isError: true, text: 'Something went wrong. Please try again.' };
            setPayload(errorPayload);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ss-root'>
            <form
                className='ss-search-wrapper'
                onSubmit={handleSearchQuery}
            >
                <div className='ss-search-icon'>
                    <i className='icon icon-magnify icon-18' />
                </div>
                <input
                    className='ss-search-input'
                    placeholder='Search messages'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
            </form>
            <div className='ss-result-wrapper'>
                {loading ? <Loader /> : <Fragment>
                    {payload ? <Fragment>
                        {
                            payload.isError ? <Error
                                error={payload}
                            /> : <Result
                                item={payload}
                            />
                        }
                    </Fragment> : <Home />}
                </Fragment>
                }
            </div>
        </div>
    );
}

export default App;