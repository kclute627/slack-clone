import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import App from './Components/App'
import registerServiceWorker from './registerServiceWorker';
import Login from './Auth/Login';
import Register from './Auth/Register';
import firebase from './firebase';
import 'semantic-ui-css/semantic.min.css';


import {BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';

import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import Spinner from './Spinner/Spinner';

import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { setUser } from './actions/index'





const store = createStore(rootReducer, composeWithDevTools());



class Root extends Component{

    componentDidMount() {
        console.log(this.props.isLoading)
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                
                this.props.setUser(user)            
                this.props.history.push('/');
            }
        })
    }

    render(){




        return this.props.isLoading ? <Spinner /> : (   
            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
            </Switch>     

        );
    }
}

const mapStateToProps = state => ({
    isLoading: state.user.isLoading
})
    

const RootwithAuth = withRouter(
    connect(
        mapStateToProps, 
        {setUser})
    (Root))


ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootwithAuth/>
        </Router>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
