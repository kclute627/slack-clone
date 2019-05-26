import React, { Component } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel} from '../../actions/index';

import { Menu, Icon } from 'semantic-ui-react'


class DirectMessages extends Component {

    state={
        activeChannel: null,
        user: this.props.currentUser,
        users: [],
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef: firebase.database().ref('presence')

    }

    componentDidMount(){
        if(this.state.user){
            this.addListners(this.state.user.uid);
        }
    }

   
   

    addListners = userID => {
        let loadedUsers = [];
        this.state.usersRef.on('child_added', snap => {
            if(userID !== snap.key){
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline';
                loadedUsers.push(user);
                this.setState({users: loadedUsers});
            }
        })

        this.state.connectedRef.on('value', snap => {
            if(snap.val() === true){
              const ref = this.state.presenceRef.child(userID);
              ref.set(true);
              ref.onDisconnect().remove(err => {
                  if(err !== null){
                      console.error(err)
                  }
              })

            }
        });


        this.state.presenceRef.on('child_added', snap => {
            if(userID !== snap.key){
                this.addStatusToUser(snap.key);

            }
        });

        this.state.presenceRef.on('child_removed', snap => {
            if(userID !== snap.key){
                this.addStatusToUser(snap.key, false)
            }
        })
    }

    addStatusToUser = (userID, connected =true) => {
        const updatedUsers = this.state.users.reduce((acc, user)=>{
            if(user.uid === userID ){
                user['status'] = `${connected ? 'online' : 'offline'}`;
            }
            return acc.concat(user);

        }, []);

        this.setState({
            users: updatedUsers
        })
    }

    isuserOnline = user => user.status === 'online';

    changeChannel = user => {
        const channelId = this.getChannelId(user.uid);
        const channelData = {
            id: channelId,
            name: user.name,

        };
        this.props.setCurrentChannel(channelData);
        this.props.setPrivateChannel(true);
        this.setActiveChannel(user.uid);
    }
    setActiveChannel = (id)=>{
        this.setState({
            activeChannel: id,
        })
    }

    getChannelId = userId => {
        const currentUserId = this.state.user.uid;

        return userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`
    }

    render(){
        const { users, activeChannel } = this.state;
        return(
        <Menu.Menu className="menu">
            <Menu.Item>
                <span>
                    <Icon name='mail'/>DIRECT MESSAGES
                </span>{' '}
                ({users.length})

            </Menu.Item>
            {users.map(cur =>{ 
                return(
                    <Menu.Item
                    key={cur.uid}
                    active = {cur.uid === activeChannel}
                    onClick={()=> this.changeChannel(cur)}
                    style={{opacity: 0.7, fontStyle: 'italic'}}
                    >
                    <Icon
                    name='circle'
                    color={this.isuserOnline(cur) ? 'green': 'red'}
                    />
                    @ {cur.name}

                    </Menu.Item>

                )
                    
            }
            )}
        </Menu.Menu>
        )
    }
}

const mapDispatchToProps = dispatch =>{
    return{
       setCurrentChannel: (cd)=>dispatch(setCurrentChannel(cd)),
       setPrivateChannel: (a)=>dispatch(setPrivateChannel(a)),
        

    }
}

export default connect(null, mapDispatchToProps)(DirectMessages);