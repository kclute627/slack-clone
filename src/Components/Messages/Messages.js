import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { setUserPosts } from '../../actions'
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

class Messages extends Component {


    state = {
        
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.user,
        messages: [],
        messagesLoading: true,
        numUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        isChannelStarred: false,
        isPrivateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        usersRef: firebase.database().ref('users')

       
    }

    componentDidMount(){
        const { channel, user} = this.state;

        if(channel && user){
            this.addListners(channel.id);
            this.addUserStarListners(channel.id, user.uid)
        }

       
    }

    addListners = channelId => {
        this.addMessageListner(channelId);
    }

    addMessageListner = channelId => {
        let loadedMessages =  [];
        const ref = this.getMessagesRef()

        ref.child(channelId).on('child_added', snap=> {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false,
            });

            this.countUsers(loadedMessages);
            this.countUserPosts(loadedMessages);
        })
    }

    addUserStarListners = (channelId, userId) =>{
        this.state.usersRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if(data.val() !== null) {
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    this.setState({
                        isChannelStarred: prevStarred
                    })
                }
            })

    }

    getMessagesRef = ()=> {
        const { messagesRef, privateMessagesRef, isPrivateChannel } = this.state;

       return isPrivateChannel ? privateMessagesRef : messagesRef;
    }

    countUsers = (arr) => {
        const users = arr.reduce((acc, cur ) =>{
            if(!acc.includes(cur.user.name)){
                acc.push(cur.user.name);
            }
            return acc
        }, []);

        let numUsers;
        let plural = users.length > 1 || users.length === 0;
        
        numUsers = `${users.length} user${plural ? 's':''}`;
    
        

        this.setState({numUsers})
    }

    countUserPosts = (messages) => {
        let userPosts = messages.reduce((acc, message)=>{
            if(message.user.name in acc){
                acc[message.user.name].count += 1;
            }else {
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    count: 1,
                }
            }
            return acc;
        }, {});

        this.props.setUserPosts(userPosts);

    }

    displayMessages = arr => {
        return arr.length > 0 && arr.map(cur=>(
            <Message
                key={cur.timestamp}
                messages={cur}
                user = {this.state.user}
            />
        ))

    }

    displayChannelName= (channel) => {
        console.log("isprivate", this.props.isPrivateChannel)
        return channel ? `${this.props.isPrivateChannel ? '@': '#'}${channel.name}` : '' ;
    }

    handleSearchChange = (event)=> {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true        
        }, ()=> this.handleSearchMessages() )

    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];

        const regex = new RegExp(this.state.searchTerm, 'gi');

        const searchResults = channelMessages.reduce((acc, message)=>{
            if((message.content && message.content.match(regex)) || message.user.name.match(regex)){
                acc.push(message)
            }
            return acc;
        }, []);

        this.setState({searchResults})
        setTimeout(()=>this.setState({searchLoading: false}), 1000);

    }

    handleStar = ()=> {
        this.setState(prevState => ({
            isChannelStarred: !prevState.isChannelStarred,
        }), ()=> this.starChannel());
    }

    starChannel = () => {
        if (this.state.isChannelStarred){
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .update({
                    [this.state.channel.id]: {
                        name: this.state.channel.name,
                        details: this.state.channel.details,
                        createdBy: {
                            name: this.state.channel.createdBy.name,
                            avatar:  this.state.channel.createdBy.avatar
                        }
                    }
                })
        }else{
           this.state.usersRef
            .child(`${this.state.user.uid}/starred`)
            .child(this.state.channel.id)
            .remove(err => {
                if(err !== null){
                    console.error(err)
                }
            })
        }
    }


    render(){
        //prettier-ignore
        const { messagesRef, channel, user, messages, numUsers, searchTerm, searchResults, searchLoading, isPrivateChannel, isChannelStarred  } = this.state;

        return(
            <Fragment>
                <MessagesHeader 
                channelName = {this.displayChannelName(channel)}
                numUsers = {numUsers}
                handleSearchChange={this.handleSearchChange}
                searchLoading = {searchLoading}
                isPrivateChannel = {isPrivateChannel}
                handleStar = {this.handleStar}
                isChannelStarred = {isChannelStarred}
                
                />

                <Segment>
                    <Comment.Group className='messages'>
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}

                    </Comment.Group>
                </Segment>

                <MessageForm
                messagesRef ={messagesRef}
                currentChannel = {channel}
                currentUser = { user }
                isPrivateChannel = {isPrivateChannel}
                getMessagesRef = {this.getMessagesRef}
                 />

                
            </Fragment>


        )
    }
}



export default connect(null, {setUserPosts})(Messages);