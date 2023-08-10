import React, { useRef, useState } from 'react'

const Calculator = () => {
  const [result, setResult] = useState(0)
  const inputRef = useRef(null)
  

  const calculatePetAge = () => {
    let age = inputRef.current.value;
    
    // 16 ln(dog age) + 31 = human age --> equation
    age = Math.round(Math.log(age) * 16 + 31);

    setResult(age);
  } 
  
  
  
  return (
    <div className='calculator-container'>
      <h1>Dog age calculator</h1>

      <div className='calculator'>
        <p>How old is your dog?</p>

        <input type="number" placeholder='...' ref={inputRef} />
        <button onClick={calculatePetAge}>Calculate</button>
        <p className='result'>Your dog is {result} years old in human years</p>
      
      </div>



    </div>
  )
}

export default Calculator