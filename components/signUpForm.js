import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';


class SignUpForm extends Component {


    render() {
        return (
            <Container>
            
            <Row>
          <Col sm="12" md={{ size: 4, offset: 4 }}>




<div>
<Form>
<h3 style={{color:'#007bff'}}>Sign Up</h3>

<FormGroup>
          <Input type="text"  placeholder="Name" onChange={this.props.UserNameChangeFunc}/>
        </FormGroup>

        <FormGroup>
          <Input type="email"  placeholder="Email" onChange={this.props.NameChangeFunc}/>
        </FormGroup>

       
        <FormGroup>
          <Input type="password"  onChange={this.props.PasswordChangeFunc} placeholder="Password" />
        </FormGroup>
      
<a href="#" onClick={this.props.toggleForm}>
<small style={{display:'block',float:'right'}}>

           Already have an Account?
</small>
</a>
        <Button onClick={
         this.props.FinalButtonFunc
       }  style={this.props.BtnStyle} color='primary'>SignUp</Button>
      </Form>
</div>
          </Col>
        </Row>        
      </Container>
      
    );
    }
}
export default SignUpForm