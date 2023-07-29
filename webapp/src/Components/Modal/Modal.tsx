import React, { useState } from 'react';
import './Modal.css'
import Empty from './Empty/Empty';
import Me from './Me/Me';
import Bot from './Bot/Bot';

function Modal() {

    const [conversation, setConversation] = useState([
        { me: true, text: "Hi, mom i miss you so much?" },
        {
            me: false, text: `Feeling a sense of missing your mom is completely normal and natural, especially if you have a close and loving relationship with her. There are several reasons why you might be experiencing this emotion:

            Emotional Bond: The bond between a child and their mother is often deep and significant. Throughout your life, your mom might have been a source of comfort, support, and love. Missing her could be a reflection of how much you value and cherish that emotional connection.
            
            Nurturing and Care: Mothers typically play a crucial role in nurturing and taking care of their children. If you've been used to her presence, her absence might leave a void in your life.`, context: [
                {
                    'channel': 'general',
                    'date': '2023-06-19',
                    'message': "Tollan: It's best if we just post random topics here to test the semantic search.",
                    'time': '1687166901.338569',
                    'user_id': 'U05CQ93C3FZ',
                    'user_name': 'Tollan',
                    'score': 0.7899636131995263
                },
                {
                    'channel': 'gptgenerated',
                    'date': '2023-06-19',
                    'message': 'John: DistilBERT could be a good fit for our semantic search application, thanks to its lightweight nature and fast inference times.',
                    'time': '1687177724.175079',
                    'user_id': 'U01ABCDE01',
                    'user_name': 'John Smith',
                    'score': 0.7270975378083411
                },
                {
                    'channel': 'gptgenerated',
                    'date': '2023-06-19',
                    'message': 'John: ERNIE has shown promising results in understanding natural language semantics, making it a potential choice for semantic search in our application.',
                    'time': '1687177728.175079',
                    'user_id': 'U01ABCDE01',
                    'user_name': 'John Smith',
                    'score': 0.7175441478142945
                }]
        }
    ]);
    return (
        <div className={`ss-modal-con`}>
            <div className='ss-search-con'>
                <input className='ss-search-input' placeholder='Ask for anything...' />
                <button className='ss-search-button'>
                    <svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='28' height='40'
                        fill='currentColor' viewBox='0 0 20 20' aria-label='Create a post' data-darkreader-inline-fill=''><path d='M2,21L23,12L2,3V10L17,12L2,14V21Z'></path></svg>
                </button>
            </div>
            <div className='ss-content-con'>
                {conversation.length ?
                    conversation.reverse().map((c) => {
                        if (c.me) {
                            return <Me msg={c} />
                        }
                        return <Bot msg={c}/>
                    })
                    : <Empty />}
            </div>
        </div>
    )
}

export default Modal;