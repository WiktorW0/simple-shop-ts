import React, { ReactElement, memo } from 'react'
import { ProductType } from '../context/ProductProvider'
import { ReducerActionType } from '../context/CartProvider'
import { ReducerAction } from '../context/CartProvider'


type PropsType = {
  product: ProductType,
  dispatch: React.Dispatch<ReducerAction>,
  REDUCER_ACTION: ReducerActionType,
  inCart: boolean,
}

const Product = ({ product, dispatch, REDUCER_ACTION, inCart }: PropsType): ReactElement => {

  const img: string = new URL(`../images/${product.sku}.jpg`, import.meta.url).href
  console.log(img);

  const onAddToCart = () => {
    dispatch({ type: REDUCER_ACTION.ADD, payload: { ...product, qty: 1 } })
  }

  const itemInCart = inCart ? ' ➡ Item in Cart: ✔' : null

  const content = (
    <article className="product">
      <h3>
        {product.name}
      </h3>
      <img src={img} alt={product.name} className="product__img" />
      <p>
        {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(product.price)}{itemInCart}
      </p>
      <button onClick={onAddToCart} >Add to Cart</button>
    </article>
  )
  return content
}

function areProductsEqual({ product: prevProduct, inCart: prevInCart }: PropsType, { product: nextProduct, inCart: nextInCart }: PropsType) {
  return (
    Object.keys(prevProduct).every(key => {
      return prevProduct[key as keyof ProductType] === nextProduct[key as keyof ProductType]
    }) && prevInCart === nextInCart
  )
}

const MemoizedProduct = memo<typeof Product>(Product, areProductsEqual)


export default MemoizedProduct