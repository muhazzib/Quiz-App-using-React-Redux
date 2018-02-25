import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';


class SignInForm extends Component {


  render() {
    return (

      <Container>

        <Row>
          <Col sm="12" md={{ size: 4, offset: 4 }}>




            <Form>
              <h3 style={{ color: '#007bff' }}>Sign In</h3>
              <FormGroup>
                <Input type="email" placeholder="Email" onChange={this.props.NameChangeFunc} />
              </FormGroup>
              <FormGroup>
                <Input type="password" onChange={this.props.PasswordChangeFunc} placeholder="Password" />
              </FormGroup>

              <a href="#" onClick={this.props.toggleForm}>
                <small style={{ display: 'block', float: 'right' }}>

                  Dont have an Account?
</small>
              </a>
              <Button onClick={
                this.props.FinalButtonFunc
              } style={this.props.BtnStyle} color='primary'>SignIn</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default SignInForm