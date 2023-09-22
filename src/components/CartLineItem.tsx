import { CartItemType } from "../context/CartProvider"
import { ReducerAction } from "../context/CartProvider"
import { ReducerActionType } from "../context/CartProvider"
import React from 'react'
import { ReactElement, ChangeEvent, memo } from 'react'


type PropsType = {
  item: CartItemType,
  dispatch: React.Dispatch<ReducerAction>,
  REDUCER_ACTION: ReducerActionType,
}

const CartLineItem = ({ item, dispatch, REDUCER_ACTION }: PropsType) => {
  const img: string = new URL(`../images/${item.sku}.jpg`, import.meta.url).href

  const lineTotal: number = (item.qty * item.price)
  const highestQty: number = 20 > item.qty ? 20 : item.qty

  const optionValues: number[] = [...Array(highestQty).keys()].map(i => i + 1)
  const options: ReactElement[] = optionValues.map(value => {
    return <option key={`opt${value}`} value={value}>{value}</option>
  })

  const onChangeQty = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: REDUCER_ACTION.QUANTITY,
      payload: { ...item, qty: Number(e.target.value) }
    })
  }

  const onRemoveFromCart = () => dispatch({
    type: REDUCER_ACTION.REMOVE, payload: item
  })

  const content = (
    <li className="cart__item">
      <img src={img} alt={item.name} className="cart__img" />
      <div aria-label="Item name">{item.name}</div>
      <div aria-label="Price per item">{new Intl.NumberFormat('pl-PL', { style: 'currency', currency: "PLN" }).format(item.price)}</div>
      <label htmlFor="itemQty" className="offscreen">Item Quantity</label>
      <select
        name="itemQty"
        id="itemQty"
        className="cart__select"
        value={item.qty}
        aria-label="Item quantity"
        onChange={onChangeQty}
      >
        {options}
      </select>

      <div className="cart__item-subtotal" aria-label="Line Item Subtotal">
        {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: "PLN" }).format(lineTotal)}
      </div>
      <button
        className="cart__button"
        aria-label="Remove item from cart"
        title="Remove item from cart"
        onClick={onRemoveFromCart}
      >❌</button>
    </li>
  )

  return content
}

function areItemsEqual({ item: PreviousItem }: PropsType, { item: NextItem }: PropsType) {
  return Object.keys(PreviousItem).every(key => {
    return PreviousItem[key as keyof CartItemType] === NextItem[key as keyof CartItemType]
  })
}

const MemoizedCartLineItem = memo<typeof CartLineItem>(CartLineItem, areItemsEqual)

export default MemoizedCartLineItem