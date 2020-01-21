import React from 'react'
import {connect} from 'react-redux'
import {fetchCart} from '../../store/cart'

class EditProduct extends React.Component {
  componentDidMount() {
    this.props.fetchCart()
  }

  render() {
    console.log("You're at edit Product")
    return <div>Edit Product Page</div>
  }
}

const mapStateToProps = state => ({
  user: state.user,
  cart: state.cart
})

const mapDispatchToProps = dispatch => ({
  fetchCart: () => dispatch(fetchCart())
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProduct)
