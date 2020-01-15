import axios from 'axios'

//action type
const GET_SINGLE_PRODUCT = 'GET_SINGLE_PRODUCT'

//action creators
export const getSingleProduct = product => {
  return {
    type: GET_SINGLE_PRODUCT,
    product
  }
}

//thunk
export const fetchSingleProduct = productId => {
  return async dispatch => {
    try {
      const {data} = await axios.get(`/api/products/${productId}`)
      dispatch(getSingleProduct(data))
    } catch (err) {
      console.log(err)
    }
  }
}

//initial state
const initialState = {
  allProducts: [],
  singleProduct: {}
}

//reducer
const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SINGLE_PRODUCT:
      return {...state, singleProduct: action.product}
    default:
      return state
  }
}

export default productReducer
