//imports
import axios from 'axios'

//action types
export const GET_CATEGORIES = 'GET_CATEGORIES'

//action creators
export const getCategories = categories => {
  return {
    type: GET_CATEGORIES,
    categories
  }
}

//thunk action creators
export const fetchCategories = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/categories/all')
    dispatch(getCategories(data))
  } catch (err) {
    console.log(err)
  }
}

//initial state

const initialState = []

//sub-reducer
const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return action.categories
    default:
      return state
  }
}

export default categoriesReducer
