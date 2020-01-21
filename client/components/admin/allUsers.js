import React from 'react'
import {connect} from 'react-redux'
import {fetchCart} from '../../store/cart'

class AllUsers extends React.Component {
  componentDidMount() {
    this.props.fetchCart()
  }

  render() {
    console.log("You're at all users")
    return <div>Admin View All Users Page</div>
  }
}

const mapStateToProps = state => ({
  user: state.user,
  cart: state.cart
})

const mapDispatchToProps = dispatch => ({
  fetchCart: () => dispatch(fetchCart())
})

export default connect(mapStateToProps, mapDispatchToProps)(AllUsers)
