//import react to access JSX, be able to create react functional component
import React from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {setProducts, fetchProducts} from '../store/products'
import {addToCart, fetchCart} from '../store/cart'

//export functional component which maps through props.products
function AllProducts(props) {
  if (props.products.length === 0) {
    return <div>No Products</div>
  } else if (props.products) {
    return (
      <div className="productList">
        {props.products.map(product => (
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
                await addToCart(props.cart.id, product.id, 1)
                await props.fetchCart()
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    )
  } else {
    //in the event this is rendered before the props have been fetched and passed down
    return <div>No products - products Loading...</div>
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
  connect(mapStateToProps, mapDispatchToProps)(AllProducts)
)
