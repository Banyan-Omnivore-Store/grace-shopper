import React from 'react'
import {connect} from 'react-redux'
import {fetchCart} from '../../store/cart'

class EditUser extends React.Component {
  componentDidMount() {
    this.props.fetchCart()
  }

  render() {
    console.log("You're at edit user")
    return <div>Edit User Page</div>
  }
}

const mapStateToProps = state => ({
  user: state.user,
  cart: state.cart
})

const mapDispatchToProps = dispatch => ({
  fetchCart: () => dispatch(fetchCart())
})

export default connect(mapStateToProps, mapDispatchToProps)(EditUser)
