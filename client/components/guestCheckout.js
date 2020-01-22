import React from 'react'
import {connect} from 'react-redux'
import {fetchCart} from '../store/cart'
import axios from 'axios'
import CheckoutComplete from './checkoutComplete'
import {CardElement, injectStripe} from 'react-stripe-elements'
import {Header, Button, Item, Form} from 'semantic-ui-react'
import './styling/checkout.css'

console.log('you are in guest checkout')

const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: 'Open Sans, sans-serif',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#c23d4b'
      }
    }
  }
}

class GuestCheckout extends React.Component {
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
    this.handleCardChange = this.handleCardChange.bind(this)
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this)
  }

  async componentDidMount() {
    await this.props.fetchCart()
    this.setState({
      address: '',
      email: ''
    })
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleCardChange(event) {
    if (event.error) {
      this.setState({
        error: event.error.message
      })
    }
  }

  async handlePlaceOrder(event) {
    event.preventDefault()
    this.setState({
      isButtonDisabled: true
    })

    let emailValidate = /^[\w/.-]+@[\w/.-]+$/
    if (!this.state.email.match(emailValidate)) {
      this.setState({
        error: 'Please enter a valid email',
        isButtonDisabled: false
      })
    } else {
      try {
        //creates token for stripe payment
        const token = await this.props.stripe.createToken()
        const res = await axios.put('/api/orders/guestPurchase', {
          address: this.state.address,
          payment: this.state.email,
          token: token.token.id
        })
        this.setState({
          completedOrder: res.data
        })

        //email confirmation of order
        let firstName = this.props.user.firstName
        let email = this.state.email
        let order = this.state.completedOrder

        // let emailObj = await axios.post('/orders/responseEmail', {
        //   firstName: firstName,
        //   email: email,
        //   order: order
        // })
        //
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
        (acc, curr) => acc + curr.product.price * curr.quantity,
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
            <Header size="large">Review Your Order</Header>
          </div>
          <Form
            className="checkout-form"
            onSubmit={event => this.handlePlaceOrder(event)}
          >
            <div className="checkout-details">
              <Form.Group>
                <Form.Field widths="equal">
                  <label htmlFor="address">Shipping Address</label>
                  <input
                    type="text"
                    name="address"
                    value={this.state.address}
                    onChange={this.handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="email">Confirmation Email</label>
                  <input
                    type="text"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field>
                  <label>Payment Information</label>
                  <CardElement
                    name="card"
                    onChange={this.handleCardChange}
                    {...createOptions()}
                  />
                </Form.Field>
              </Form.Group>
              {error}
            </div>
            <div className="checkout-container">
              <Item.Group className="checkout-items">
                {this.props.cart.products.map(item => (
                  <Item className="checkout-item" key={item.product.id}>
                    <Item.Image
                      src={item.product.imageUrl}
                      alt="product image"
                    />
                    <Item.Content>
                      <Item.Header>{item.product.productName}</Item.Header>
                      <Item.Extra>Quantity: {item.quantity}</Item.Extra>
                      <Item.Extra>Price: ${item.product.price}</Item.Extra>
                    </Item.Content>
                  </Item>
                ))}
              </Item.Group>
              <div className="checkout-place-order">
                <Button
                  type="submit"
                  disabled={
                    this.state.isButtonDisabled ||
                    !this.state.email ||
                    !this.state.address
                  }
                >
                  Place your order
                </Button>
                <div className="checkout-place-order_subtotal">
                  <div className="checkout-place-order_subtotal__label">
                    Subtotal
                  </div>
                  <div className="checkout-place-order_subtotal__value">
                    ${subtotal}
                  </div>
                </div>
                <div className="checkout-place-order_tax">
                  <div className="checkout-place-order_tax__label">Tax</div>
                  <div className="checkout-place-order_tax__value">${tax}</div>
                </div>
                <div className="checkout-place-order_total">
                  <div className="checkout-place-order_total__label">Total</div>
                  <div className="checkout-place-order_total__value">
                    ${total}
                  </div>
                </div>
              </div>
            </div>
          </Form>
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

export default connect(mapStateToProps, mapDispatchToProps)(
  injectStripe(GuestCheckout)
)
