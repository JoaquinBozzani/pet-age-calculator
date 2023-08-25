import React from 'react';


const Calculator = ({ togglePet, forwardedRef ,calculatePetAge, result }) => {
  

  return (
    <div className='calculator-container'>
      <h1>{togglePet ? 'Cat' : 'Dog'} age calculator</h1>

      <div className='calculator'>

        <p>How old is your {togglePet ? 'cat' : 'dog'}?</p>
        <input className='calculator-input' type='number' min={1} placeholder='...' onKeyDown={() => calculatePetAge(forwardedRef.current.value)} ref={forwardedRef}/>

        <button className="calculator-button" onClick={() => calculatePetAge(forwardedRef.current.value)}> Calculate </button>

        <p className='result'>Your {togglePet ? 'cat' : 'dog'} is <strong>{result}</strong> years old in human years.</p>
      </div>

    </div>
  )
}

export default Calculator