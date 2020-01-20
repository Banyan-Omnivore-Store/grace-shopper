import React from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import {addToCart, fetchCart} from '../store/cart'
import {connect} from 'react-redux'
import {setProducts, fetchProducts} from '../store/products'

class UnconnectedSearchResults extends React.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    // this.props.fetchSingleProduct(productId)
  }

  render() {
    return (
      <div className="wrapper">
        {this.state.filteredProducts.map(product => (
          <div key={product.id} className="product">
            <NavLink to={`/products/${product.id}`} activeClassName="active">
              <div>
                <h2>{product.productName}</h2>
              </div>
            </NavLink>
            <p>Description: {product.description}</p>
            <p>Price: {product.price}</p>
            <img src={product.imageUrl} height="200px" width="250px" />
            <button
              type="button"
              onClick={async () => {
                await addToCart(this.props.cart.id, product.id, 1)
                await this.props.fetchCart()
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    )
    //add button for return to all products
  }
}

const mapStateToProps = state => ({
  user: state.user,
  products: state.products,
  cart: state.cart
})

const mapDispatchToProps = dispatch => {
  return {
    setProducts: products => dispatch(setProducts(products)),
    fetchProducts: () => dispatch(fetchProducts()),
    fetchCart: () => dispatch(fetchCart())
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UnconnectedSearchResults)
)
