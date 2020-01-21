import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Login,
  Signup,
  UserHome,
  MasterCheckout,
  AllProducts,
  SingleProduct,
  AllOrders,
  SingleOrder,
  UserProfile,
  productSearchResults,
  MasterCart,
  EditOrder,
  EditProduct,
  EditUser,
  AdminHome,
  AllUsers
} from './components'
import {me} from './store'
import {fetchProducts} from './store/products.js'
import {fetchCart} from './store/cart.js'

/**
 * COMPONENT
 */
class Routes extends Component {
  async componentDidMount() {
    await this.props.loadInitialData()
    await this.props.fetchProducts()
    await this.props.fetchCart()
  }

  render() {
    const {isLoggedIn, isAdmin} = this.props
    console.log('user: ', this.props.user)
    console.log('isAdmin: ', isAdmin)

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/products/:productId" component={SingleProduct} />
        <Route
          path="/products"
          render={() => <AllProducts products={this.props.products} />}
        />
        <Route path="/cart" component={MasterCart} />
        <Route path="/checkout" component={MasterCheckout} />
        {isLoggedIn &&
          !isAdmin && (
            <Switch>
              {/* Routes placed here are only available after logging in */}
              <Route path="/home" component={UserHome} />
              <Route path="/orders/:orderId" component={SingleOrder} />
              <Route path="/orders" component={AllOrders} />
              <Route path="/profile" component={UserProfile} />
            </Switch>
          )}
        {isAdmin && (
          <Switch>
            <Route path="/home" component={UserHome} />
            <Route path="/orders/:orderId" component={SingleOrder} />
            <Route path="/orders" component={AllOrders} />
            <Route path="/profile" component={UserProfile} />
            <Route path="/adminHome" component={AdminHome} />
            <Route path="/allOrders" component={AllOrders} />
            <Route path="/allUsers" component={AllUsers} />
            <Route path="/editProduct/:productId" component={EditProduct} />
            <Route path="/editOrder/:orderId" component={EditOrder} />
            <Route path="/editUser/:userId" component={EditUser} />
          </Switch>
        )}
        {/* Displays our Login component as a fallback */}
        <Route component={Login} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id,
    isAdmin: state.user.userStatus === 'admin',
    products: state.products,
    cart: state.cart,
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    },
    fetchProducts: () => dispatch(fetchProducts()),
    fetchCart: () => dispatch(fetchCart())
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired
}
