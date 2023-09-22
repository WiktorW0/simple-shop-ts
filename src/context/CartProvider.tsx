import { createContext, useMemo, useReducer, ReactElement } from "react"


export type CartItemType = {
  sku: string,
  name: string,
  price: number,
  qty: number,
}

type CartStateType = { cart: CartItemType[] }

const initCartState: CartStateType = {
  cart: []
}

const REDUCER_ACTION_TYPE = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  QUANTITY: "QUANTITY",
  SUBMIT: "SUBMIT",
}

export type ReducerActionType = typeof REDUCER_ACTION_TYPE

export type ReducerAction = {
  type: string,
  payload?: CartItemType,
}

const reducer = (state: CartStateType, action: ReducerAction): CartStateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.ADD: {
      if (!action.payload) {
        throw new Error('action.payload missing in ADD action')
      }

      const { sku, name, price } = action.payload
      const filteredCart: CartItemType[] = state.cart.filter(item => item.sku != sku)
      const itemExists: CartItemType | undefined = state.cart.find(item => item.sku === sku)
      const qty: number = itemExists ? itemExists.qty + 1 : 1
      return { ...state, cart: [...filteredCart, { sku, name, price, qty }] }

    }
    case REDUCER_ACTION_TYPE.REMOVE: {
      if (!action.payload) {
        throw new Error('action.payload missing in REMOVE action')
      }
      const { sku } = action.payload
      const filteredCart: CartItemType[] = state.cart.filter(item => item.sku != sku)
      return { ...state, cart: [...filteredCart] }

    }
    case REDUCER_ACTION_TYPE.QUANTITY: {
      if (!action.payload) {
        throw new Error('action.payload missing in QUANTITY action')
      }

      const { sku, qty } = action.payload

      const itemExists: CartItemType | undefined = state.cart.find(item => item.sku === sku)
      if (!itemExists) {
        throw new Error('Item must extist in order to upadte quantity')
      }

      const updatedItem: CartItemType = { ...itemExists, qty }
      const filteredCart: CartItemType[] = state.cart.filter(item => item.sku != sku)
      return { ...state, cart: [...filteredCart, updatedItem] }
    }
    case REDUCER_ACTION_TYPE.SUBMIT: {
      return { ...state, cart: [] }
    }
    default:
      throw new Error("Unidentified reducer action type")
  }
}

const useCartContext = (initCartState: CartStateType) => {
  const [state, dispatch] = useReducer(reducer, initCartState)

  const REDUCER_ACTION = useMemo(() => {
    return REDUCER_ACTION_TYPE
  }, [])

  const totalItems = state.cart.reduce((previousValue, cartItem) => {
    return previousValue + cartItem.qty
  }, 0)

  const totalPrice = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(
    state.cart.reduce((previusValue, cartItem) => {
      return previusValue + (cartItem.qty * cartItem.price)
    }, 0)
  )

  const cart = state.cart.sort((a, b) => {
    const imtemA = Number(a.sku.slice(-4))
    const imtemB = Number(b.sku.slice(-4))
    return imtemA - imtemB
  })

  return { dispatch, REDUCER_ACTION, totalItems, totalPrice, cart }
}

export type UseCartContextType = ReturnType<typeof useCartContext>

const initCartContextState: UseCartContextType = {
  dispatch: () => { },
  REDUCER_ACTION: REDUCER_ACTION_TYPE,
  totalItems: 0,
  totalPrice: '',
  cart: []
}

export const CartContext = createContext<UseCartContextType>(initCartContextState)

type ChildrenType = { children?: ReactElement | ReactElement[] }

export const CartProvider = ({ children }: ChildrenType): ReactElement => {
  return (
    <CartContext.Provider value={useCartContext(initCartState)} >{children}</CartContext.Provider>
  )
}

export default CartContext