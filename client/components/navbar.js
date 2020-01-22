import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {Container, Grid, GridColumn, GridRow} from 'semantic-ui-react'
import {GiCornucopia, GiOat} from 'react-icons/gi'
import './styling/navbar.css'
import {fetchCart} from '../store/cart'

const cartHasItems = cart => {
  if (cart.products) {
    return <div>({cart.products.length})Cart</div>
  } else {
    return <div>(0)Cart</div>
  }
}

const Navbar = ({handleClick, isLoggedIn, cart}) => (
  <div>
    <nav>
      <Grid columns={2} padded>
        <GridColumn>
          <GridRow>
            {isLoggedIn ? (
              <div>
                {/* The navbar will show these links after you log in */}
                <Link to="/home" id="menuItem">
                  Home
                </Link>
                <Link to="/cart" id="menuItem">
                  {cartHasItems(cart)}
                </Link>
                <Link to="/products" id="menuItem">
                  Products
                </Link>
                <Link to="/orders" id="menuItem">
                  Orders
                </Link>
                <Link to="/profile" id="menuItem">
                  Profile
                </Link>
                <a href="#" onClick={handleClick}>
                  Logout
                </a>
              </div>
            ) : (
              <div>
                {/* The navbar will show these links before you log in */}
                <Link to="/cart" id="menuItem">
                  Cart
                </Link>
                <Link to="/products" id="menuItem">
                  Products
                </Link>
                <Link to="/login" id="menuItem">
                  Login
                </Link>
                <Link to="/signup" id="menuItem">
                  Sign Up
                </Link>
              </div>
            )}
          </GridRow>
        </GridColumn>
        <GridColumn>
          <GridRow>
            <Container textAlign="right">
              <h1>
                <GiCornucopia />
                <GiOat />mnivore Store
              </h1>
            </Container>
          </GridRow>
        </GridColumn>
      </Grid>
      <hr />
    </nav>
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    cart: state.cart
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    },
    fetchCart: () => dispatch(fetchCart())
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
