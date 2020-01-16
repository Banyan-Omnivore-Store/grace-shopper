import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchCart} from '../store/cart'

class Cart extends React.Component {
  componentDidMount() {
    this.props.fetchCart()
  }

  render() {
    let products = []
    let cartTotal = ''
    if (this.props.cart.products) {
      products = this.props.cart.products
    }
    console.log(products)
    if (products.length > 0) {
      let totalPrice =
        Math.round(
          products.reduce(
            (acc, curr) => acc + curr.price * curr.orderItems.quantity,
            0
          ) * 100
        ) / 100
      cartTotal = `Subtotal: ${totalPrice}`

      return (
        <div className="cart">
          <div className="cart-info">
            <div className="cart-info_title">Your Cart</div>
          </div>
          <div className="cart-items">
            {this.props.cart.products.map(product => (
              <div className="cart-item" key={product.id}>
                <div className="cart-item_name">{product.productName}</div>
                <div className="cart-item_quantity">
                  {product.orderItems.quantity}
                </div>
                <div className="cart-item_price">{product.price}</div>
                <img src={product.imageUrl} alt="product image" />
              </div>
            ))}
          </div>
          <div className="cart-total">{cartTotal}</div>
          <Link to="/checkout">Proceed to checkout</Link>
        </div>
      )
    } else {
      return <div className="cart-empty">Your Cart is Empty</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Cart)
