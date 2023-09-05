import React from 'react';

import './Error.css';

function Error({error} : any) {
    return (
        <div className='ss-error-container'>
            <p> { error.text } </p>
        </div>
    );
}

export default Error;