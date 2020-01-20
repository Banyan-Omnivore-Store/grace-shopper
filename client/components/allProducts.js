//import react to access JSX, be able to create react functional component
import React from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {setProducts, fetchProducts} from '../store/products'
import {fetchCategories} from '../store/categories'
import {addToCart, fetchCart} from '../store/cart'

//export functional component which maps through props.products
class AllProducts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchText: '',
      displayProducts: [],
      selectedCategoryName: ''
    }
  }

  async componentDidMount() {
    await this.props.fetchProducts()
    await this.props.fetchCategories()
    this.setState({displayProducts: this.props.products})
  }

  searchChangeHandler(event) {
    this.setState({searchText: event.target.value})
  }

  renderAllProducts() {
    this.setState({searchText: ''})
  }

  render() {
    if (this.props.products.length === 0) {
      return <div>No Products</div>
    } else if (this.props.products) {
      return (
        <div className="wrapper">
          <div className="search_capabilities">
            <h4> Search by product name: </h4>
            <input
              type="text"
              onChange={event => this.searchChangeHandler(event)}
              value={this.state.searchText}
            />
            <h4>Search by category: </h4>
            <input type="checkbox" />
            <button type="submit" onClick={() => this.renderAllProducts()}>
              View All Products
            </button>
          </div>
          <div className="productList">
            {this.state.displayProducts.map(product => {
              if (
                product.productName
                  .toLowerCase()
                  .includes(this.state.searchText.toLowerCase())
              )
                return (
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
                )
            })}
          </div>
        </div>
      )
    } else {
      //in the event this is rendered before the props have been fetched and passed down
      return <div>No products meet those specifications...</div>
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  products: state.products,
  cart: state.cart,
  categories: state.categories
})

const mapDispatchToProps = dispatch => {
  return {
    setProducts: products => dispatch(setProducts(products)),
    fetchProducts: () => dispatch(fetchProducts()),
    fetchCart: () => dispatch(fetchCart()),
    fetchCategories: () => dispatch(fetchCategories())
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AllProducts)
)
