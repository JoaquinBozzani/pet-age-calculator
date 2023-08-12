import React, { useState } from 'react'
import Navbar from './Navbar'
import Calculator from './Calculator'


const Main = () => {
    const [togglePet, setTogglePet] = useState(false);

    return (
    <>
        <Navbar togglePet = {togglePet} setTogglePet = {setTogglePet}></Navbar>
        <Calculator togglePet = {togglePet}></Calculator>
    </>
    )
}

export default Main