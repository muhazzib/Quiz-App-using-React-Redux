import { database } from '../../fire'

export let loginfunc = (obj) => {


    let credentials = {
        type: 'login',
        email: obj.name,
    }

    return (
        credentials
    )

}


export let SendingUserData = (obj) => {
    let credentials = {
        type: 'SettingUserData',
        email: obj.email,
        name: obj.name,
        useruid: obj.useruid
    }

    return (
        credentials
    )
}






export let errorReducerFunc = (error) => {
    return (
        {
            type: 'error',
            errormessage: error.error,
            errorflag: true
        }
    )
}


export let errorReducerCloseFunc = () => {
    return (
        {
            type: 'errorFalse',
            errorflag: false
        }
    )
}


export let LogoutAction = () => {
    return (
        {
            type: 'Logout'
        }
    )
}


export let QuizesAction = (obj) => {
    return (dispatch) => {
        dispatch(QuizesAction2(obj))
    }
}

export let QuizesAction2 = (obj) => {
    return ({
        type: 'Quizes',
        Quizes: obj
    })
}

export let  AttemptQuizAction = (QuizInitialDetails,Questions) => {
    return (dispatch) => {
        dispatch(FinalAttemptQuizAction(QuizInitialDetails,Questions))
    }
}

export let  FinalAttemptQuizAction=(QuizInitialDetails,Questions)=>{
    return ({
        type: 'AttemptQuiz',
        QuizInitialDetails: QuizInitialDetails,
        Questions:Questions
    })
}





