import React, {useState, useEffect} from 'react';

import './Modal.css';
import Empty from './Empty/Empty';
import Me from './Me/Me';
import Bot from './Bot/Bot';
import Loader from './Loader/Loader';

function Modal() {
    const [conversation, setConversation] = useState<any>([]);
    const [input, setInput] = useState('');
    const [apiURL, setApiURL] = useState('https://804c-34-170-252-61.ngrok-free.app');
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     // eslint-disable-next-line no-alert
    //     const api = prompt('Search engine URL:');
    //     setApiURL(api!);
    // }, []);

    const handleSubmit = () => {
        const query = input;
        const newData = [...conversation, {me: true, text: input}];
        setConversation(newData);
        setInput('');
        setLoading(true);
        fetch(apiURL!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
            }),
        }).then((e) => e.json()).then((res) => {
            setLoading(false);
            if (res) {
                setConversation([...newData, {me: false, text: res.response, context: res.metadata}]);
            } else {
                // eslint-disable-next-line no-alert
                alert('Failed to load response');
            }
        // eslint-disable-next-line no-console
        }).catch((e) => console.log(e));
    };

    return (
        <div className={'ss-modal-con'}>

            <div className='ss-content-con'>
                {conversation.length ? conversation.map((c:any) => {
                    if (c.me) {
                        return <Me msg={c}/>;
                    }
                    return <Bot msg={c}/>;
                }) : <div className='ss-content-empty'> <Empty/> </div>}
                <Loader loading={loading}/>
            </div>
            <div className='ss-search-con'>
                <input
                    className='ss-search-input'
                    placeholder='Ask for anything...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className='ss-search-button'
                    onClick={handleSubmit}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        version='1.1'
                        width='28'
                        height='40'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        aria-label='Create a post'
                        data-darkreader-inline-fill=''
                    ><path d='M2,21L23,12L2,3V10L17,12L2,14V21Z'/></svg>
                </button>
            </div>
        </div>
    );
}

export default Modal;
