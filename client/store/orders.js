//imports
import axios from 'axios'

//action types
export const SET_ORDERS = 'SET_ORDERS'

//action creators
export const setOrders = orders => ({type: SET_ORDERS, orders})

//thunk action creators
export const fetchOrders = () => async dispatch => {
  const response = await axios.get('/api/orders')
  const orders = response.data
  dispatch(setOrders(orders))
}

//sub-reducer
function reducer(orders = [], action) {
  switch (action.type) {
    case SET_ORDERS:
      return action.orders
    default:
      return orders
  }
}

//export sub-reducer
export default reducer
