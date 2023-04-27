import React, { Component } from 'react';

/* Redux */
import { connect } from 'react-redux';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';

/* React-icons */
import { IoMdChatbubbles } from 'react-icons/io';

/* Firebase */
import { getDatabase, ref, onChildAdded } from "firebase/database";

class DirectMessages extends Component {

    state = {
        usersRef: ref(getDatabase(), "users"),
        users: [],
        activeChatRoom: ""
    }

    componentDidMount() {
        if (this.props.user) {
            this.addUsersListeners(this.props.user.uid)
        }
    }

    addUsersListeners = (currentUserId) => {
        const { usersRef } = this.state;
        let usersArray = [];

        onChildAdded(usersRef,  DataSnapshot => {
            if (currentUserId !== DataSnapshot.key) {
                let user = DataSnapshot.val();
                user["uid"] = DataSnapshot.key;
                user["status"] = "offline";
                usersArray.push(user)
                this.setState({ users: usersArray })
            }
        })
    }
    // Direct Message는 따로 Chat Room을 만드는 것이 아니라 임의로 id값을 만들어야함
    // A: 1234 , B: 5678 라는 아이디를 가졌다면, 우선 A > B 규칙을 만들고 서로 같이 볼 수 있는 두가지의 경우를
    // 만들어낸다. true = 1234/5678 false = 
    getChatRoomId = (userId) => {
        const currentUserId = this.props.user.uid
        console.log('currentUserId',currentUserId);
        console.log('userId',userId);
        return userId > currentUserId
            ? `${userId}/${currentUserId}`
            : `${currentUserId}/${userId}`
    }

    changeChatRoom = (user) => {
        const chatRoomId = this.getChatRoomId(user.uid);
        const chatRoomData = {
            id: chatRoomId,
            name: user.name
        }

        this.props.dispatch(setCurrentChatRoom(chatRoomData));
        this.props.dispatch(setPrivateChatRoom(true));
        this.setActiveChatRoom(user.uid);
    }

    setActiveChatRoom = (userId) => {
        this.setState({ activeChatRoom: userId })
    }

    //user 목록 생성
    renderDirectMessages = users =>
        users.length > 0 &&
        users.map(user => (
            <li key={user.uid}
                style={{
                    cursor:'pointer',
                    backgroundColor: user.uid === this.state.activeChatRoom
                        && "#ffffff45"
                }}
                onClick={() => this.changeChatRoom(user)}>
                # {user.name}
            </li>
        ))

    render() {
        const { users } = this.state;
        return (
            <div>
                <div style={{
                    width:'100%',
                    marginBottom: '10px',
                    marginTop: '10px',
                    cursor:'pointer'
                }}>
                    <div style={{display:'flex',alignItems:'center', justifyContent:'space-between'}}>
                        <div style={{display:'flex', alignItems:'center'}}>
                            <IoMdChatbubbles style={{marginRight: '10px'}}/>
                            <span>Direct Messages {" "} ({users.length})</span>
                        </div>
                    </div>
                </div>
                {/* ------------DirectMessage 생성되는 곳---------- */}
                <ul style={{listStyleType: 'none', padding:0}}>
                    {this.renderDirectMessages(users)}
                </ul>
                {/* -------------------------------------------- */}
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(DirectMessages);