import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions'
import firebase from '../../firebase';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';




class Channels extends Component {
    state = {
        user: this.props.name,
        channels: [],
        modal: false,
        channelName: '',
        channelsRef: firebase.database().ref('channels'),
        channelDetials: '',
        firstLoad: true, 
        activeChannel: '',
    }

    componentDidMount(){
        this.addListeners();
    }
    componentWillUnmount(){
        this.removeListeners();
    }

    addListeners = ()=> {
        let loadedChannels = [];

        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState(
                {channels: loadedChannels},
                () => this.setFirstChannel());
        });
    }
    removeListeners = () => {
        this.state.channelsRef.off();
    }

    setFirstChannel = () => {
        const { firstLoad, channels } = this.state;

        const firstChannel = channels[0];

        if(firstLoad && channels.length > 0){
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
        }

        this.setState({firstLoad: false});
    }

    handleSubmit = event => {
        event.preventDefault();

        if(this.isFormValid(this.state)){
            this.addChannel();
        }

    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    changeChannel = channel => {
        this.setActiveChannel(channel);

        this.props.setCurrentChannel(channel)
    }


    openModal = () => this.setState({modal: true});

    closeModal = () => this.setState({modal: false});

    isFormValid = ({channelName, channelDetials}) => channelName && channelDetials;

    addChannel = () => {
        const {channelsRef, channelName, channelDetials, user} = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetials,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL,
            }

        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then(()=>{
                this.setState({channelDetials: '', channelName: ''});
                this.closeModal();
                console.log('channel added')
            })
            .catch(err =>{
                console.error(err)
            })
    }

    setActiveChannel = channel => {
        this.setState({activeChannel: channel.id})
    }

    displayChannels = (arr) => {
        console.log(arr)      
            return (
            arr.length > 0 && arr.map(cur=> (
            <Menu.Item
            key={cur.id}
            onClick={()=> this.changeChannel(cur)}
            name={cur.name}
            style={{opacity: 0.7}}
            active = {cur.id === this.state.activeChannel}
            >
            # {cur.name}
            </Menu.Item>
        )))
       
        }

    render(){

        const {channels, modal} = this.state;

        return(
        <Fragment>
            <Menu.Menu style={{paddingBottom: '2em'}}>
                <Menu.Item>
                    <span>
                        <Icon name='exchange' /> CHANNLES                       
                    </span>{'  '}
                    ({channels.length}) <Icon name='add' onClick={this.openModal}  />
                </Menu.Item>
                {this.displayChannels(channels)}
            </Menu.Menu>

                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add A Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input
                                  fluid
                                  label='Name of channel'
                                  name='channelName'
                                  onChange={this.handleChange}
                                
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                  fluid
                                  label='About the Channel'
                                  name='channelDetials'
                                  onChange={this.handleChange}
                                
                                />
                            </Form.Field>
                        </Form>

                    </Modal.Content>

                    <Modal.Actions>
                        <Button color='green' inverted onClick={this.handleSubmit}>
                            <Icon name='checkmark'/> Add

                        </Button>
                        <Button color='red' inverted onClick={this.closeModal}>
                            <Icon name='remove'/> Cancel

                        </Button>
                    </Modal.Actions>

                </Modal>
            </Fragment>
        )
    }
}














export default connect(null, { setCurrentChannel })(Channels)