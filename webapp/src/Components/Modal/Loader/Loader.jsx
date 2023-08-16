import React from 'react';
import './Loader.css';
function Loader({loading}) {
    if (!loading) {
        return null;
    }
    return (
        <div className='loader'>
            <div/>
            <div/>
            <div/>
        </div>
    );
}

export default Loader;
