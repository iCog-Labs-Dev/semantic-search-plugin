import React from 'react';
import './Me.css';
function Me({msg}: any) {
    return (
        <div className='Me-con'>
            <div className='Me-text'>
                {msg.text}
            </div>
            <span className={`Me-error ${msg.error ? '' : 'Me-error-hide'}`}> { msg.errorText } </span>
        </div>
    );
}

export default Me;