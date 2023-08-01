import React, { useState, useEffect } from 'react';
import './Modal.css'
import Empty from './Empty/Empty';
import Me from './Me/Me';
import Bot from './Bot/Bot';

function Modal() {
    const [conversation, setConversation] = useState<any>([]);
    const [input,setInput] = useState('')
    const [apiURL, setApiURL] = useState('https://3c72-104-198-14-94.ngrok-free.app')

    useEffect(() => {
        const api = prompt('Search engine URL:')
        setApiURL(api!)
    },[])

    const handleSubmit = () => {
        const query = input
        const newData = [...conversation,{me:true,text:input}]
        setConversation(newData)
        setInput('')
        fetch(apiURL!, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                "query": query
            })
        }).then(e=>e.json()).then(res=>{
            if(res){
                setConversation([...newData,{me:false,text:res.response,context:res.metadata}])
            }else{
                alert("Failed to load response")
            }
        }).catch(e=>console.log(e))
    }

    return (
        <div className={`ss-modal-con`}>
            <div className='ss-search-con'>
                <input className='ss-search-input' placeholder='Ask for anything...' value={input} onChange={(e)=>setInput(e.target.value)}/>
                <button className='ss-search-button' onClick={handleSubmit}>
                    <svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='28' height='40'
                        fill='currentColor' viewBox='0 0 20 20' aria-label='Create a post' data-darkreader-inline-fill=''><path d='M2,21L23,12L2,3V10L17,12L2,14V21Z'></path></svg>
                </button>
            </div>
            <div className='ss-content-con'>
                {conversation.length ?
                    conversation.map((c:any) => {
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
