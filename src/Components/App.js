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
      <ColorPanel/>
      <SidePanel
      key={props.currentUser && props.currentUser.uid}
      currentUser ={props.currentUser}  />
      <Grid.Column style={{marginLeft: 320}}>
        <Messages
        key={props.currentChannel && props.currentChannel.id }
        currentChannel ={props.currentChannel} 
        user = {props.currentUser}/>
      </Grid.Column>
      <Grid.Column width={4}>
        <MettaPanel />
      </Grid.Column>
      
  </Grid>

  )
    
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
})


export default connect(mapStateToProps)(App);
