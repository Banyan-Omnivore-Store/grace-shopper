import React from 'react'
import {connect} from 'react-redux'
import {auth} from '../store'
import history from '../history'
import {fetchCart} from '../store/cart'
import {Button, Grid, Form, Segment, Header, Message} from 'semantic-ui-react'

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    await this.props.fetchCart()
  }

  async handleSubmit(evt) {
    evt.preventDefault()
    const formName = evt.target.name
    const email = evt.target.email.value
    const password = evt.target.password.value
    await this.props.auth(email, password, formName)
    history.push('/home')
  }

  render() {
    const {name, displayName, error} = this.props
    return (
      <Grid textAlign="center" style={{height: '70vh'}} verticalAlign="middle">
        <Grid.Column style={{maxWidth: 450}} textAlign="center">
          <Header as="h2" textAlign="center">
            Log-in to your account
          </Header>
          <Form size="massive" onSubmit={this.handleSubmit} name={name}>
            <Segment stacked textAlign="center">
              <Form.Input
                name="email"
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
              />
              <Form.Input
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                name="password"
                type="password"
              />
              <Button fluid size="large" type="submit">
                {displayName}
              </Button>
            </Segment>
          </Form>
          {error && error.response && <div> {error.response.data} </div>}
          <Message>
            <a href="/auth/google">{displayName} with Google</a>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapState = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    fetchCart: () => dispatch(fetchCart()),
    auth: (email, password, formName) =>
      dispatch(auth(email, password, formName))
  }
}

export default connect(mapState, mapDispatch)(Login)

/**
 * PROP TYPES
 */
// AuthForm.propTypes = {
//   name: PropTypes.string.isRequired,
//   displayName: PropTypes.string.isRequired,
//   handleSubmit: PropTypes.func.isRequired,
//   error: PropTypes.object
// }

{
  /* <form onSubmit={this.handleSubmit} name={name}>
          <div>
            <label htmlFor="email">
              <small>Email</small>
            </label>
            <input name="email" type="text" />
          </div>
          <div>
            <label htmlFor="password">
              <small>Password</small>
            </label>
            <input name="password" type="password" />
          </div>
          <div>
            <Button type="submit">{displayName}</Button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>
        <a href="/auth/google">{displayName} with Google</a> */
}
