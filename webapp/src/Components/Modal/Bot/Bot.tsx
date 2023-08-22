/* eslint-disable react/style-prop-object */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable react/jsx-key */
import React, { Fragment } from 'react';
import './Bot.css';
function Bot({ msg }: any) {
    return (
        <div className='bot-con'>
            <div className={`bot-text ${msg.error && 'bot-text-error'}`}>{msg.text}</div>
            {msg.context ? <Fragment>

                <h3 className='bot-title'>Context:</h3>
                <div className='bot-context-container'>
                    {msg.context.map((c: any) => {
                        return (
                            <div className='bot-context-con'>
                                <div className='bot-context-top'>
                                    <div className='bot-context-user'>
                                        <div className='bot-context-user-avatar'>
                                            {' '}
                                            {c.user_name.slice(0, 1)}{' '}
                                        </div>
                                        <div className='bot-context-user-text'>
                                            <p className='bot-context-user-name'>{c.user_name}</p>
                                            <span>#{c.channel}</span>
                                        </div>
                                    </div>
                                    <div className='bot-external-link'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            viewBox='0 0 64 64'
                                            width='25px'
                                            height='25px'
                                        >
                                            <path d='M 40 10 C 38.896 10 38 10.896 38 12 C 38 13.104 38.896 14 40 14 L 47.171875 14 L 30.585938 30.585938 C 29.804938 31.366938 29.804938 32.633063 30.585938 33.414062 C 30.976938 33.805063 31.488 34 32 34 C 32.512 34 33.023063 33.805062 33.414062 33.414062 L 50 16.828125 L 50 24 C 50 25.104 50.896 26 52 26 C 53.104 26 54 25.104 54 24 L 54 12 C 54 10.896 53.104 10 52 10 L 40 10 z M 18 12 C 14.691 12 12 14.691 12 18 L 12 46 C 12 49.309 14.691 52 18 52 L 46 52 C 49.309 52 52 49.309 52 46 L 52 34 C 52 32.896 51.104 32 50 32 C 48.896 32 48 32.896 48 34 L 48 46 C 48 47.103 47.103 48 46 48 L 18 48 C 16.897 48 16 47.103 16 46 L 16 18 C 16 16.897 16.897 16 18 16 L 30 16 C 31.104 16 32 15.104 32 14 C 32 12.896 31.104 12 30 12 L 18 12 z' />
                                        </svg>
                                    </div>
                                    <div className="Bot-goto">Go to message</div>
                                </div>
                                <div className='bot-context-middle'>{c.message}</div>
                                <div className='bot-context-bottom'>
                                    <div className='bot-context-relevance'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='10'
                                            height='10'
                                            viewBox='12 12 19 19'
                                        >
                                            <path
                                                d='M31.976,19.043c.233,0,.349.259.349.775a3.9,3.9,0,0,1-.774,2.438A4.029,4.029,0,0,1,29.5,23.668a4.239,4.239,0,0,1-1.35.226,4.945,4.945,0,0,1-1.75-.351,14.168,14.168,0,0,1-2.525-1.425q-.874-.524-1.225-.774a8.111,8.111,0,0,0-2.125-.851,5.733,5.733,0,0,0-.65-.024,4.033,4.033,0,0,0-2.225.625,2.543,2.543,0,0,0-1.3,2.074c-.035.484-.151.726-.351.726q-.35,0-.35-.75a5.188,5.188,0,0,1,.1-.851,4.011,4.011,0,0,1,.938-1.9,3.811,3.811,0,0,1,1.788-1.125,2.491,2.491,0,0,1,.924-.2c.034,0,.1,0,.2-.012s.182-.013.25-.013a5.406,5.406,0,0,1,2.325.6q.05.024,3.175,1.95a7.654,7.654,0,0,0,2.125.849,4.664,4.664,0,0,0,.625.026,4.034,4.034,0,0,0,2.224-.625,2.691,2.691,0,0,0,1.3-2.075Q31.625,19.043,31.976,19.043ZM16,29.743q-.35,0-.35-.75a5.169,5.169,0,0,1,.1-.849,4.013,4.013,0,0,1,.938-1.9,3.827,3.827,0,0,1,1.788-1.125,2.508,2.508,0,0,1,.924-.2c.034,0,.1,0,.2-.012s.182-.012.25-.012a5.43,5.43,0,0,1,2.325.6q.05.026,3.175,1.95a7.6,7.6,0,0,0,2.125.85,4.55,4.55,0,0,0,.625.025,4.025,4.025,0,0,0,2.224-.625,2.687,2.687,0,0,0,1.3-2.075q0-.724.351-.724t.349.8a3.313,3.313,0,0,1-.1.8,4.108,4.108,0,0,1-1.388,2.325,4,4,0,0,1-2.688.925,4.962,4.962,0,0,1-1.75-.349,14.3,14.3,0,0,1-2.525-1.425q-.874-.527-1.225-.776a8.066,8.066,0,0,0-2.125-.849,5.366,5.366,0,0,0-.65-.026,4.042,4.042,0,0,0-2.225.625,2.546,2.546,0,0,0-1.3,2.076C16.316,29.5,16.2,29.743,16,29.743Z'
                                            />
                                        </svg>
                                        <span>
                                            {Math.floor(c.score * 1000) / 10}%
                                        </span>
                                    </div>
                                    <div className='bot-context-date'>
                                        {new Date(Number(c.time) * 1000).toUTCString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Fragment> : ''}
        </div>
    );
}

export default Bot;
