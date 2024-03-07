import React, { useContext } from 'react'
import "./CSS/ShopCategory.css";
import {ShopContext} from '../Context/ShopContext'
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const {all_product} = useContext(ShopContext);
  return (
    <div className='shop-category'>
      <img src={props.banner} alt="banner"></img>
      <div className="shopcategory-products">
        {all_product.map((item, i)=>{
            if(props.category === item.category){
              return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}></Item>
            } else {
              return null;
            }
        })}
      </div>
    </div>
  )
}

export default ShopCategory