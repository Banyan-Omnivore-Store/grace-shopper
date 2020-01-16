import axios from 'axios'

//action type
const GET_SINGLE_PRODUCT = 'GET_SINGLE_PRODUCT'
const WRITE_REVIEW = 'WRITE_REVIEW'

//action creators
export const getSingleProduct = product => {
  return {
    type: GET_SINGLE_PRODUCT,
    product
  }
}

export const writeReviewActionCreator = newReview => {
  return {
    type: WRITE_REVIEW,
    newReview
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

export const createNewReviewThunk = newReviewObject => {
  return async dispatch => {
    try {
      const {data} = await axios.post(
        `/api/products/${newReviewObject.productId}/review/${
          newReviewObject.userId
        }`,
        newReviewObject
      )
      dispatch(writeReviewActionCreator(data))
    } catch (err) {
      console.log(err)
    }
  }
}

//initial state
const initialState = {
  allProducts: [],
  singleProduct: {},
  review: {},
  allReviews: []
}

//reducer
const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SINGLE_PRODUCT:
      return {...state, singleProduct: action.product}
    case WRITE_REVIEW:
      return {
        ...state,
        review: action.newReview,
        allReviews: [...state.allReviews, action.newReview]
      }
    default:
      return state
  }
}

export default productReducer
