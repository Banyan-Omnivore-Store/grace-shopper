//import react to access JSX, be able to create react functional component
import React from 'react'
import {connect} from 'react-redux'
import {me} from '../store/user'
import axios from 'axios'

//export functional component which maps through props.products
class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      editing: false,
      error: '',
      isSubmitDisabled: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.startEdit = this.startEdit.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
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
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      email: this.props.user.email,
      address: this.props.user.address || '',
      editing: false,
      error: ''
    })
  }

  async handleEdit(event) {
    event.preventDefault()
    this.setState({
      isSubmitDisabled: true
    })
    let emailValidate = /^\w+@\w+\.\w+$/
    if (!this.state.email.match(emailValidate)) {
      this.setState({
        error: 'Please enter a valid email',
        isSubmitDisabled: false
      })
    } else {
      try {
        await axios.put(`/api/users/${this.props.user.id}`, {
          userId: this.props.user.id,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          address: this.state.address
        })
        await this.props.me()
        this.setState({
          isSubmitDisabled: false,
          firstName: this.props.user.firstName,
          lastName: this.props.user.lastName,
          email: this.props.user.email,
          address: this.props.user.address,
          editing: false
        })
      } catch (err) {
        this.setState({
          error: 'Something went wrong',
          isSubmitDisabled: false
        })
      }
    }
  }

  render() {
    if (!this.props.user.id) {
      return <div>No user</div>
    } else {
      let error
      if (this.state.error) {
        error = <div>{this.state.error}</div>
      }
      return (
        <div className="user-profile">
          <div className="user-profile-header">Your Profile</div>
          <div className="user-profile-main">
            <form onSubmit={this.handleEdit}>
              <div className="user-profile-field">
                <label htmlFor="firstName">First Name: </label>
                <input
                  type="text"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.handleChange}
                  disabled={!this.state.editing}
                />
              </div>
              <div className="user-profile-field">
                <label htmlFor="lastName">Last Name: </label>
                <input
                  type="text"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.handleChange}
                  disabled={!this.state.editing}
                />
              </div>
              <div className="user-profile-field">
                <label htmlFor="email">Email: </label>
                <input
                  type="text"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  disabled={!this.state.editing}
                />
              </div>
              <div className="user-profile-field">
                <label htmlFor="address">Default Address: </label>
                <input
                  type="text"
                  name="address"
                  value={this.state.address}
                  onChange={this.handleChange}
                  disabled={!this.state.editing}
                />
              </div>
              {this.state.editing ? (
                <div>
                  <button type="submit" disabled={this.state.isSubmitDisabled}>
                    Submit Changes
                  </button>
                  <button onClick={this.cancelEdit}>Cancel</button>
                </div>
              ) : (
                <button onClick={this.startEdit}>Edit</button>
              )}
            </form>
            {error}
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
    me: () => dispatch(me())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
