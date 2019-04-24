import React from 'react';
import { Grid } from 'semantic-ui-react'
import ColorPanel from './ColorPanel/ColorPanel';
import Messages from './Messages/Messages';
import MettaPanel from './MetaPanel/MetaPanel';
import SidePanel from './SidePanel/SidePanel';
import './App.css';


const App = ()=> {
  return(
    <Grid columns="equal" className="app" style={{background: '#eee'}}>
      <ColorPanel/>
      <SidePanel />
      <Grid.Column style={{marginLeft: 320}}>
        <Messages />
      </Grid.Column>
      <Grid.Column width={4}>
        <MettaPanel />
      </Grid.Column>
      
  </Grid>

  )
    
}


export default App;
