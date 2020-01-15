import React from 'react'
import {connect} from 'react-redux'
import {fetchCart} from '../store/cart'

class Checkout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      payment: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this)
  }

  componentDidMount() {
    this.props.fetchCart()
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handlePlaceOrder(event) {
    event.preventDefault()
  }

  render() {
    let products = []
    let taxRate = 0.07
    let tax = 0
    let subtotal = 0
    let total = 0
    if (this.props.cart.products) {
      products = this.props.cart.products
    }

    if (products.length > 0) {
      subtotal = products.reduce(
        (acc, curr) => acc + curr.price * curr.orderItems.quantity,
        0
      )

      tax = Math.round(taxRate * subtotal * 100) / 100
      total = Math.round((tax + subtotal) * 100) / 100

      return (
        <div className="checkout">
          <div className="checkout-info">
            <div className="checkout-info_title">Review Your Order</div>
          </div>
          <form className="checkout-form" onSubmit={this.handlePlaceOrder}>
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
              <div className="checkout-details_payment">
                <label htmlFor="payment">Payment Information</label>
                <input
                  type="text"
                  name="payment"
                  value={this.state.payment}
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
              <button type="submit">Place your order</button>
              <div className="checkout-place-order_subtotal">{subtotal}</div>
              <div className="checkout-place-order_tax">{tax}</div>
              <div className="checkout-place-order_total">{total}</div>
            </div>
          </form>
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
