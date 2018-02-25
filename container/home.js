import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, Input, Label, FormGroup } from 'reactstrap';
import { SendingUserData, errorReducerFunc, errorReducerCloseFunc, LogoutAction, QuizesAction, AttemptQuizAction } from '../store/actions/action'
import { Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle
} from 'reactstrap';
import { firebaseSignOut, fire, database } from '../fire'
import Navbarcom from '../components/nav'
import Modalcom from '../components/modal'




import { browserHistory } from 'react-router'
import { Container, Row, Col } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';

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
        sendingUserDataToReduxState: (value) => {
            dispatch(SendingUserData(value))
        },
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
        AttemptQuiz: (QuizInitialDetails, Questions) => {
            dispatch(AttemptQuizAction(QuizInitialDetails, Questions))
        },


    }
}
class Home extends Component {
    constructor() {
        super()
        this.state = {
            userdata: '',
            errorText: '',
            display: 'none',
            modalIsOpen: false,
            BtnColor: 'white',
            QuizName: '',
            PassingMarks: '',
            NoOfQuestions: '',
            FurtherBtnDisplay: 'block',
            ErrorSmall: '',
            NoOfQuestionsToRender: undefined,
            QuestionNo: 1,
            Question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            CorrectAnswer: '',
            FieldsDisability: false,
            AllQuestions: [],
            QuizInitialDetailObject: '',






        }

    }





    closeModalfunc = () => {
        this.setState({
            btndisplay: 'block'
        })
        this.props.errorCloseFunc()

    }
    componentWillMount() {

        fire.auth().onAuthStateChanged((user) => {

            if (user) {
                // User is signed in.
                let useruid = JSON.parse(localStorage.getItem("UserData1")).useruid
                let Quizes = []

                let AllUserObject = []
                let UserData = {
                    name: "",
                    useruid: useruid,
                    email: '',
                }

                database.child('user/' + useruid).once("child_added", function (snapshot) {
                    // UserData.name=snapshot.username;
                    // UserData.email=snapshot.email;
                    var obj = snapshot.val()
                    UserData.name = obj.username
                    UserData.email = obj.email
                    localStorage.setItem('UserData1', JSON.stringify(UserData))
                }).then((snapshot) => {
                    this.props.sendingUserDataToReduxState(UserData)

                }).then((snapshot) => {
                    database.child('Quizes').on("child_added", function (snapshot1) {
                        var obj = snapshot1.val()
                        Quizes.push(obj);
                    })
                    setTimeout(() => {

                        this.props.Quizes(Quizes)
                    }, 500)
                })

            } else {
                localStorage.removeItem('UserData1')
                window.location.href = '/'
                browserHistory.replace('/')
            }
        });
    }


    Logoutfunc = () => {
        this.props.Logoutfunc()
        firebaseSignOut.signOut()
        window.location.href = '/'
    }

    closeModalfunc = () => {
        this.props.errorCloseFunc()
    }


