import React, { Component } from 'react';
import scrollToComponent from 'react-scroll-to-component';
import moment from 'moment';
import { Comment, Image } from 'semantic-ui-react';



const isOwnMessage = (message, user) =>{
    return message.user.id === user.uid ? 'message__self' : '';
    
}

const isImage = (message) => {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content')
}

const timeFromNow = (timestamp) => moment(timestamp).fromNow()




class Message extends Component {

   
    

    render(){
        const {messages, user, ref} = this.props;
    
 
    
    return (
        <Comment>
            <Comment.Avatar src={messages.user.avatar} />
            <Comment.Content className ={isOwnMessage(messages, user)} >
                <Comment.Author as='a'>{messages.user.name}</Comment.Author>
                <Comment.Metadata>{timeFromNow(messages.timestamp)}</Comment.Metadata>
                
                {isImage(messages)? <Image src={messages.image} className="message__image" /> :
                    <Comment.Text>
                    {messages.content}
                    
                    
                    </Comment.Text>
                      
                 }
            </Comment.Content>
        </Comment>
        
    )
}
}





export default Message;