import React, { useContext } from 'react'
import {ShopContext} from '../../Context/ShopContext'

import "./OnlinePay.css"

const OnlinePay = () => {
  const {removeMultipleCart} = useContext(ShopContext);
  return (
    <div>
        <div className='online-details'>
            <div>
              <h2>Your order has been placed successfully!</h2> <br/>
              <p>Pay using online mode, All Online mode of payment is acceptable.</p>
              <h3>There are no additional charges associated with Online Payment.</h3> <br/>
              <h1>Your order will be delivered within this week.</h1><br/>
              <button className='online-details-btn' onClick={()=>{removeMultipleCart()}}>Go Back</button>
            </div>
        </div>
    </div>
  )
}

export default OnlinePay

