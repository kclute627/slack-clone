import React, { Component } from 'react';

import AvatarEditor from 'react-avatar-editor';
import firebase from '../../firebase';
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react';



class UserPanel extends Component {

    state = {
        user: this.props.currentUser,
        modal: false,
        previewImage: null,
        croppedImage: '',
        blob: null,
        storageRef: firebase.storage().ref(),
        userRef: firebase.auth().currentUser,
        metadata: {
            contentType: 'image/jpeg'
        },
        uploadedCroppedImage: '',
        usersRef: firebase.database().ref('users')
    }

    // componentWillReceiveProps(nextProps){
    //     this.setState({user: nextProps.currentUser})
    // }

    
    openModal = ()=> {
        this.setState({ modal: true })
    }

    closeModal = ()=> {
        this.setState({ modal: false })
    }

    dropdownOptions = ()=> {
        return [{
            key: 'user',
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true,
        },
        {
            key: 'avatar',
            text: <span onClick={this.openModal}>Change Avatar</span>,
            
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

    handleChange = e =>{
        const file = e.target.files[0];

        const reader = new FileReader()

        if(file){
            reader.readAsDataURL(file);
            reader.addEventListener('load', ()=> {
                this.setState({ previewImage: reader.result });
            })
        }
    }

    handleCropImage = () => {
        if(this.avatarEditor){
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);

                this.setState({
                    croppedImage: imageUrl,
                    blob
                })
            })
        }
    }

    uploadCroppedImage = () => {

        const {storageRef, userRef, blob, metadata} = this.state;

        storageRef
            .child(`avatars/user-${userRef.uid}`)
            .put(blob, metadata )
            .then(snap => {
                snap.ref.getDownloadURL().then(downloadURL => {
                    this.setState({
                        uploadedCroppedImage: downloadURL
                    }, () => this.changeAvatar() )
                })
            })

    }

    changeAvatar = () =>{
        this.state.userRef
            .updateProfile({
                photoURL: this.state.uploadedCroppedImage
            })
            .then(()=>{
                console.log("Photo Changed")
                this.closeModal();
            })
            .catch(err => {
                console.error(err)
            })

        this.state.usersRef
            .child(this.state.user.uid)
            .update({ avatar: this.state.uploadedCroppedImage})
            .then(()=> {
                console.log('avatar updated ')
            })
            .catch(err => {
                console.error(err)
            })
    }


    render(){



        console.log(this.props.currentUser)

        const { user, modal, previewImage, croppedImage, blob } = this.state;
        const { primaryColor } = this.props;

        return(
            <Grid
            style={{background: primaryColor}}>
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
                   {/* change user avatar model  */}
                        
                   <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header>Change Avatar</Modal.Header>
                        <Modal.Content>
                            <Input 
                            onChange={this.handleChange}
                            fluid
                            type='file'
                            label='New Avatar'
                            name='previewImage'
                            />
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className="ui centered aligmed grid">
                                        {previewImage && (
                                            <AvatarEditor
                                            ref={node => (this.avatarEditor = node)}
                                            image={previewImage}
                                            width={120}
                                            height={120}
                                            border={50}
                                            scale={1.2}/>
                                        )}


                                    </Grid.Column>
                                    <Grid.Column>
                                        {croppedImage && (
                                            <Image 
                                            style={{margin: '3.5em auto'}}
                                            width={100}
                                            height={100}
                                            src={croppedImage}
                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            { croppedImage ? <Button color="green" inverted onClick={this.uploadCroppedImage} >
                                <Icon name="save"/> Save Avatar
                            </Button> : null }
                            <Button color="green" inverted onClick={this.handleCropImage} >
                                <Icon name="image"/> Preview
                            </Button>
                            <Button color="red" inverted onClick={this.closeModal}>
                                <Icon name="remove"/> Cancel
                            </Button>
                        </Modal.Actions>
                   </Modal>

                </Grid.Column>

            </Grid>

        )
    }
}




export default UserPanel;




