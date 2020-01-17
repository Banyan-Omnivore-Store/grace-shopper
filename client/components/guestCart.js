import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchCart, deleteFromCart, changeQuantityInCart} from '../store/cart'

let simpleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

class GuestCart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      totalPrice: 0
    }
  }
  componentDidMount() {
    this.props.fetchCart()
  }

  render() {
    let products = []
    let cartTotal = ''
    if (this.props.cart.products) {
      products = this.props.cart.products
    }
    if (products.length > 0) {
      cartTotal =
        Math.round(
          products.reduce(
            (acc, curr) => acc + curr.product.price * curr.quantity,
            0
          ) * 100
        ) / 100
      console.log(cartTotal)

      return (
        <div className="cart">
          <div className="cart-info">
            <div className="cart-info_title">Your Cart</div>
          </div>
          <div className="cart-items">
            {this.props.cart.products.map(item => (
              <div className="cart-item" key={item.product.id}>
                <div className="cart-item_name">{item.product.productName}</div>
                <div className="cart-item_inventory">
                  Inventory:{item.product.inventory}
                </div>
                <div className="cart-item_quantity">
                  Quantity:
                  {item.quantity <= 10 ? (
                    <select
                      id={item.product.id}
                      onChange={async () => {
                        //wanted to pull this into a class method, but... it needs some things
                        if (
                          document.getElementById(item.product.id).value >
                          item.product.inventory
                        ) {
                          alert(
                            'not enough inventory, your cart has been updated to the max avail.'
                          )
                          document.getElementById(item.product.id).value =
                            item.product.inventory
                        }
                        await changeQuantityInCart(
                          this.props.cart.id,
                          item.product.id,
                          document.getElementById(item.product.id).value
                        )
                      }}
                      defaultValue={item.quantity}
                    >
                      {simpleArray.map(thing => (
                        <option key={thing} value={thing}>
                          {thing}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      defaultValue={item.quantity}
                      id={item.product.id}
                      onChange={async () => {
                        //wanted to pull this into a class method, but... it needs some things
                        if (
                          document.getElementById(item.product.id).value >
                          item.product.inventory
                        ) {
                          alert(
                            'not enough inventory, your cart has been updated to the max avail.'
                          )
                          document.getElementById(item.product.id).value =
                            item.product.inventory
                        }
                        await changeQuantityInCart(
                          this.props.cart.id,
                          item.product.id,
                          document.getElementById(item.product.id).value
                        )
                        console.log('this props', this.props)
                        // this.props.handlePrice()
                      }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteFromCart(this.props.cart.id, item.product.id)
                      await this.props.fetchCart()
                    }}
                  >
                    Delete
                  </button>
                </div>
                <div className="cart-item_price">{item.product.price}</div>
                <img
                  src={item.product.imageUrl}
                  alt="product image"
                  height="200px"
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(GuestCart)
