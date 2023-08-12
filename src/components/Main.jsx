import React from 'react'
import Navbar from './Navbar'
import Calculator from './Calculator'


const Main = () => {
    let toggleData;
    const handleToggleData = (data) => {
        toggleData = data;
    }

    return (
    <>
        <Navbar handleToggleData={handleToggleData}></Navbar>
        <Calculator ></Calculator>
    </>
    )
}

export default Main