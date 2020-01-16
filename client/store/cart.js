import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_CART = 'GET_CART'
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
    const res = await axios.get(`/api/orders/cart`)
    dispatch(getCart(res.data || defaultCart))
  } catch (err) {
    console.error(err)
  }
}

export const addToCart = async (orderId, productId, quantity = '1') => {
  try {
    await axios.put(`/api/orders/add/${orderId}`, {
      productId,
      quantity
    })
  } catch (err) {
    console.error(err)
  }
}

export const deleteFromCart = async (orderId, productId) => {
  try {
    await axios.delete(`/api/orders/delete/`, {
      data: {productId: productId, orderId: orderId}
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
    default:
      return state
  }
}
