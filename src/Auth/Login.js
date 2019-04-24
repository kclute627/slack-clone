import React, { Component } from 'react';


import { Link } from 'react-router-dom';

import firebase from '../firebase';


import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react"


class Login extends Component {

    state = {
        
        password: '',
        email: '',
      
        errors: [],
        loading: false,
        
    };

    

    


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


        if (this.isFormValid(this.state)){

        
            this.setState({
                errors: [],
                loading: true,
            });
            firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(signedInUser => {
                console.log(signedInUser);
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    errors: [...this.state.errors, err],
                    loading: false,
                 })
            })

            
        }

    };

    isFormValid = ({email, password}) => {

        return email && password;

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
            
            email,
            password, 
            
            errors,
            loading} = this.state;

        return(
            <Grid textAlign="center" verticalAlign='middle' className="app">
                <Grid.Column style={{maxWidth: 450}} className= "reg">
                    <Header as='h1' icon color="violet" textAlign='center'>
                        <Icon name="code branch" color="violet"/>
                        Login to DevChat                    
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            
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
                            

                            <Button disabled={loading} className = {loading ? 'loading' : ''} color="violet" fluid size='large'>Submit</Button>
                        </Segment>
                    </Form>
                    {this.state.errors ? this.displayErrors(this.state.errors) : null}
                    <Message>Don't have an account?  <Link to='/register'>Register </Link> </Message>

                </Grid.Column>
            </Grid>
        )
    }
}




export default Login