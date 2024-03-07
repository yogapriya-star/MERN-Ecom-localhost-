import React, { useContext } from 'react';
import {ShopContext} from '../../Context/ShopContext'
import "./OfflinePay.css"

const OfflinePay = () => {
  const {removeMultipleCart} = useContext(ShopContext);
  
  return (
    <div className='offline-details'>
      <div>
        <h2>Your order has been placed successfully!</h2> <br/>
        <p>No need to make an online payment up front. Pay with cash when your order arrives.</p>
        <h3>There are no additional charges associated with COD.</h3> <br/>
        <h1>Your order will be delivered within this week.</h1><br />
        <button className='offline-details-btn' onClick={()=>{removeMultipleCart()}}>Go Back</button>
      </div>
    </div>
  )
}

export default OfflinePay