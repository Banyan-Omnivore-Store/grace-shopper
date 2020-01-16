//import react to access JSX, be able to create react functional component
import React from 'react'
import {connect} from 'react-redux'

//export functional component which maps through props.products
class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      editing: false
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.setState({
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      email: this.props.user.email,
      address: this.props.user.address
    })
  }

  handleChange() {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  startEdit() {
    this.setState({
      editing: true
    })
  }

  cancelEdit() {
    this.setState({
      editing: false
    })
  }

  render() {
    if (!this.props.user.id) {
      return <div>No user</div>
    } else {
      return (
        <div className="user-profile">
          <div className="user-profile-header">Your Profile</div>
          <div className="user-profile-main">
            <form>
              <div className="user-profile-field">
                <label htmlFor="firstName">First Name: </label>
                <input
                  type="text"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.handleChange}
                />
              </div>
              <div className="user-profile-field">
                <label htmlFor="lastName">Last Name: </label>
                <input
                  type="text"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.handleChange}
                />
              </div>
              <div className="user-profile-field">
                <label htmlFor="email">Email: </label>
                <input
                  type="text"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </div>
              <div className="user-profile-field">
                <label htmlFor="address">Default Address: </label>
                <input
                  type="text"
                  name="address"
                  value={this.state.address}
                  onChange={this.handleChange}
                />
              </div>
              {/* {this.state.editing ?
                <button type="submit"></button>
                <button onClick={this.cancelEdit}>Cancel</button> :
                <button>g</button>
              } */}
            </form>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => {
  return {
    setOrder: orderObj => dispatch(setOrder(orderObj)),
    fetchOrder: orderId => dispatch(fetchOrder(orderId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
