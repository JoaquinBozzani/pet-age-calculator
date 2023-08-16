import React, { useEffect } from 'react'
import './toggleButton.css';


const Navbar = ({ togglePet, setTogglePet, forwardedRef, calculatePetAge}) => {

  // when user toggles from dog to cat, update the result of the calculator
  useEffect(() => {
    calculatePetAge(forwardedRef.current.value);
  }, [togglePet]);

  return (
      <nav className='navbar'>

          <h1>Pet Age Calculator</h1>
          
          {/* DOG / CAT SELECTOR */}
          <div className='toggle-container'>
              <label className="toggle">
                  <input type="checkbox" onClick={() => setTogglePet(!togglePet)} />
                  <span className="slider"></span>
                  <span className="labels" data-on="CAT" data-off="DOG"></span>
              </label>
          </div>

    </nav>
  )
}

export default Navbar