import React, { Component } from 'react';

/* Redux */
import { connect } from 'react-redux';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';

/* React-Icons */
import { IoMdChatbubbles } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa';

/* Bootstrap */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';

/* Firebase */
import { getDatabase, ref, onChildAdded, onValue, push, child, update, off} from 'firebase/database';

/*----------------------------------------*\
  클래스형 컴포넌트로 만듬 함수형은 왜안되는지 추후 변경
\*----------------------------------------*/
class ChatRooms extends Component {
    state = {
        show: false,
        name: "",
        description: "",
        chatRoomsRef: ref(getDatabase(), "chatRooms"),
        messagesRef: ref(getDatabase(), "messages"),
        chatRooms: [],
        firstLoad: true,
        activeChatRoomId: "",
        notifications: []
    }

    componentDidMount() {
        this.AddChatRoomsListeners();
    }

    componentWillUnmount() {
        off(this.state.chatRoomsRef);

        //chatRoom Notification 없애기
        /* this.state.chatRooms.forEach(chatRoom => {
            this.state.messagesRef.child(chatRoom.id).off();
        }) */
    }

    setFirstChatRoom = () => {

        const firstChatRoom = this.state.chatRooms[0]
        if (this.state.firstLoad && this.state.chatRooms.length > 0) {
            this.props.dispatch(setCurrentChatRoom(firstChatRoom)) 
            this.setState({ activeChatRoomId: firstChatRoom.id })
        }
        this.setState({ firstLoad: false })

    }


    AddChatRoomsListeners = () => {
        let chatRoomsArray = [];

        onChildAdded(this.state.chatRoomsRef, DataSnapshot => {
            chatRoomsArray.push(DataSnapshot.val());
            this.setState({ chatRooms: chatRoomsArray },
                () => this.setFirstChatRoom());
            //chatRoom 알람
            this.addNotificationListener(DataSnapshot.key);
            /* console.log(DataSnapshot.key); */
        })

    }
    /*--------------------------------------------------------*\
                        Notification 뱃지 알람 
    \*--------------------------------------------------------*/
    addNotificationListener = (chatRoomId) => {
        let { messagesRef } = this.state;
        onValue(child(messagesRef, chatRoomId), DataSnapshot => {
            if (this.props.chatRoom) {
                /* console.log('Datasnapshot',DataSnapshot); */
                this.handleNotification(
                    chatRoomId,
                    this.props.chatRoom.id,
                    this.state.notifications,
                    DataSnapshot
                )
            }
        })

    }

    handleNotification = (chatRoomId, currentChatRoomId, notifications, DataSnapshot) => {

        let lastTotal = 0;

        // 이미 notifications state 안에 알림 정보가 들어있는 채팅방과 그렇지 않은 채팅방을 나눠주기 
        let index = notifications.findIndex(notification =>
            notification.id === chatRoomId)

        //notifications state 안에 해당 채팅방의 알림 정보가 없을 때 
        if (index === -1) {
            notifications.push({
                id: chatRoomId,
                total: DataSnapshot.size,
                lastKnownTotal: DataSnapshot.size,
                count: 0
            })
            /* console.log('notifications',notifications); */
        }
        // 이미 해당 채팅방의 알림 정보가 있을 떄 
        else {
            //상대방이 채팅 보내는 그 해당 채팅방에 있지 않을 때 
            if (chatRoomId !== currentChatRoomId) {
                //현재까지 유저가 확인한 총 메시지 개수 
                lastTotal = notifications[index].lastKnownTotal

                //count (알림으로 보여줄 숫자)를 구하기 
                //현재 총 메시지 개수 - 이전에 확인한 총 메시지 개수 > 0
                //현재 총 메시지 개수가 10개이고 이전에 확인한 메시지가 8개 였다면 2개를 알림으로 보여줘야함.
                if (DataSnapshot.size - lastTotal > 0) {
                    notifications[index].count = DataSnapshot.size - lastTotal;
                }
            }
            //total property에 현재 전체 메시지 개수를 넣어주기
            notifications[index].total = DataSnapshot.size;
        }
        //목표는 방 하나 하나의 맞는 알림 정보를 notifications state에  넣어주기 
        this.setState({ notifications })
    }


