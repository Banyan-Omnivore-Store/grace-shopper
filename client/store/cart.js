import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_CART = 'GET_CART'
//Need to set cart as a guest user when user logs out. This is to prevent the site from rendering a guest cart while still having a user cart in its state
const REMOVE_USER = 'REMOVE_USER'
/**
 * INITIAL STATE
 */
const defaultCart = {}

/**
 * ACTION CREATORS
 */
const getCart = cart => ({type: GET_CART, cart})

/**
 * THUNK CREATORS
 */
export const fetchCart = () => async dispatch => {
  try {
    const res = await axios.get(`/api/cart`)
    dispatch(getCart(res.data || defaultCart))
  } catch (err) {
    console.error(err)
  }
}

export const addToCart = async (orderId, productId, quantity = '1') => {
  try {
    await axios.put(`/api/cart/order/${orderId}`, {
      productId,
      quantity
    })
  } catch (err) {
    console.error(err)
  }
}

export const deleteFromCart = async (orderId, productId) => {
  try {
    await axios.delete(`/api/cart/product`, {
      data: {productId: productId, orderId: orderId}
    })
  } catch (err) {
    console.error(err)
  }
}

//currently this is the same as addToCart, but may be diff once we add incrementing functionality to add to cart?
export const changeQuantityInCart = async (orderId, productId, quantity) => {
  try {
    await axios.put(`/api/cart/replace/${orderId}`, {
      productId,
      quantity
    })
  } catch (err) {
    console.error(err)
  }
}
/**
 * REDUCER
 */
export default function(state = defaultCart, action) {
  switch (action.type) {
    case GET_CART:
      return action.cart
    case REMOVE_USER:
      return {products: []}
    default:
      return state
  }
}
