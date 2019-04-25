import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';



class UserPanel extends Component {

    state = {
        user: this.props.currentUser,
    }

    // componentWillReceiveProps(nextProps){
    //     this.setState({user: nextProps.currentUser})
    // }

    
    dropdownOptions = ()=> {
        return [{
            key: 'user',
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true,
        },
        {
            key: 'use2r',
            text: <span>Change Avatar</span>,
            
        },
        {
            key: 'user0',
            text: <span onClick={this.handleSignout}>Sign Out</span>
        }
           

        ]
    }

    handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(()=> console.log('signed out'))
    }


    render(){



        console.log(this.props.currentUser)

        const { user } = this.state;

        return(
            <Grid
            style={{background: '#4c3c4c'}}>
                <Grid.Column>
                    <Grid.Row
                    style={{padding:'1.2em', margin: 0}}>

                        <Header inverted floated="left"  as="h2">
                            <Icon name='code'/>
                            <Header.Content>DEVCHAT</Header.Content>
                        </Header>
                    

                    <Header style={{padding: '0.25em'}} as='h4' inverted>
                        <Dropdown trigger={
                            <span>
                                <Image src={user.photoURL} spaced="right" avatar />
                            {user.displayName}
                            </span>
                        } options={this.dropdownOptions()} />                    
                    </Header>
                   </Grid.Row>
                </Grid.Column>

            </Grid>

        )
    }
}




export default UserPanel;




