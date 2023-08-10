import React from 'react'
import './toggleButton.css';

const Navbar = () => {
  return (
    <nav className='navbar'>
        <h1>Pet Age Calculator</h1>
        
        {/* DOG / CAT SELECTOR */}
        <div className='toggle-container'>
            <label className="toggle">
                <input type="checkbox"/>
                <span className="slider"></span>
                <span className="labels" data-on="CAT" data-off="DOG"></span>
            </label>
        </div>

    </nav>
  )
}

export default Navbar