    createQuizModal = () => {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            BtnColor: 'white',
            ErrorSmall: '',
            QuizName: '',
            PassingMarks: '',
            NoOfQuestions: '',
            FurtherBtnDisplay: 'block',
            NoOfQuestionsToRender: '',
            FieldsDisability: false,
            QuestionNo: 1,
            Question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            AllQuestions: [],
            NextQuestionText: 'Next Question',
            QuizInitialDetailObject: '',
            warningModal: false
        })
    }
    OverChangeBtnColorFunc = () => {
        this.setState({
            BtnColor: 'red'
        })
    }
    OutChangeBtnColorFunc = () => {
        this.setState({
            BtnColor: 'white'
        })
    }
    FurtherDetailsFunc = () => {
        this.setState({
            ErrorSmall: ''
        })
        let QuizDetails = {
            Name: this.state.QuizName,
            PassingMarks: this.state.PassingMarks,
            NoOfQuestions: this.state.NoOfQuestions
        }

        if (QuizDetails.Name && QuizDetails.PassingMarks > 0 && QuizDetails.NoOfQuestions > 2) {

            this.setState({
                NoOfQuestionsToRender: QuizDetails.NoOfQuestions,
                FurtherBtnDisplay: 'none',
                FieldsDisability: true,
                QuizInitialDetailObject: QuizDetails
            })
        }

        else {
            if (QuizDetails.NoOfQuestions < 3) {
                this.setState({
                    ErrorSmall: 'You could not create no of questions less than 3'
                })
            }
            else if (QuizDetails.PassingMarks < 0) {
                this.setState({
                    ErrorSmall: '* Please enter passing percentage greater than 0'
                })
            }
            else {
                this.setState({
                    ErrorSmall: '* Please enter complete details'
                })
            }
        }

    }

    NextQuestionFunc = () => {

        if (this.state.NoOfQuestionsToRender === 1) {
            let AllQuestionsCopy = this.state.AllQuestions;
            let QuestionCredentials = {
                Question: this.state.Question,
                CorrectAnswer: this.state.CorrectAnswer
            }
            if (this.state.option1 === '') {

                null
            } else {
                QuestionCredentials.Option1 = this.state.option1;

            }


            if (this.state.option2 === '') {

                null
            } else {
                QuestionCredentials.Option2 = this.state.option2;

            }

            if (this.state.option3 === '') {

                null
            } else {
                QuestionCredentials.Option3 = this.state.option3;

            }

            if (this.state.option4 === '') {

                null
            } else {
                QuestionCredentials.Option4 = this.state.option4;

            }
            if (QuestionCredentials.Question && QuestionCredentials.CorrectAnswer) {
                database.child('Quizes').child(this.state.QuizInitialDetailObject.Name).child('InitialDetails').set(this.state.QuizInitialDetailObject).then((success) => {

                    AllQuestionsCopy.push(QuestionCredentials)
                }).then((success) => {
                    AllQuestionsCopy.map((value, index) => {
                        // console.log(value, 'Muhazzib yd')
                        database.child('Quizes').child(this.state.QuizInitialDetailObject.Name).child('Questions').push(value)
                    })
                }).then((success) => {

                    this.setState({
                        modalIsOpen: !this.state.modalIsOpen
                    })
                }).then((success) => {

                    let errorObject = {
                        errorflag: true,
                        error: 'Your Quiz has successfully been created'
                    }
                    this.props.errorFunc(errorObject)
                })
            }
            else {

                if (!QuestionCredentials.Question)
                    this.setState({
                        ErrorSmall: '* Please enter question'
                    })
                else {
                    this.setState({
                        ErrorSmall: '* Please select the answer you provided above'
                    })
                }
            }

        }
        else {
            let AllQuestionsCopy = this.state.AllQuestions;

            let QuestionCredentials = {
                Question: this.state.Question,
                CorrectAnswer: this.state.CorrectAnswer
            }
            if (QuestionCredentials.Question && QuestionCredentials.CorrectAnswer) {
                if (this.state.option1 === '') {

                    null
                } else {
                    QuestionCredentials.Option1 = this.state.option1;

                }


                if (this.state.option2 === '') {

                    null
                } else {
                    QuestionCredentials.Option2 = this.state.option2;

                }

                if (this.state.option3 === '') {

                    null
                } else {
                    QuestionCredentials.Option3 = this.state.option3;

                }

                if (this.state.option4 === '') {

                    null
                } else {
                    QuestionCredentials.Option4 = this.state.option4;

                }
                AllQuestionsCopy.push(QuestionCredentials)


                this.setState({
                    AllQuestions: AllQuestionsCopy,
                    Question: '',
                    option1: '',
                    option2: '',
                    option3: '',
                    option4: '',
                    CorrectAnswer: '',
                    NoOfQuestionsToRender: this.state.NoOfQuestionsToRender - 1,
                    QuestionNo: this.state.QuestionNo + 1,
                    ErrorSmall: ''
                })
            }
            else {
                if (!QuestionCredentials.Question)
                    this.setState({
                        ErrorSmall: '* Please enter question'
                    })
                else {
                    this.setState({
                        ErrorSmall: '* Please select the answer you provided'
                    })
                }
            }


        }

    }

    AttemptQuizFunc = (obj) => {
        let QuizInitialDetails = obj.InitialDetails;
        let Questions = [];
        database.child('Quizes').child(QuizInitialDetails.Name).child('Questions').on("child_added", function (snapshot) {
            var obj = snapshot.val()
            Questions.push(obj);
        })
        this.props.AttemptQuiz(QuizInitialDetails, Questions)
        this.setState({
            warningModal: !this.state.warningModal
        })
    }

    render() {
        return (
            <Container fluid>

                <Navbarcom NavbarText={this.props.reduxstate} Logoutfunc={() => this.Logoutfunc()} CreateQuizFunc={() => this.createQuizModal()} />

                <Row>
                    <Form style={{ margin: '0 auto' }}>

                        {/* <Button style={{ display: 'block', margin: '2%', width: '100%' }} onClick={() => this.createQuizModal()}>Create Quiz</Button> */}

                    </Form>
                    <Modal
                        isOpen={this.state.modalIsOpen}
                        style={customStyles}
                        contentLabel="Example Modal"
                    >
                        <Container fluid>
                            <Row>
                                <Col>

                                    <button onClick={() => this.createQuizModal()} style={{ float: 'right', margin: '1% 0% 1% 0%', backgroundColor: this.state.BtnColor }} onMouseOver={() => this.OverChangeBtnColorFunc()} onMouseOut={() => this.OutChangeBtnColorFunc()}>X</button>
                                </Col>
                            </Row>
                            <Row>
                                <Form style={{ width: '100%', margin: '0% 2% 0% 2%' }}>
                                    <FormGroup>
                                        <Label for="exampleEmail">Quiz Name</Label>
                                        <Input type="text" disabled={this.state.FieldsDisability} name="email" id="exampleEmail" placeholder="Enter Quiz Name" onChange={(value1) => this.setState({ QuizName: value1.target.value })} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleEmail1">Passing Percentage</Label>
                                        <Input type="number" disabled={this.state.FieldsDisability} name="email" id="exampleEmail1" placeholder="Enter Passing Percentage" onChange={(value1) => this.setState({ PassingMarks: value1.target.value })} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleEmail2">No of Questions</Label>
                                        <Input type="number" disabled={this.state.FieldsDisability} name="email" id="exampleEmail2" placeholder="Enter No Of Questions" onChange={(value1) => this.setState({ NoOfQuestions: value1.target.value })} />
                                    </FormGroup>
                                    <small style={{ color: 'red' }}>{this.state.ErrorSmall}</small>

                                    {(this.state.NoOfQuestionsToRender !== '') ? (
                                        <div>


                                            <FormGroup>
                                                <Label for="exampleText1">{`Question ${this.state.QuestionNo}`}</Label>

                                                <Input type="textarea" name="text" id="exampleText1" onChange={(value1) => this.setState({ Question: value1.target.value })} value={this.state.Question} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="exampleText2">{`Option 1`}</Label>

                                                <Input type="text" name="text" id="exampleText2" onChange={(value1) => this.setState({ option1: value1.target.value })} value={this.state.option1} />
                                            </FormGroup>

                                            <FormGroup>
                                                <Label for="exampleText3">{`Option 2`}</Label>

                                                <Input type="text" name="text" id="exampleText3" onChange={(value1) => this.setState({ option2: value1.target.value })} value={this.state.option2} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="exampleText4">{`Option 3`}</Label>

                                                <Input type="text" name="text" id="exampleText4" onChange={(value1) => this.setState({ option3: value1.target.value })} value={this.state.option3} />
                                            </FormGroup>


                                            <FormGroup>
                                                <Label for="exampleText5">{`Option 4`}</Label>

                                                <Input type="text" name="text" id="exampleText5" onChange={(value1) => this.setState({ option4: value1.target.value })} value={this.state.option4} />
                                            </FormGroup>
                                            {
                                                (this.state.option1=='' && this.state.option2=='' && this.state.option3=='' && this.state.option4=='')?(
                                                    null
                                                ):(
                                                    <FormGroup>
                                                        <Label for="exampleSelect">CorrectAnswer</Label>

                                                        <Input type="select" name="select" id="exampleSelect"  onChange={(value1) => this.setState({ CorrectAnswer: value1.target.value })}>

                                                            <option selected={true} disabled>Choose Correct Option</option>
                                                            <option selected={this.state.option1style} value={this.state.option1}>option1</option>
                                                            <option selected={this.state.option2style} value={this.state.option2}>option2</option>
                                                            <option selected={this.state.option3style} value={this.state.option3}>option3</option>
                                                            <option selected={this.state.option4style} value={this.state.option4}>option4</option>
                                                        </Input>
                                                    </FormGroup>
                                                )

                                            
                                            }

                                            <Button color="primary" style={{ display: 'block', margin: '2%' }} onClick={() => this.NextQuestionFunc()}>{(this.state.NoOfQuestionsToRender === 1) ? ('Done') : ('Next Question')}</Button>

                                        </div>

                                    ) : (null)}
                                    <Button color="primary" style={{ display: 'block', margin: '2%', display: this.state.FurtherBtnDisplay }} onClick={() => this.FurtherDetailsFunc()}>Next</Button>
                                </Form>
                            </Row>
                        </Container>
                    </Modal>
                </Row>
                <Container fluid>
                    <Row>
                        {

                            (this.props.QuizesArray) ? (

                                this.props.QuizesArray.map((value, index) => {
                                    return (

                                        <ListGroup style={{ width: '100%', margin: '1% auto' }}>
                                            <ListGroupItem>

                                                <CardBody>
                                                    <CardTitle>{value.InitialDetails.Name}</CardTitle>
                                                    <CardSubtitle>Quiz Details</CardSubtitle>
                                                    <CardText>{`Total no of questions : ${value.InitialDetails.NoOfQuestions}`}<br />{`Passing marks : ${value.InitialDetails.PassingMarks}`}</CardText>

                                                    {

                                                        (value.Attempters) ?
                                                            <div>

                                                                {(value.Attempters[this.props.myUid]) ? (
                                                                    <div>
                                                                        <CardSubtitle style={{ color: 'red' }}>Attempted</CardSubtitle>

                                                                        <CardText>{`Marks Obtained : ${value.Attempters[this.props.myUid].QuizResult.MarksObtained} %`}<br />{`Passing Marks : ${value.InitialDetails.PassingMarks} %`}<br />{`Attempted Date : ${value.Attempters[this.props.myUid].QuizResult.Date}`}<br/>{`No of correct answers : ${ value.Attempters[this.props.myUid].QuizResult.NoOfCorrectAnswers}`}</CardText>

                                                                    </div>
                                                                ) : (
                                                                        <Button onClick={() => this.AttemptQuizFunc(value)}>Attempt</Button>

                                                                    )}
                                                            </div>

                                                            : (
                                                                <Button onClick={() => this.AttemptQuizFunc(value)} >Attempt</Button>
                                                            )
                                                    }


                                                </CardBody>
                                            </ListGroupItem>
                                        </ListGroup>
                                    )
                                })
                            ) : (
                                    console.log('null')
                                )



                        }

                    </Row>
                    <Modal
                        isOpen={this.state.warningModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                    >



                        <CardBody>
                            <p style={{ display: 'block' }}> Are you sure you want to attempt this quiz ? </p>
                            <Button style={{ display: 'inline', margin: '0% 1%', width: '25%' }} color='success' onClick={() => browserHistory.push('/home/attemptQuiz')}>Yes</Button>
                            <Button style={{ display: 'inline', width: '25%' }} color='danger' onClick={() => this.setState({ warningModal: !this.state.warningModal })}>Cancel</Button>

                        </CardBody>


                    </Modal>

                </Container>

                <Modalcom ModalBoolean={this.props.errorflag} closeModalRequest={() => this.closeModalfunc()} ModalText={this.props.errormessage} />

            </Container>
        );
    }
}

export default connect(mapStateToProps, mapStatetodispatch)(Home)