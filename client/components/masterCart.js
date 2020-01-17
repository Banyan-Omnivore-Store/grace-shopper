import React from 'react'
import {connect} from 'react-redux'
import {fetchCart} from '../store/cart'
import Cart from './cart'
import GuestCart from './guestCart'

class MasterCart extends React.Component {
  componentDidMount() {}

  render() {
    if (this.props.user.id) {
      return <Cart />
    } else {
      return <GuestCart />
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  cart: state.cart
})

const mapDispatchToProps = dispatch => ({
  fetchCart: () => dispatch(fetchCart())
})

export default connect(mapStateToProps, mapDispatchToProps)(MasterCart)
