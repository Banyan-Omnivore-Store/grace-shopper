//import react to access JSX, be able to create react functional component
import React from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {setProducts, fetchProducts} from '../store/products'
import {addToCart, fetchCart} from '../store/cart'

//export functional component which maps through props.products
class AllProducts extends React.Component {
  constructor() {
    super()

    this.state = {
      searchText: '',
      displayProducts: []
    }
  }

  async componentDidMount() {
    await this.props.fetchProducts()
    this.setState({displayProducts: this.props.products})
  }

  searchChangeHandler(event) {
    this.setState({searchText: event.target.value})
  }

  async searchAllProducts(event) {
    try {
      event.preventDefault()
      let searchVal = this.state.searchText
      let filteredProdArr = this.props.products.filter(product => {
        return product.productName.toLowerCase().includes(searchVal)
      })
      await this.setState({displayProducts: filteredProdArr})
    } catch (err) {
      console.log(err)
    }
  }

  renderAllProducts() {
    this.setState({displayProducts: this.props.products})
  }

  render() {
    if (this.props.products.length === 0) {
      return <div>No Products</div>
    } else if (this.props.products) {
      return (
        <div className="wrapper">
          <div className="search_capabilities">
            <input
              type="text"
              onChange={event => this.searchChangeHandler(event)}
            />
            <button
              type="submit"
              onClick={event => this.searchAllProducts(event)}
            >
              Submit
            </button>
            {this.props.products.length > this.state.displayProducts.length ? (
              <button type="submit" onClick={() => this.renderAllProducts()}>
                View All Products
              </button>
            ) : (
              <div />
            )}
          </div>
          <div className="productList">
            {this.state.displayProducts.map(product => (
              <div key={product.id} className="product">
                <NavLink
                  to={`/products/${product.id}`}
                  activeClassName="active"
                >
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
        </div>
      )
    } else {
      //in the event this is rendered before the props have been fetched and passed down
      return <div>No products - products Loading...</div>
    }
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
