import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions'
import firebase from '../../firebase';
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react';




class Channels extends Component {
    state = {
        user: this.props.name,
        channel: null,
        channels: [],
        modal: false,
        channelName: '',
        channelsRef: firebase.database().ref('channels'),
        channelDetials: '',
        messagesRef: firebase.database().ref('messages'),
        notifications: [],
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
                this.addNotificationListener(snap.key);
        });
        
    };

    addNotificationListener = (id) => {
        this.state.messagesRef.child(id).on('value', snap => {
            if(this.state.channel){
                this.handleNotifications(id, this.state.channel.id, this.state.notifications, snap)
            }
        });

    }

    handleNotifications = (channelId, currentChannelId, notifications, snap)=> {
        let lastTotal = 0;

        let index = notifications.findIndex(notification => notification.id === channelId);

        if(index !== -1){
            if(channelId !== currentChannelId){
                lastTotal = notifications[index].total;

                if(snap.numChildren() - lastTotal > 0 ){
                    notifications[index].count = snap.numChildren() - lastTotal
                }
            }
            
            notifications[index].lastKnownTotal = snap.numChildren()

        }else{
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0,

            })
        }

        this.setState({
            notifications
        })
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
            this.setState({channel: firstChannel})
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

    clearNotifications = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);

        if(index !== -1){
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
            updatedNotifications[index].count = 0;
            this.setState({ notifications: updatedNotifications})

        }
    }

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.clearNotifications();

        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({channel})
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

    getNotificationCount = channel => {
        let count = 0;


        this.state.notifications.forEach(notification => {
            if(notification.id === channel.id){
                count = notification.count
            }
        })

        if(count > 0 ){
            return count
        }

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
            {this.getNotificationCount(cur) && (
                <Label color='red'>{this.getNotificationCount(cur)}</Label>
            )}   

            # {cur.name}
            </Menu.Item>
        )))
       
        }

    render(){

        const {channels, modal} = this.state;

        return(
        <Fragment>
            <Menu.Menu className= "menu">
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


const mapPropsToDispatch = dispatch =>{

    return{
        setCurrentChannel: (channel)=> dispatch(setCurrentChannel(channel)),
        setPrivateChannel: (a)=> dispatch(setPrivateChannel(a)),

    }
}














export default connect(null, mapPropsToDispatch)(Channels)