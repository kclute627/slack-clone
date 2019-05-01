import React, { Component, Fragment } from 'react';
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
        searchResults: []
    }

    componentDidMount(){
        const { channel, user} = this.state;

        if(channel && user){
            this.addListners(channel.id)
        }
    }

    addListners = channelId => {
        this.addMessageListner(channelId);
    }

    addMessageListner = channelId => {
        let loadedMessages =  [];

        this.state.messagesRef.child(channelId).on('child_added', snap=> {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false,
            });

            this.countUsers(loadedMessages);
        })
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

    displayMessages = arr => {
        return arr.length > 0 && arr.map(cur=>(
            <Message
                key={cur.timestamp}
                messages={cur}
                user = {this.state.user}
            />
        ))

    }

    displayChannelName= channel => {
       return channel ?  `#${channel.name}` : '';
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
            if(message.content && message.content.match(regex) || message.user.name.match(regex)){
                acc.push(message)
            }
            return acc;
        }, []);

        this.setState({searchResults})
        setTimeout(()=>this.setState({searchLoading: false}), 1000);

    }


    render(){
        //prettier-ignore
        const { messagesRef, channel, user, messages, numUsers, searchTerm, searchResults, searchLoading  } = this.state;

        return(
            <Fragment>
                <MessagesHeader 
                channelName = {this.displayChannelName(channel)}
                numUsers = {numUsers}
                handleSearchChange={this.handleSearchChange}
                searchLoading = {searchLoading}
                
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
                 />

                
            </Fragment>


        )
    }
}



export default Messages;