    /*---------------------------------------------------------------------------------------*/


    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });

    handleSubmit = (e) => {
        e.preventDefault();
        const { name, description } = this.state;

        if (this.isFormValid(name, description)) {
            this.addChatRoom();
        }

    }

    addChatRoom = async () => {

        const key = push(this.state.chatRoomsRef).key;
        const { name, description } = this.state;
        const { user } = this.props
        const newChatRoom = {
            id: key,
            name: name,
            description: description,
            createdBy: {
                name: user.displayName,
                image: user.photoURL
            }
        }

        try {
            await update(child(this.state.chatRoomsRef, key), newChatRoom)
            this.setState({
                name: "",
                description: "",
                show: false
            })
        } catch (error) {
            alert(error)
        }
    }


    isFormValid = (name, description) =>
        name && description;

    /*-------------------------------------------------------*\
                          changeChatRoom
    \*-------------------------------------------------------*/
    changeChatRoom = (room) => {
        this.props.dispatch(setCurrentChatRoom(room));
        this.props.dispatch(setPrivateChatRoom(false));
        this.setState({ activeChatRoomId: room.id });
        this.clearNotifications();
    }
    //알람이 뜬 방을 클릭하면 알람 count가 0이 되고 뱃지알람이 사라지게 만드는곳
    clearNotifications = () => {
        let index = this.state.notifications.findIndex(
            notification => notification.id === this.props.chatRoom.id
        )

        if(index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].lastKnownTotal = this.state.notifications[index].total;
            updatedNotifications[index].count = 0;
            this.setState({ notifications: updatedNotifications });
        }
    }
    /*-------------------------------------------------------*\
                    Notification 채팅방 Count 
    \*-------------------------------------------------------*/
    getNotificationCount = (room) => {
        //해당 채팅방의 count수를 구하는 중입니다.
        let count = 0;
        /* console.log('room.id',room.id); */
        
        this.state.notifications.forEach(notification => {
            if (notification.id === room.id) {
                count = notification.count;
            }
        })
        if (count > 0) return count;
    }
    /*-------------------------------------------------------*\
                renderChatRooms + Notification 알림뱃지
    \*-------------------------------------------------------*/
    renderChatRooms = (chatRooms) =>
        chatRooms.length > 0 &&
        chatRooms.map(room => (
            <li
                key={room.id}
                style={{
                    cursor:'pointer',
                    backgroundColor: room.id === this.state.activeChatRoomId &&
                        "#ffffff45"
                }}
                onClick={() => this.changeChatRoom(room)}
            >
                # {room.name}
                <Badge bg="danger" style={{ float: 'right', marginTop: '1px'}} /* variant="danger" */>
                    {this.getNotificationCount(room)}
                </Badge>
            </li>
        ))
    
    render() {
        return (
            <div>
                <div style={{
                    width:'100%',
                    marginBottom: '10px',
                    marginTop: '10px',
                    cursor:'pointer',
                }}>
                    <div style={{display:'flex',alignItems:'center', justifyContent:'space-between'}}>
                        <div style={{display:'flex', alignItems:'center'}}>
                            <IoMdChatbubbles style={{marginRight: '10px'}}/>
                            <span>ChatRooms {" "} ({this.state.chatRooms.length})</span>
                        </div>
                        <FaPlus 
                            onClick={this.handleShow}
                            style={{
                                cursor:'pointer',
                                marginTop:'2px',
                        }}/>
                    </div>
                </div>

                {/* ------------ChatRooms 생성되는 곳---------- */}
                <ul style={{listStyleType: 'none', padding:0}}>
                    {this.renderChatRooms(this.state.chatRooms)}
                </ul>
                {/* ---------------------------------------- */}

                {/* ADD CHAT ROOM MODAL */}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a Chat Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>방 이름</Form.Label>
                            <Form.Control onChange={(e) => this.setState({name: e.target.value})} type="text" placeholder="Enter a chat room name" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>방 설명</Form.Label>
                            <Form.Control onChange={(e) => this.setState({description: e.target.value})} type="text" placeholder="Enter a chat room description" />
                        </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{background:'#0e101c', border:'none'}} onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button style={{background:'#ec5990', border:'none'}} onClick={this.handleSubmit}>
                            Create Chat Room
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        chatRoom: state.chatRoom.currentChatRoom
    }
}

export default connect(mapStateToProps)(ChatRooms);