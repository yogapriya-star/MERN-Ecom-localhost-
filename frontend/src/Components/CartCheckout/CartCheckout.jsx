import React, { useContext } from 'react'
import {ShopContext} from '../../Context/ShopContext'
import './CartCheckout.css'
import { useState } from "react"

const CartCheckout = () => {
    const [userDetails, setuserDetails] = useState({
        address:"",
        city:"",
        state:"",
        country:"",
        pincode:"",
        mode:"online",
    });
    const changeHandler = (e) => {
        setuserDetails({...userDetails,[e.target.name]:e.target.value});
    }
    const Add_Details = async()=>{
        let responseData;
        let userDetail = userDetails;
        await fetch('http://localhost:4000/adduserDetail',{
            method: 'POST',
            headers:{
              Accept:'application/json',
              'Content-Type':'application/json',
              'auth-token': `${localStorage.getItem('auth-token')}`,
            },
            body:JSON.stringify(userDetail),
        }).then((resp) => resp.json()).then((data)=>responseData=data)
        if(responseData.success){
            responseData.userDetail = userDetail;
            alert(responseData.message)
            if(responseData.userDetail.mode == 'online'){
                window.location.replace("/online-pay");
            } else {
                window.location.replace("/offline-pay");
            }
        } else{
          alert(responseData.errors)
        }
    }

    return (
        <div className='add-details'>
            <div className="add-details-itemfield">
                <p>Enter Address</p>
                <textarea value={userDetails.address} onChange={changeHandler}  name='address' placeholder='Type here'></textarea>
            </div>
            <div className="add-details-itemfield">
                <p>Enter City</p>
                <input value={userDetails.city} onChange={changeHandler}  type='text' name='city' placeholder='Enter City' />
            </div>
            <div className="add-details-itemfield">
                <p>Enter State</p>
                <input value={userDetails.state} onChange={changeHandler} type='text' name='state' placeholder='Enter State' />
            </div>
            <div className="add-details-itemfield">
                <p>Enter Country</p>
                <input value={userDetails.country} onChange={changeHandler}  type='text' name='country' placeholder='Enter Country' />
            </div>
            <div className="add-details-itemfield">
                <p>Enter Pincode</p>
                <input value={userDetails.pincode} onChange={changeHandler}  type='text' name='pincode' placeholder='Enter Pincode' />
            </div>
            <div className="add-details-itemfield">
                <p>Select payment Method</p>
                <select value={userDetails.mode} onChange={changeHandler}  name='mode' className='add-details-selector'>
                    <option value='online'>Online</option>
                    <option value='ofline'>Ofline</option>
                </select>
            </div>
            <button onClick={()=>{Add_Details()}} className='add-details-btn'>Add Your details</button>
        </div>
    )
}

export default CartCheckout