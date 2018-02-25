import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './container/App';
import Home from './container/home';
import AttemptQuiz from './container/AttemptQuiz';
import store from './store/index'
import {Provider} from 'react-redux'
import registerServiceWorker from './registerServiceWorker';
import {Route,Router, browserHistory, IndexRoute} from 'react-router'
import 'bootstrap/dist/css/bootstrap.css';


ReactDOM.render(
<Provider store={store}>
<Router history={browserHistory}>
<Route path='/' component={App}/>
<Route path='/home' component={Home}/>
<Route path='/home/attemptQuiz' component={AttemptQuiz}/>
</Router>
</Provider>


 
   
, document.getElementById('root'));
registerServiceWorker();
