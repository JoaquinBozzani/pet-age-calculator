import React, { useRef, useState } from 'react'


const Calculator = ({ togglePet }) => {
  const [result, setResult] = useState(0);
  const inputRef = useRef(null);
  

  const calculatePetAge = (age) => {
    age = inputRef.current.value;
    
    togglePet ? catAgeCalculator(age) : dogAgeCalculator(age);
  };
  

  const dogAgeCalculator = (dogAge) => {
    // 15 human years equals the first year of a dog's life.
    // Year two for a dog equals about nine years for a human.
    // And after that, each human year would be approximately five years for a dog.
    if(dogAge == 0) {
      setResult(0);
    }else if(dogAge == 1) {
      setResult(15);
    }else if(dogAge == 2) {
      setResult(24);
    } else {
      setResult( ((dogAge - 2) * 5) + 24 ); 
    }
  }


  const catAgeCalculator = (catAge) => {
    // 15 cat years in the first calendar year
    // nine in the second before leveling out to a rate of four cat years per calendar year for the rest of their life
    if(catAge == 0) {
      setResult(0)
    }else if(catAge == 1) {
      setResult(15);
    }else if(catAge == 2) {
      setResult(24);
    } else {
      setResult( ((catAge - 2) * 4) + 24 ); 
    }
  }

  const resetInput = () => {
    
  }


  return (
    <div className='calculator-container'>
      <h1>{togglePet ? 'Cat' : 'Dog'} age calculator</h1>

      <div className='calculator'>
        <p>How old is your {togglePet ? 'cat' : 'dog'}?</p>

        <input type="number" min={0} placeholder='...' ref={inputRef} />
        <button onClick={calculatePetAge}>Calculate</button>
        <p className='result'>Your {togglePet ? 'cat' : 'dog'} is {result} years old in human years</p>
      
      </div>



    </div>
  )
}

export default Calculator