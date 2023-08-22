/* eslint-disable react/style-prop-object */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable react/jsx-key */
import React from 'react';
import './Bot.css';
function Bot({msg}: any) {
    return (
        <div className='Bot-con'>
            <div className={`Bot-text ${msg.error && 'Bot-text-error'}`}>{msg.text}</div>
            {msg.context.length ? (
                <React.Fragment>
                    <h3>Context:</h3>
                    {msg.context.map((c: any) => {
                        return (
                            <div className="Bot-context-con">
                                <div className="Bot-context-top">
                                    <div className="Bot-context-user">
                                        <div className="Bot-context-left">
                                            <span>{c.user_name.slice(0, 1)}</span>
                                        </div>
                                        <div className="Bot-context-right">
                                            <div>{c.user_name}</div>
                                            <span>#{c.channel}</span>
                                        </div>
                                    </div>
                                    <div className="Bot-goto">Go to message</div>
                                </div>
                                <div className="Bot-context-middle">{c.message.split(':').slice(1).join()}</div>
                                <div className="Bot-context-bottom">
                                    <div className="Bot-context-relevance">Relevance: {Math.floor(c.score * 1000) / 10}%</div>
                                    <div className="Bot-context-date">{new Date(Number(c.time) * 1000).toUTCString()}</div>
                                </div>
                            </div>
                        )
                    })}
                </React.Fragment>
            ):''}
        </div>
    );
}

export default Bot;
