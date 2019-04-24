import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import firebase from '../firebase';
import md5 from 'md5';

import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react"


class Register extends Component {

    state = {
        username: '',
        password: '',
        email: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    };

    isFormValid = ()=>{

        let errors = [];
        let error; 

        if(this.isFormEmpty(this.state)){
            //throw Error
            error = {message: "Fill in all fields" };

            this.setState({
                errors: [...errors, error]
            })

            return false;


        } else if(!this.isPasswordValid(this.state)){
            //throw Error
            error = {message: "Password is not valid"};
            this.setState({
                errors: [...errors, error]
            })

            return false;

        }

        //Form Valid 
        return true;
    }

    isFormEmpty =({username, password, email, passwordConfirmation}) =>{

        return !username.length || !password.length || !email.length || !passwordConfirmation.length

    }

    isPasswordValid = ({password, passwordConfirmation}) => {

        if(password.length < 6 || passwordConfirmation < 6 ){
            return false
        } else if (password !== passwordConfirmation){
            return false
        } else {
            return true;
        }

    }


    displayErrors = errors => {
    return errors.map((error, i) => 
    {return(
        
            <Message error>
                <h3>Errors</h3>
                <p key={i}>{error.message}</p>

            </Message>
                
        
    )
})}
    

    

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value 
        })
    };

    handleSubmit = event => {
        event.preventDefault();


        if (this.isFormValid()){

        
            this.setState({
                errors: [],
                loading: true,
            })

            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser);
                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                    .then(()=> {
                        this.savedUser(createdUser).then(()=>{
                            console.log('user saved');
                        })
                    })
                    .catch(err=> {
                        console.error(err);
                        this.setState({
                            errors: [...this.state.errors, err],
                            loading: false,
                            })
                    })

                    
                })
                .catch(err => {
                    console.error(err)
                    this.setState({
                         errors: [...this.state.errors, err],
                         loading: false })

                })           

        }

    };

    savedUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });

    }

    handleInputError = (errors, input)=> {

       return errors.some(error => 
        error.message.toLowerCase().includes(input)
        )
         ? 'error'
         : ''

    }



    render(){

        const { 
            username,
            email,
            password, 
            passwordConfirmation,
            errors,
            loading} = this.state;

        return(
            <Grid textAlign="center" verticalAlign='middle' className="app">
                <Grid.Column style={{maxWidth: 450}} className= "reg">
                    <Header as='h1' icon color="orange" textAlign='center'>
                        <Icon name="puzzle piece" color="orange"/>
                        Register for DevChat                    
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input 
                            fluid 
                            name="username" 
                            icon="user" 
                            iconPosition='left' 
                            placeholder="username" 
                            onChange = {this.handleChange} 
                            type='text' value={username}
                            className = {this.handleInputError(errors, "username")}
                            />
                            <Form.Input 
                            fluid 
                            name="email" 
                            icon="mail" 
                            iconPosition='left' 
                            placeholder="email address" 
                            onChange = {this.handleChange} 
                            type='email'  value={email} 
                            className={this.handleInputError(errors, "email")}/>
                            <Form.Input 
                            fluid 
                            name="password" 
                            icon="lock" 
                            iconPosition='left' 
                            placeholder="Password" 
                            onChange = {this.handleChange} 
                            type='password'  
                            value={password} 
                            className={this.handleInputError(errors, "password")}/>
                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition='left' placeholder="Password Confirmation" onChange = {this.handleChange} type='password' value={passwordConfirmation} className={this.handleInputError(errors, "passwordConfirmation")}/>


                            <Button disabled={loading} className = {loading ? 'loading' : ''} color="orange" fluid size='large'>Submit</Button>
                        </Segment>
                    </Form>
                    {this.state.errors ? this.displayErrors(this.state.errors) : null}
                    <Message>Already a User? <Link to='/login'>Login </Link> </Message>

                </Grid.Column>
            </Grid>
        )
    }
}



export default Register 