import React from 'react'

import './homeStyle.css'

function Home() {

    const testFunc = () => {
        const fetchOptions: RequestInit = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': true,
                'Access-Control-Allow-Origin': true
            },
             
        };
        try {
            // const api = `https://827c-196-188-75-100.ngrok-free.app/root/get`;
            const api = 'https://engine.mm-llm.singularitynet.io/';
            // const api = 'http://localhost:5555/';
            fetch(api!, fetchOptions).
                then((res) => {
                    res.json().then(data => {
                        console.log(data)
                        // alert(data)
                    })
                    // res.text().then(data2 => {
                    //     alert(data2)
                    // })
                });
        } catch (err: any) {
            console.warn('Error', err);
        }
    }

    const testFunc2 = () => {
        // const url = 'https://engine.mm-llm.singularitynet.io/sync/sync_percentage';
        const url = 'https://engine.mm-llm.singularitynet.io/';
        // const url = 'http://localhost:5555/';
        console.log(url)
        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            console.log(event.data);
        };

        eventSource.onerror = (error) => {
            console.error('Error:', error);
        };

    }

    return (
        <div className='home-container'>
            <h3>Semantic Search</h3>
            <h6>Version 1.0</h6>
            {/* <button onClick={testFunc}>Test With Cred</button>
            <button onClick={testFunc2}>Test No Cred</button> */}
            {/* <a href='https://mm-backend.singularitynet.io/'>Test</a> */}
            {/* <h1>Need to find specific information in your chat history? </h1>
            <p> Just enter a topic, and our app will search through previous messages to deliver the answer you're looking for. Get ready to save time and find what you need with ease.</p> */}
        </div>
    );
}

export default Home;