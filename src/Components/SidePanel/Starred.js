import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions'
import { Menu, Icon } from 'semantic-ui-react';



class Starred extends Component {

    state = {
        starredChannels: [],
        activeChannel: ''
    }

    changeChannel = channel => {
        this.setActiveChannel(channel);
        

        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        
    }

    
    setActiveChannel = channel => {
        this.setState({activeChannel: channel.id})
    }

    displayChannels = (arr) => {
              
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

        const {starredChannels} = this.state;
        return(
            <Menu.Menu className= "menu">
            <Menu.Item>
                <span>
                    <Icon name='star' /> STARRED                       
                </span>{'  '}
                ({starredChannels.length}) 
            </Menu.Item>
            {this.displayChannels(starredChannels)}
        </Menu.Menu>

        )
    }
}


export default connect(null, {setCurrentChannel, setPrivateChannel})(Starred)