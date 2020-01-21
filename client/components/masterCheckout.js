import React from 'react'
import {connect} from 'react-redux'
import {fetchCart} from '../store/cart'
import Checkout from './checkout'
import GuestCheckout from './guestCheckout'
import {StripeProvider, Elements} from 'react-stripe-elements'

class MasterCart extends React.Component {
  componentDidMount() {
    this.props.fetchCart()
  }

  render() {
    if (this.props.cart.userId) {
      return (
        <StripeProvider apiKey="pk_test_nXMbO0tEFvLJso12RaW4bpTD005h7qJ60z">
          <Elements>
            <Checkout />
          </Elements>
        </StripeProvider>
      )
    } else {
      return (
        <StripeProvider apiKey="pk_test_nXMbO0tEFvLJso12RaW4bpTD005h7qJ60z">
          <Elements>
            <GuestCheckout />
          </Elements>
        </StripeProvider>
      )
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
