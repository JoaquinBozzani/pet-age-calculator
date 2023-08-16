import React, { useRef } from 'react'


const Calculator = ({ togglePet, forwardedRef ,calculatePetAge, result }) => {
  

  return (
    <div className='calculator-container'>
      <h1>{togglePet ? 'Cat' : 'Dog'} age calculator</h1>

      <div className='calculator'>
        <p>How old is your {togglePet ? 'cat' : 'dog'}?</p>

        <input type="number" min={1} placeholder='...' ref={forwardedRef} />

        <button onClick={() => calculatePetAge(forwardedRef.current.value)}>Calculate</button>

        <p className='result'>Your {togglePet ? 'cat' : 'dog'} is {result} years old in human years</p>
      </div>

    </div>
  )
}

export default Calculator