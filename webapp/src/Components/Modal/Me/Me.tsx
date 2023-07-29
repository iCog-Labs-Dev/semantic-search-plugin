import React from 'react'
import './Me.css'
function Me({ msg }: any) {
    return (
        <div className="Me-con">
            <div className='Me-text'>
                {msg.text}
            </div>
        </div>
    )
}

export default Me