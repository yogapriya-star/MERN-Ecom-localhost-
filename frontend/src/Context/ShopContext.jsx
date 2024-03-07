import { createContext, useEffect, useState } from "react"
import React from 'react'

export const ShopContext = createContext(null);
const getDefaultCart = () => {
    let cart ={};
    for(let index=0; index<300; index++){
        cart[index] = 0;
    }
    return cart;
}
const ShopContextProvider = (props) =>{

    const [all_product, setAllProduct] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(()=>{
        fetch('http://localhost:4000/allproducts')
        .then((response)=>response.json())
        .then((data)=>setAllProduct(data))

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart',{
                method:'POST',
                headers:{
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",
            })
            .then((response)=>response.json())
            .then((data)=>setCartItems(data));
        }
    }, [])

    const addToCart = (itemId)=>{
        setCartItems((prev)=>({...prev, [itemId]:prev[itemId]+1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/addtocart',{
                method:'POST',
                headers:{
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }
    const removeFromCart = (itemId)=>{
        setCartItems((prev)=>({...prev, [itemId]:prev[itemId]-1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/removefromcart',{
                method:'POST',
                headers:{
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }


    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product && product.id === Number(item));
                if (itemInfo && itemInfo.new_price) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                } else {
                    console.error(`Product with id ${item} not found or does not have a valid price.`);
                }
            }
        }
        return totalAmount;
    }

    const removeMultipleCart = async () => {
        let itemIds = []; 
    
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product && product.id === Number(item));
                if (itemInfo) {
                    for (let i = 0; i < cartItems[item]; i++) {
                        itemIds.push(itemInfo.id);
                    }
                }
            }
        }
    
        try {
            // Remove items from the cart using itemIds array
            for (const itemId of itemIds) {
                if (itemId > 0) {
                    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
                    await fetch('http://localhost:4000/removefromcart', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/form-data',
                            'auth-token': `${localStorage.getItem('auth-token')}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ "itemId": itemId }),
                    })
                    .then((response) => response.json())
                    .then((data) => console.log(data));
                }
            }
            window.location.replace("/");
        } catch (error) {
            console.error('An error occurred during cart item removal:', error);
        }
    };

    const getTotalCartItems = () =>{
        let totalItem =0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    const contextValue = {removeMultipleCart, getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart};
    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;