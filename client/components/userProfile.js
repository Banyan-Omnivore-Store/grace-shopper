//import react to access JSX, be able to create react functional component
import React from 'react'
import {connect} from 'react-redux'
import {me} from '../store/user'
import axios from 'axios'
import {Button, Grid, Form, Segment, Header, Message} from 'semantic-ui-react'

//export functional component which maps through props.products
class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      newPassword: '',
      confirmNewPassword: '',
      editingInfo: false,
      editingPassword: false,
      error: '',
      isSubmitDisabled: false,
      isPasswordSubmitDisabled: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.startEdit = this.startEdit.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.startPasswordEdit = this.startPasswordEdit.bind(this)
    this.cancelPasswordEdit = this.cancelPasswordEdit.bind(this)
    this.handlePasswordEdit = this.handlePasswordEdit.bind(this)
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
      editingInfo: true,
      editingPassword: false,
      newPassword: '',
      confirmNewPassword: ''
    })
  }

  cancelEdit() {
    this.setState({
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      email: this.props.user.email,
      address: this.props.user.address || '',
      editingInfo: false,
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
          editingInfo: false
        })
      } catch (err) {
        this.setState({
          error: 'Something went wrong',
          isSubmitDisabled: false
        })
      }
    }
  }

  startPasswordEdit() {
    this.setState({
      editingPassword: true,
      editingInfo: false,
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      email: this.props.user.email,
      address: this.props.user.address || '',
      error: ''
    })
  }

  cancelPasswordEdit() {
    this.setState({
      newPassword: '',
      confirmNewPassword: '',
      editingPassword: false,
      error: ''
    })
  }

  async handlePasswordEdit(event) {
    event.preventDefault()
    this.setState({
      isPasswordSubmitDisabled: true
    })
    if (this.state.newPassword !== this.state.confirmNewPassword) {
      this.setState({
        error: 'Passwords do not match',
        isPasswordSubmitDisabled: false
      })
    } else {
      try {
        await axios.put(`/api/users/${this.props.user.id}`, {
          userId: this.props.user.id,
          password: this.state.newPassword
        })
        await this.props.me()
        this.setState({
          isPasswordSubmitDisabled: false,
          newPassword: '',
          confirmNewPassword: '',
          editingPassword: false,
          error: ''
        })
      } catch (err) {
        this.setState({
          error: 'Something went wrong',
          isPasswordSubmitDisabled: false
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
          <Grid style={{margin: '20px'}}>
            <Grid.Column>
              <Header as="h2" textAlign="center">
                Your Profile
              </Header>
              <Header as="h3">Edit Your Information</Header>
              <Form onSubmit={this.handleEdit}>
                <Form.Group widths="equal">
                  <Form.Input
                    type="text"
                    label="First Name"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={this.handleChange}
                    disabled={!this.state.editingInfo}
                  />
                  <Form.Input
                    type="text"
                    label="Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                    disabled={!this.state.editingInfo}
                  />
                  <Form.Input
                    type="text"
                    label="Email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    disabled={!this.state.editingInfo}
                  />
                  <Form.Input
                    type="text"
                    label="Default Address"
                    name="address"
                    value={this.state.address}
                    onChange={this.handleChange}
                    disabled={!this.state.editingInfo}
                  />
                </Form.Group>
                {this.state.editingInfo ? (
                  <Form.Group>
                    <Button
                      type="submit"
                      disabled={this.state.isSubmitDisabled}
                    >
                      Submit Changes
                    </Button>
                    <Button onClick={this.cancelEdit}>Cancel</Button>
                  </Form.Group>
                ) : (
                  <Button onClick={this.startEdit}>Edit</Button>
                )}
              </Form>
              <Header as="h3">Change Your Password</Header>
              <Form
                className="user-password-field"
                onSubmit={this.handlePasswordEdit}
              >
                <Form.Group textAlign="center">
                  <Form.Input
                    type="password"
                    label="New Password"
                    name="newPassword"
                    value={this.state.newPassword}
                    onChange={this.handleChange}
                    disabled={!this.state.editingPassword}
                  />
                  <Form.Input
                    type="password"
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    value={this.state.confirmNewPassword}
                    onChange={this.handleChange}
                    disabled={!this.state.editingPassword}
                  />
                </Form.Group>
                {this.state.editingPassword ? (
                  <Form.Group>
                    <Button
                      type="submit"
                      disabled={this.state.isPasswordSubmitDisabled}
                    >
                      Submit Changes
                    </Button>
                    <Button onClick={this.cancelPasswordEdit}>Cancel</Button>
                  </Form.Group>
                ) : (
                  <Button onClick={this.startPasswordEdit}>Edit</Button>
                )}
              </Form>
              {error}
            </Grid.Column>
          </Grid>
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
