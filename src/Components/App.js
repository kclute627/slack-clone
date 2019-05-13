import React from 'react';
import { Grid } from 'semantic-ui-react'
import ColorPanel from './ColorPanel/ColorPanel';
import Messages from './Messages/Messages';
import MettaPanel from './MetaPanel/MetaPanel';
import SidePanel from './SidePanel/SidePanel';
import { connect } from 'react-redux';
import './App.css';



const App = (props)=> {
  const {} = props;
  return(
    <Grid columns="equal" className="app" style={{background: '#eee'}}>
      <ColorPanel
      key = {props.currentUser && props.currentUser.name}
      user = {props.currentUser}/>
      <SidePanel
      key={props.currentUser && props.currentUser.uid}
      currentUser ={props.currentUser}  />
      <Grid.Column style={{marginLeft: 320}}>
        <Messages
        key={props.currentChannel && props.currentChannel.id }
        currentChannel ={props.currentChannel} 
        user = {props.currentUser}
        isPrivateChannel={props.isPrivateChannel}/>
      </Grid.Column>
      <Grid.Column width={4}>
        <MettaPanel
          key = {props.currentChannel && props.currentChannel.name}
          currentChannel = {props.currentChannel}
         isPrivateChannel = {props.isPrivateChannel}
         userPosts = {props.userPosts} />
      </Grid.Column>
      
  </Grid>

  )
    
}



const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts
} )


export default connect(mapStateToProps)(App);
