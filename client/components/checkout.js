import React from 'react'
import {connect} from 'react-redux'
import {fetchCart} from '../store/cart'
import axios from 'axios'
import CheckoutComplete from './checkoutComplete'

class Checkout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      email: '',
      completedOrder: {},
      error: '',
      isButtonDisabled: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this)
  }

  componentDidMount() {
    this.props.fetchCart()
    this.setState({
      address: this.props.user.address
    })
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  async handlePlaceOrder(event, orderId) {
    event.preventDefault()
    this.setState({
      isButtonDisabled: true
    })

    let emailValidate = /^\w+@\w+\.\w+$/
    if (!this.state.email.match(emailValidate)) {
      this.setState({
        error: 'Please enter a valid email',
        isButtonDisabled: false
      })
    } else {
      try {
        const res = await axios.put('/api/orders/purchase', {
          orderId,
          address: this.state.address,
          payment: this.state.email
        })
        this.setState({
          completedOrder: res.data
        })
      } catch (err) {
        if (err.response) {
          this.setState({
            isButtonDisabled: false,
            error: err.response.data
          })
        } else {
          this.setState({
            isButtonDisabled: false,
            error: 'Error: Network Error'
          })
        }
      }
    }
  }

  render() {
    let products = []
    let taxRate = 0.07
    let tax = 0
    let subtotal = 0
    let total = 0
    let error

    if (this.props.cart.products) {
      products = this.props.cart.products
    }

    if (this.state.completedOrder.id) {
      return (
        <CheckoutComplete
          order={this.state.completedOrder}
          fetchCart={this.props.fetchCart}
        />
      )
    } else if (products.length > 0) {
      subtotal = products.reduce(
        (acc, curr) => acc + curr.price * curr.orderItems.quantity,
        0
      )

      tax = Math.round(taxRate * subtotal * 100) / 100
      total = Math.round((tax + subtotal) * 100) / 100
      if (this.state.error) {
        error = <div>{this.state.error}</div>
      }
      return (
        <div className="checkout">
          <div className="checkout-info">
            <div className="checkout-info_title">Review Your Order</div>
          </div>
          <form
            className="checkout-form"
            onSubmit={event => this.handlePlaceOrder(event, this.props.cart.id)}
          >
            <div className="checkout-details">
              <div className="checkout-detailst_delivery">
                <label htmlFor="address">Shipping Address</label>
                <input
                  type="text"
                  name="address"
                  value={this.state.address}
                  onChange={this.handleChange}
                />
              </div>
              <div className="checkout-details_email">
                <label htmlFor="email">Confirmation Email</label>
                <input
                  type="text"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="checkout-items">
              {this.props.cart.products.map(product => (
                <div className="checkout-item" key={product.id}>
                  <div className="checkout-item_name">
                    {product.productName}
                  </div>
                  <div className="checkout-item_quantity">
                    {product.orderItems.quantity}
                  </div>
                  <div className="checkout-item_price">{product.price}</div>
                  <img src={product.imageUrl} alt="product image" />
                </div>
              ))}
            </div>
            <div className="checkout-place-order">
              <button
                type="submit"
                disabled={
                  this.state.isButtonDisabled ||
                  !this.state.email ||
                  !this.state.address
                }
              >
                Place your order
              </button>
              <div className="checkout-place-order_subtotal">
                <div className="checkout-place-order_subtotal__label">
                  Subtotal
                </div>
                <div className="checkout-place-order_subtotal__value">
                  {subtotal}
                </div>
              </div>
              <div className="checkout-place-order_tax">
                <div className="checkout-place-order_tax__label">Tax</div>
                <div className="checkout-place-order_tax__value">{tax}</div>
              </div>
              <div className="checkout-place-order_total">
                <div className="checkout-place-order_total__label">Total</div>
                <div className="checkout-place-order_total__value">{total}</div>
              </div>
            </div>
          </form>
          {error}
        </div>
      )
    } else {
      return (
        <div className="checkout-invalid-cart">Oops! No items in the cart</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)
