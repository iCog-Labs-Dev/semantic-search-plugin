import React from 'react'
import './Loader.css'
function Loader({ loading }) {
    if (!loading) return null
    return (
        <div class="loader"></div>
    )

}

export default Loader