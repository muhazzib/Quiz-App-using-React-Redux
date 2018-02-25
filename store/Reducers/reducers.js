let initialstate={
    name:"",
    errormessage:'',
    errorflag:false,
    useruid:'',
    email:'',
    QuizesArray:undefined,
    InitialDetails:'',
    Questions:[]
}

export let AuthReducer=(state=initialstate,test)=>{
switch(test.type){
    case "SettingUserData" :
    return({
        ...state,name:test.name,useruid:test.useruid,email:test.email
    })
    break;
    case "Quizes" :
  return({
...state,QuizesArray:test.Quizes
  })
    break;


    case "AttemptQuiz" :
    return({
  ...state,InitialDetails:test.QuizInitialDetails,Questions:test.Questions
    })
      break;
  


    
            break;
  

    case "Logout" :
    localStorage.removeItem('UserData')
    return state
    
        break;


    case 'error':

    return(
        {
            ...state,errormessage:test.errormessage,errorflag:test.errorflag
        }
    )
    break;

    
    case 'errorFalse':
    return(
        {
            ...state,errorflag:test.errorflag
        }
    )
    default:
    return state
}

}







