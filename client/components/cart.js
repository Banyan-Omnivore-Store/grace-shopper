import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchCart, deleteFromCart, changeQuantityInCart} from '../store/cart'
import {Header, Container, Button} from 'semantic-ui-react'
import './styling/cart.css'

let simpleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

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
    if (products.length > 0) {
      let totalPrice =
        Math.round(
          products.reduce(
            (acc, curr) => acc + curr.price * curr.orderItems.quantity,
            0
          ) * 100
        ) / 100
      cartTotal = `Subtotal: $${totalPrice}`

      return (
        <div className="cart">
          <Container>
            <br />
            <br />
            <br />
            <div className="cart-info">
              <Header size="large">Your Cart</Header>
            </div>
            <h4 className="cart-total">{cartTotal}</h4>
            <Link to="/checkout">
              <Button>Proceed to checkout</Button>
            </Link>
            <br />
            <div className="cart-items">
              {this.props.cart.products.map(product => (
                <div className="cart-item" key={product.id}>
                  <img
                    src={product.imageUrl}
                    alt="product image"
                    height="200px"
                  />
                  <div className="cart-item-info">
                    <h3 className="cart-item_name">{product.productName}</h3>
                    <div className="cart-item_inventory">
                      <h4>Inventory: {product.inventory}</h4>
                    </div>
                    <div className="cart-item_quantity">
                      <h4>Quantity: </h4>
                      {product.orderItems.quantity <= 10 ? (
                        <select
                          id={product.id}
                          onChange={async () => {
                            //wanted to pull this into a class method, but... it needs some things
                            if (
                              document.getElementById(product.id).value >
                              product.inventory
                            ) {
                              alert(
                                'not enough inventory, your cart has been updated to the max avail.'
                              )
                              document.getElementById(product.id).value =
                                product.inventory
                            }
                            await changeQuantityInCart(
                              this.props.cart.id,
                              product.id,
                              document.getElementById(product.id).value,
                              this.props.fetchCart()
                            )
                          }}
                          defaultValue={product.orderItems.quantity}
                        >
                          {simpleArray.map(item => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          defaultValue={product.orderItems.quantity}
                          id={product.id}
                          onChange={async () => {
                            //wanted to pull this into a class method, but... it needs some things
                            if (
                              document.getElementById(product.id).value >
                              product.inventory
                            ) {
                              alert(
                                'not enough inventory, your cart has been updated to the max avail.'
                              )
                              document.getElementById(product.id).value =
                                product.inventory
                            }
                            await changeQuantityInCart(
                              this.props.cart.id,
                              product.id,
                              document.getElementById(product.id).value
                            )
                            await this.props.fetchCart()
                          }}
                        />
                      )}
                      <Button
                        type="button"
                        onClick={async () => {
                          await deleteFromCart(this.props.cart.id, product.id)
                          await this.props.fetchCart()
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                    <div className="cart-item_price">
                      <h4>Cost: </h4>${product.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <br />
          </Container>
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
