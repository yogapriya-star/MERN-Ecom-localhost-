import React from 'react'
import "./Offer.css";
import exclusive_image from '../Assets/exclusive_image.png'
const Offer = () => {
  return (
    <div className='offers'>
        <div className="offers-left">
            <h1>Exclusive</h1>
            <h1>offers For You</h1>
            <p>ONLY ON BEST SELLERS PRODUCTS</p>
            <button>Check Now</button>
        </div>
        <div className="offers-right">
            <img src={exclusive_image} alt='exclusive_image'></img>
        </div>
    </div>
  )
}

export default Offer