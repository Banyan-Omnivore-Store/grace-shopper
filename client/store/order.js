//imports
import axios from 'axios'

//action types
export const SET_ORDER = 'SET_ORDER'

//action creators
export const setOrder = order => ({type: SET_ORDER, order})

//thunk action creators
export const fetchOrder = orderId => async dispatch => {
  const response = await axios.get(`/api/orders/${orderId}`)
  const order = response.data
  dispatch(setOrder(order))
}

export const updateOrder = (newStatus, orderId) => async dispatch => {
  const response = await axios.put('/api/orders/admin/update', {
    newStatus,
    orderId
  })
  const order = response.data
  dispatch(setOrder(order))
}

//sub-reducer
function reducer(order = {}, action) {
  switch (action.type) {
    case SET_ORDER:
      return action.order
    default:
      return order
  }
}

//export sub-reducer
export default reducer
