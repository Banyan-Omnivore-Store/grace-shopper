import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchCart} from '../store/cart'
import AllProducts from './allProducts'

/**
 * COMPONENT
 */
export class UserHome extends React.Component {
  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    await this.props.fetchCart()
  }

  render() {
    const {email} = this.props

    return (
      <div>
        <div>
          <h3>Welcome, {email}</h3>
        </div>
        <AllProducts />
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

const mapDispatch = dispatch => {
  return {
    fetchCart: () => dispatch(fetchCart())
  }
}

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
