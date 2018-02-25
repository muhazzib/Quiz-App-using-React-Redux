import React, { Component } from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { firebaseSignOut, fire, database } from '../fire'
import { SendingUserData, errorReducerFunc, errorReducerCloseFunc, LogoutAction, QuizesAction, AttemptQuizAction } from '../store/actions/action'
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, FormText, Modal, CardText, CardBody, CardSubtitle } from 'reactstrap';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { Container, Row, Col, Alert, CardTitle } from 'reactstrap';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#007bff'
    }
};
let mapStateToProps = (state) => {
    return (
        {
            reduxstate: state.AuthReducer.name,
            myUid: state.AuthReducer.useruid,
            errormessage: state.AuthReducer.errormessage,
            errorflag: state.AuthReducer.errorflag,
            QuizesArray: state.AuthReducer.QuizesArray,
            InitialDetails: state.AuthReducer.InitialDetails,
            Questions: state.AuthReducer.Questions
        }
    )
}
let mapStatetodispatch = (dispatch) => {
    return {

        errorFunc: (error) => {
            dispatch(errorReducerFunc(error))
        },
        errorCloseFunc: (errorboolean) => {
            dispatch(errorReducerCloseFunc(errorboolean))
        },

        Logoutfunc: () => {

            dispatch(LogoutAction())
        },
        Quizes: (obj) => {
            dispatch(QuizesAction(obj))
        },
        AttemptQuiz: (obj) => {
            dispatch(AttemptQuizAction(obj))
        },


    }
}
class AttemptQuiz extends Component {
    constructor(props) {

        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            questionNo: 0,
            UserAnswer: '',
            modalIsOpen: false,
            usersAttemptArray: [],
            ErrorSmall: '',
            check1: undefined,
            check2: undefined,
            check3: undefined,
            check4: undefined,
            QuestionArrayLength: '',
            Result: undefined
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    componentWillMount() {
        (!this.props.reduxstate) ?
            browserHistory.replace('/home') :
            this.setState({
                QuestionArrayLength: this.props.Questions.length
            })
    }
    Logoutfunc = () => {
        this.props.Logoutfunc()
        firebaseSignOut.signOut()
        window.location.href = '/'
    }


    OptionFunc = (value, checkvalue) => {
        if (checkvalue === 1) {

            this.setState({
                UserAnswer: value,
                ErrorSmall: '',
                check1: true
            })
        }

        else if (checkvalue === 2) {

            this.setState({
                UserAnswer: value,
                ErrorSmall: '',
                check2: true
            })
        }


        else if (checkvalue === 3) {

            this.setState({
                UserAnswer: value,
                ErrorSmall: '',
                check3: true
            })
        }

        else if (checkvalue === 4) {

            this.setState({
                UserAnswer: value,
                ErrorSmall: '',
                check4: true
            })
        }
    }




    NextQuestionFunc = () => {

        let UserAnswer = this.state.UserAnswer
        let CorrectAnswer = this.props.Questions[this.state.questionNo].CorrectAnswer
        let usersAttemptArrayCopy = this.state.usersAttemptArray;
        let Question = this.props.Questions[this.state.questionNo].Question
        let QuestionsLength = this.state.QuestionArrayLength;


        if (UserAnswer) {

            if (this.state.QuestionArrayLength === 1) {
                let Day = new Date().getDate();
                let Month = new Date().getMonth();
                let Year = new Date().getFullYear();



                let marksOfEachQuestion = 100 / this.props.InitialDetails.NoOfQuestions;
                let AttemptedQuizInitialDetails = {
                    QuizName: this.props.InitialDetails.Name,
                    MarksObtained: 0,
                    NoOfQuestions: this.props.InitialDetails.NoOfQuestions,
                    NoOfCorrectAnswers: 0,
                    Date: `${Day}/${Month+1}/${Year}`
                }

                let UserAnswerObject = {
                    Question2: Question,
                    UserAnswer2: UserAnswer,
                    AnswerStatus: false,
                    CorrectAnswer2: CorrectAnswer
                }


                if (CorrectAnswer === UserAnswer) {

                    UserAnswerObject.AnswerStatus = true
                    usersAttemptArrayCopy.push(UserAnswerObject)
                    this.setState({

                        usersAttemptArray: usersAttemptArrayCopy,
                    })
                }
                else {
                    usersAttemptArrayCopy.push(UserAnswerObject)
                    this.setState({

                        usersAttemptArray: usersAttemptArrayCopy,
                    })
                }
                this.state.usersAttemptArray.map((value, index) => {
                    if (value.AnswerStatus === true) {

                        AttemptedQuizInitialDetails.MarksObtained = AttemptedQuizInitialDetails.MarksObtained + marksOfEachQuestion
                        AttemptedQuizInitialDetails.NoOfCorrectAnswers = AttemptedQuizInitialDetails.NoOfCorrectAnswers + 1
                    }

                    else {

                        null
                    }
                })
                // console.log(this.props.InitialDetails.Name)
                // console.log(this.props.myUid)

                database.child('Quizes').child(this.props.InitialDetails.Name).child('Attempters').child(this.props.myUid).child('QuizResult').set(AttemptedQuizInitialDetails)
                this.state.usersAttemptArray.map((value, index) => {
                    database.child('Quizes').child(this.props.InitialDetails.Name).child('Attempters').child(this.props.myUid).child('Answers').child(index).set(value)
                })
                this.setState({
                    Result: AttemptedQuizInitialDetails,
                    modalIsOpen: true
                })
            }
            else {

                let UserAnswerObject = {
                    Question2: Question,
                    UserAnswer2: UserAnswer,
                    AnswerStatus: false,
                    CorrectAnswer2: CorrectAnswer
                }

                if (CorrectAnswer === UserAnswer) {

                    UserAnswerObject.AnswerStatus = true
                    usersAttemptArrayCopy.push(UserAnswerObject)
                    this.setState({

                        usersAttemptArray: usersAttemptArrayCopy,
                        questionNo: this.state.questionNo + 1,
                        QuestionArrayLength: this.state.QuestionArrayLength - 1
                    })
                }
                else {
                    usersAttemptArrayCopy.push(UserAnswerObject)
                    this.setState({

                        usersAttemptArray: usersAttemptArrayCopy,
                        questionNo: this.state.questionNo + 1,
                        QuestionArrayLength: this.state.QuestionArrayLength - 1
                    })
                }
            }

        }

        else {
            this.setState({
                ErrorSmall: '* Please select any one option to proceed'
            })
        }

        this.setState({
            UserAnswer: '',
            check1: false,
            check2: false,
            check3: false,
            check4: false
        })
    }
    render() {
        return (
            <Container fluid>
                <Navbar color="faded" light expand="md">
                    <NavbarBrand href="#">{this.props.reduxstate}</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="#" onClick={() => browserHistory.replace('/home')}>Home</NavLink>
                            </NavItem>

                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Options
                                </DropdownToggle>
                                <DropdownMenu >


                                    <DropdownItem divider />
                                    <DropdownItem onClick={() => this.Logoutfunc()}>
                                        Logout
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>

                <Row>

                    <CardTitle style={{ margin: '0 auto' }}>{this.props.InitialDetails.Name}</CardTitle>
                </Row>
                <Container fluid>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        style={customStyles}
                        contentLabel="Example Modal"
                    >
                        {(this.state.Result) ?
                            (

                                // ` ${this.state.Result.MarksObtained} and ${this.state.Result.NoOfCorrectAnswers}`

                                <CardBody>
                                    <CardTitle style={{ color: (this.state.Result.MarksObtained >= this.props.InitialDetails.PassingMarks) ? ('green') : ('red') }}>{(this.state.Result.MarksObtained >= this.props.InitialDetails.PassingMarks) ? ('Congratulations you have passed..!') : ('Sorry you are failed..!')}</CardTitle>
                                    <CardText>{`Total Questions : ${this.state.Result.NoOfQuestions}`}</CardText>
                                    <CardText>{`Correct Answers : ${this.state.Result.NoOfCorrectAnswers}`}</CardText>

                                    <CardText>{`Marks Obtained : ${this.state.Result.MarksObtained}%`}</CardText>

                                    <Button color='link' onClick={() => browserHistory.replace('/home')}>Return to home</Button>
                                </CardBody>

                            ) : (
                                null
                            )
                        }

                    </Modal>
                    <Row>
                        <ListGroup style={{ width: '100%' }}>
                            {
                                (this.props.Questions[this.state.questionNo]) ?
                                    <ListGroupItem style={{ width: '100%', margin: '1% auto' }}>{this.props.Questions[this.state.questionNo].Question}
                                        <div style={{ margin: '1% 0%' }}>
                                            {(this.props.Questions[this.state.questionNo].Option1) ? (
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input type="radio" name="radio1" checked={this.state.check1} onChange={(value1) => this.OptionFunc(value1.target.value, 1)} value={this.props.Questions[this.state.questionNo].Option1} />
                                                        {this.props.Questions[this.state.questionNo].Option1}
                                                    </Label>
                                                </FormGroup>

                                            ) : (
                                                    null
                                                )}



                                            {(this.props.Questions[this.state.questionNo].Option2) ? (
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input type="radio" name="radio1" checked={this.state.check2} onChange={(value1) => this.OptionFunc(value1.target.value, 2)} value={this.props.Questions[this.state.questionNo].Option2} />
                                                        {this.props.Questions[this.state.questionNo].Option2}
                                                    </Label>
                                                </FormGroup>

                                            ) : (
                                                    null
                                                )}





                                            {(this.props.Questions[this.state.questionNo].Option3) ? (
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input type="radio" name="radio1" checked={this.state.check3} onChange={(value1) => this.OptionFunc(value1.target.value, 3)} value={this.props.Questions[this.state.questionNo].Option3} />
                                                        {this.props.Questions[this.state.questionNo].Option3}
                                                    </Label>
                                                </FormGroup>

                                            ) : (
                                                    null
                                                )}





                                            {(this.props.Questions[this.state.questionNo].Option4) ? (
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input type="radio" name="radio1" checked={this.state.check4} onChange={(value1) => this.OptionFunc(value1.target.value, 4)} value={this.props.Questions[this.state.questionNo].Option4} />
                                                        {this.props.Questions[this.state.questionNo].Option4}
                                                    </Label>
                                                </FormGroup>

                                            ) : (
                                                    null
                                                )}
                                            <small style={{ color: 'red' }}>{this.state.ErrorSmall}</small>
                                            <Button color='primary' style={{ margin: '1% 0%', display: 'block' }} onClick={() => this.NextQuestionFunc()}>{(this.state.QuestionArrayLength === 1) ? ('Check Result') : ('Next')}</Button>
                                        </div>
                                    </ListGroupItem>
                                    :
                                    null
                            }


                        </ListGroup>
                    </Row>
                </Container>
            </Container>)
    }
}
export default connect(mapStateToProps, mapStatetodispatch)(AttemptQuiz)
