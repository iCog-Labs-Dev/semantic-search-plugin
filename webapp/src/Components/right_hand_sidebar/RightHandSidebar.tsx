/* eslint-disable react/jsx-closing-bracket-location */
import { GlobalState } from '@mattermost/types/lib/store'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Action, Store } from 'redux'

import Error from './error/Error'
import Home from './home/Home'
import Loader from './loader/Loader'
import Result from './result/Result'

import './rightHandSidebarStyle.css'

type PayloadType = {
    isError?: boolean;
    text: string;
    context?: string;
};

function RHS({
    store,
}: {
    store: Store<GlobalState, Action<Record<string, unknown>>>;
}) {
    // eslint-disable-next-line no-process-env
    const apiURL = process.env.MM_PLUGIN_API_URL;
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [payload, setPayload] = useState<PayloadType>();

    const handleSearchQuery = async (e) => {
        e.preventDefault();
        const inputValue = inputRef.current?.value;

        if (inputValue) {
            setSearchQuery((prev) => {
                if (prev === inputValue) {
                    return '';
                }

                return inputValue;
            });
        }
    };

    useEffect(() => {
        if (searchQuery === '') {
            // setPayload(undefined);
            return;
        }

        const currentUser = store.getState().entities.users.currentUserId;

        // eslint-disable-next-line no-console
        console.log('', currentUser);

        setLoading(true);

        fetch(`${apiURL}/search/something`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                query: searchQuery,
                user_id: currentUser,
            }),
        }).
            then((res) => res.json()).
            then((res) => {
                const responsePayload = {text: res.llm, context: res.context};
                setPayload(responsePayload);
            }).
            catch((err) => {
                setPayload({isError: true, text: err.message});

                // const errorPayload = {
                //     isError: true,
                //     text: 'Something went wrong. Please try again.',
                // };
                // setPayload(errorPayload);
            }).
            finally(() => {
                setLoading(false);
            });
    }, [searchQuery]);

    return (
        <div className='ss-root'>
            <form
                className='ss-search-wrapper'
                onSubmit={handleSearchQuery}>
                <div className='ss-search-icon'>
                    <i className='icon icon-magnify icon-18'/>
                </div>
                <input
                    ref={inputRef}
                    className='ss-search-input'
                    placeholder='Search messages'
                />
            </form>
            <div className='ss-result-wrapper'>
                {loading ? (
                    <Loader/>
                ) : (
                    <Fragment>
                        {payload ? (
                            <Fragment>
                                {payload.isError ? (
                                    <Error error={payload}/>
                                ) : (
                                    <Result item={payload}/>
                                )}
                            </Fragment>
                        ) : (
                            <Home/>
                        )}
                    </Fragment>
                )}
            </div>
        </div>
    );
}

export default RHS;
