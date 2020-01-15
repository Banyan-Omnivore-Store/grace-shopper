//imports
import axios from 'axios'

//action types
export const SET_PRODUCTS = 'SET_PRODUCTS'

//action creators
export const setProducts = products => ({type: SET_PRODUCTS, products})

//thunk action creators
export const fetchProducts = () => async dispatch => {
  const response = await axios.get('/api/products/all')
  const products = response.data
  dispatch(setProducts(products))
}

//sub-reducer
function productsReducer(products = [], action) {
  switch (action.type) {
    case SET_PRODUCTS:
      return action.products
    default:
      return products
  }
}

//export sub-reducer
export default productsReducer
