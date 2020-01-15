import React from 'react'
import {connect} from 'react-redux'
import {fetchCart} from '../store/cart'

const Cart = props => {
  console.log(props.cart)
  let products = []
  let cartTotal = ''
  if (props.cart.products) {
    products = props.cart.products
  }

  if (products.length > 0) {
    let totalPrice = products.reduce(
      (acc, curr) => acc + curr.price * curr.orderItems.quantity,
      0
    )
    cartTotal = `Subtotal: ${totalPrice}`
  }

  return (
    <div className="cart">
      <div className="cart-info">
        <div className="cart-info_title">Your Cart</div>
      </div>
      <div className="cart-items">
        {products.length > 0 ? (
          props.cart.products.map(product => (
            <div className="cart-item" key={product.id}>
              <div className="cart-item_name">{product.productName}</div>
              <div className="cart-item_quantity">
                {product.orderItems.quantity}
              </div>
              <div className="cart-item_price">{product.price}</div>
              <img src={product.imageUrl} alt="product image" />
            </div>
          ))
        ) : (
          <div className="cart-empty">Your Cart is Empty</div>
        )}
      </div>
      <div className="cart-total">{cartTotal}</div>
      <button onClick={props.fetchCart}>get cart(checkout)</button>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user,
  cart: state.cart
})

const mapDispatchToProps = dispatch => ({
  fetchCart: () => dispatch(fetchCart())
})

export default connect(mapStateToProps, mapDispatchToProps)(Cart)
