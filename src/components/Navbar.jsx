import React, { useState } from 'react'
import './toggleButton.css';


const Navbar = ({ handleToggleData }) => {
  const [petButton, setPetButton] = useState(false);

  // pass data to parent component (Main)
  handleToggleData(petButton);

  return (
      <nav className='navbar'>

          <h1>Pet Age Calculator</h1>
          
          {/* DOG / CAT SELECTOR */}
          <div className='toggle-container'>
              <label className="toggle">
                  <input type="checkbox" onClick={() => setPetButton(!petButton)} />
                  <span className="slider"></span>
                  <span className="labels" data-on="CAT" data-off="DOG"></span>
              </label>
          </div>

    </nav>
  )
}

export default Navbar