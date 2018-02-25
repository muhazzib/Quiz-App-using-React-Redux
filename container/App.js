import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
// import loginfunc from './store/actions/action'
import { connect } from 'react-redux'
import { loginfunc, errorReducerFunc, errorReducerCloseFunc, LogoutAction, QuizesAction } from '../store/actions/action'
import SignUpForm from '../components/signUpForm'
import SignInForm from '../components/signInForm'

import { fire, database, firebaseSignOut } from '../fire'
import { browserHistory } from 'react-router'
import Modalcom from '../components/modal'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Container, Row, Col } from 'reactstrap';
import ReactLoading from 'react-loading';

let mapStatetoProp = (state) => {
  return (
    {
      errormessage: state.AuthReducer.errormessage.code,
      errorflag: state.AuthReducer.errorflag
    }
  )
}

let mapStatetodispatch = (dispatch) => {
  return {
    loginPropFunc: (credentials) => {
      dispatch(loginfunc(credentials))
    },
    errorFunc: (error) => {
      dispatch(errorReducerFunc(error))
    },
    errorCloseFunc: (errorboolean) => {
      dispatch(errorReducerCloseFunc(errorboolean))
    }, Logoutfunc: () => {

      dispatch(LogoutAction())
    }, Quizes: (obj) => {
      dispatch(QuizesAction(obj))
    }
  }
}
class App extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      username: '',
      modalIsOpen: true,
      formswitch: false,
      btndisplay: 'block',
      LoaderDisplay: 'none',
      FormDisplay: 'block'
    }
  }

  errorComponentFunc = (error) => {
    alert(error)
  }

  NameChangeFunc = (value) => {
    this.setState({
      email: value
    })
  }

  PasswordChangeFunc = (value) => {
    this.setState({
      password: value
    })
  }




  componentLoginfunc = () => {
    this.setState({
      LoaderDisplay: 'block',
      FormDisplay: 'none',
      btndisplay: 'none'
    })

    let credentials = {
      email: this.state.email,
      password: this.state.password
    }
    let Quizes = []

    fire.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(function (success) {
        database.child('user/' + success.uid).once("value", function (snapshot) {
          credentials.useruid = success.uid

        }).then((success) => {

          localStorage.setItem("UserData1", JSON.stringify(credentials))
        }).then((success) => {

          database.child('Quizes').on("child_added", function (snapshot1) {
            var obj = snapshot1.val()
            Quizes.push(obj);
          })
        })
          .then((success) => {

            delete credentials.password
            browserHistory.replace('/home')

          })
      })
      .catch((error) => {
        this.setState({
          LoaderDisplay: 'none',
          FormDisplay: 'block'
        })
        let errorObject = {
          errorflag: true,
          error: error
        }
        this.props.errorFunc(errorObject)

      });
    (credentials.useruid) ? (
      this.setState({
        LoaderDisplay: 'block',
        FormDisplay: 'none'
      })
    ) : (
        null
      )
    if (Quizes.length !== 0) {

      this.props.Quizes(Quizes)
    }
    else {

      (null)
    }
  }

  componentSignUpfunc = () => {

    this.setState({
      LoaderDisplay: 'block',
      FormDisplay: 'none',
      btndisplay: 'none'
    })

    let credentials = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    }


    fire.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(function (res) {
        credentials.uid = res.uid
        database.child("user/" + res.uid).push(credentials)
      })

      .then((success) => {
        this.setState({
          LoaderDisplay: 'none',
          FormDisplay: 'block'
        })
        setTimeout(() => {

          browserHistory.push('/')
          this.closeModalfunc()
          this.setState({
            formswitch: true
          })
        }, 2000)
        let errorObject = {
          errorflag: true,
          error: { code: "Your Account Has Successfully Been Created, Please Sign In to continue" }
        }
        this.props.errorFunc(errorObject)
      })
      .catch((error) => {
        this.setState({
          LoaderDisplay: 'none',
          FormDisplay: 'block',
        })
        let errorObject = {
          errorflag: true,
          error: error
        }
        this.props.errorFunc(errorObject)

      });
    (credentials.uid) ?
      this.setState({
        LoaderDisplay: 'none',
        FormDisplay: 'block',
      })
      :
      null
  }

  closeModalfunc = () => {
    this.setState({
      btndisplay: 'block'
    })
    this.props.errorCloseFunc()

  }



  UserNameChangeFunc = (value) => {
    this.setState({
      username: value
    })
  }



  componentWillMount() {
    this.props.Logoutfunc()
    firebaseSignOut.signOut()
  }

  render() {
    return (

      <div>
        <Navbar>
          <NavbarBrand href="/" className="mr-auto"> <span style={{ color: 'black' }}>Quiz App</span></NavbarBrand>

        </Navbar>
        {/* <Container>

          <Row>
            <Col sm="12" md={{ size: 4, offset: 5 }}> */}
        <div style={{ margin: '0 auto', width: '6%', position: 'relative', top: '220px', display: this.state.LoaderDisplay }}>

          <ReactLoading type={'spinningBubbles'} color={'red'} height='20px' width='40px' color='#007bff' />
        </div>
        <div style={{ display: this.state.FormDisplay }}>
          {
            (this.state.formswitch === false) ? (
              <SignUpForm FinalButtonFunc={() => this.componentSignUpfunc()} NameChangeFunc={(value1) => this.NameChangeFunc(value1.target.value)} PasswordChangeFunc={(value1) => this.PasswordChangeFunc(value1.target.value)} toggleForm={() => this.setState({ formswitch: !this.state.formswitch })} BtnStyle={{ display: this.state.btndisplay }} UserNameChangeFunc={(value1) => this.UserNameChangeFunc(value1.target.value)} />
            ) : (
                <SignInForm toggleForm={() => this.setState({ formswitch: !this.state.formswitch })} NameChangeFunc={(value1) => this.NameChangeFunc(value1.target.value)} PasswordChangeFunc={(value1) => this.PasswordChangeFunc(value1.target.value)} FinalButtonFunc={() => this.componentLoginfunc()} BtnStyle={{ display: this.state.btndisplay }} />

              )
          }
        </div>

        <Modalcom ModalBoolean={this.props.errorflag} closeModalRequest={() => this.closeModalfunc()} ModalText={this.props.errormessage} />
      </div>
    );
  }
}
export default connect(mapStatetoProp, mapStatetodispatch)(App)
