import React from 'react'
import {connect} from 'react-redux'
import {fetchProducts} from '../store/products'
import {
  withRouter,
  Route,
  /*BrowserRouter as Router, */ Link
} from 'react-router-dom'
import {productSearchResults} from './productSearchResults'

class UnconnectedSearchBar extends React.Component {
  constructor() {
    super()

    this.state = {
      searchText: '',
      filteredProducts: []
    }
  }

  componentDidMount() {
    this.props.fetchProducts()
  }

  searchChangeHandler(event) {
    this.setState({searchText: event.target.value})
  }

  searchAllProducts(event) {
    try {
      event.preventDefault()
      let searchVal = this.state.searchText
      let filteredProdArr = this.props.products.filter(product => {
        return product.productName.includes(searchVal)
      })
      this.setState({filteredProducts: filteredProdArr})
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    //making this render the all products page filtered on the basis of the search key words
    //may just make the submit button take you to a new page
    return (
      // <Router>
      <div className="wrapper">
        <Route
          exact
          path="/searchResults/:searchVal"
          component={productSearchResults}
        />
        <div className="search_capabilities">
          <input
            type="text"
            onChange={event => this.searchChangeHandler(event)}
          />
          <Link to={`/searchResults/${this.state.searchText}`}>
            <button
              type="submit"
              onClick={event => this.searchAllProducts(event)}
            >
              Submit
            </button>
          </Link>
        </div>
      </div>
      // </Router>
    )
  }
}

const mapStateToProps = state => ({
  products: state.products
})

const mapDispatchToProps = dispatch => {
  return {
    fetchProducts: () => dispatch(fetchProducts())
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UnconnectedSearchBar)
)
