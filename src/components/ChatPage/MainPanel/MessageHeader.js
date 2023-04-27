import React, { useEffect, useState } from 'react';

/* Redux */
import { useSelector } from 'react-redux';

/* React-icons */
import { FaLock } from 'react-icons/fa';
import { FaUnlock } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { AiFillMinusCircle } from 'react-icons/ai';

/* Bootstrap */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Image } from 'react-bootstrap';
/* import Accordion from 'react-bootstrap/Accordion'; */
/* import Card from 'react-bootstrap/Card'; */
/* import { useAccordionButton } from 'react-bootstrap/AccordionButton'; */

/* Firebase */
import { getDatabase, ref, onValue, remove, child, update } from 'firebase/database';

const MessageHeader = ({handleSearchChange}) => {
    
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    /* console.log('chatRoom',chatRoom); */
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)
    const [ isFavorited, setIsFavorited ] = useState(false);
    const usersRef = ref(getDatabase(), "users");
    const user = useSelector(state => state.user.currentUser);
    /* const userPosts = useSelector(state => state.chatRoom.userPosts); */
    /*--------------------------------------------------------------------*\
                            Favorite 즐겨찾기 새로고침 유지
    \*--------------------------------------------------------------------*/
    useEffect(() => {
        if (chatRoom && user) {
            addFavoriteListener(chatRoom.id, user.uid)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addFavoriteListener = ( chatRoomId, userId ) => {
        onValue(child(usersRef, `${userId}/favorited`), data => {
            if (data.val() !== null) {
                const chatRoomIds = Object.keys(data.val());
                /* console.log('data.val()', data.val()); */
                /* console.log('chatRoomId', chatRoomId); */
                const isAlreadyFavorited = chatRoomIds.includes(chatRoomId)
                setIsFavorited(isAlreadyFavorited)
            }
        })
    }

    /*--------------------------------------------------------------------*\
                    handleFavorite 즐겨찾기 Firebase on/off 기능
    \*--------------------------------------------------------------------*/
    const handleFavorite = () => {
        if(isFavorited) {
            setIsFavorited(prev => !prev)
            remove(child(usersRef, `${user.uid}/favorited/${chatRoom.id}`))
        }else {
            setIsFavorited(prev => !prev)
            update(child(usersRef, `${user.uid}/favorited`), {
                [chatRoom.id]: {
                    name: chatRoom.name,
                    description: chatRoom.description,
                    createdBy: {
                        name: chatRoom.createdBy.name,
                        image: chatRoom.createdBy.image
                    }
                }
            })
        }
    }
    /*--------------------------------------------------------------------*/

    //Bootstrap Toggle 커스텀 버튼
    /* function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
          console.log('totally custom!'),
        );

        return (
          <button
            type="button"
            onClick={decoratedOnClick}
            style={{ 
                backgroundColor: 'transparent',
                border:'none'
            }}
          >
            {children}
          </button>
        );
      } */

      /* const renderUserPosts = (userPosts) => 
        Object.entries(userPosts)
        .sort((a,b) => b[1].count - a[1].count)
        .map(([key, val], i) => (
            <div key={i}>
                <img
                    src={val.image}
                    style={{borderRadius:'25px',width:'20px',height:'20px'}}
                    alt={val.name}
                />
                <div>
                    <h6>{key}</h6>
                    <p>
                        {val.count} 개
                    </p>
                </div>
            </div>
        )) */

    return (
        <>
            <InputGroup style={{marginBottom:'1rem'}}>
                <InputGroup.Text 
                    id="basic-addon1"
                    style={{
                        border: '.1rem solid #0e101c',
                        borderRadius: '4px 0px 0px 4px',
                        background:'#0e101c'
                    }}
                >
                    <AiOutlineSearch style={{color:'#fff', fontSize:'20px'}}/>
                </InputGroup.Text>
                <Form.Control
                    style={{
                        border: '.1rem solid #0e101c',
                        borderRadius: '0px 4px 4px 0px'
                    }}
                    onChange={handleSearchChange}
                    placeholder="검색"
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                />
            </InputGroup>
            <div style={{
                width:'100%',
                heigth:'170px',
                border: '.1rem solid #ececec',
                borderRadius: '4px',
                /* padding: '1rem', */
                padding: '.5rem',
                marginBottom: '1rem'
            }}>
                <Container>
                    <Row style={{display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #ececec', paddingBottom:'.5rem'}}>
                        <Col>
                            <h4 style={{marginBottom:'0'}}>
                                <div style={{display:'flex', alignItems:'center', textAlign:'center'}}>
                                    <div style={{display:'flex', flexDirection:'column'}}>
                                        <span>{isPrivateChatRoom ? <FaLock/> : <FaUnlock style={{color:'#ec5990'}}/>}</span>
                                        <span style={{fontSize:'10px'}}>{isPrivateChatRoom? <span>Private</span> : <span style={{color:'#ec5990'}}>Open</span>}{" "}</span>
                                    </div>
                                    <div style={{marginLeft:'1rem', fontSize:'20px'}}>
                                        {chatRoom && chatRoom.name}
                                    </div>
                                </div>
                            </h4>
                        </Col>
                        <Col style={{width:'100px', maxWidth:'100px', cursor:'pointer'}}>
                            {!isPrivateChatRoom && 
                                <span 
                                    onClick={handleFavorite}
                                    style={{
                                        display:'flex', 
                                        alignItems:'center', 
                                        justifyContent:'right'
                                    }}>
                                    {isFavorited ? 
                                        <span>
                                            <span style={{fontSize:'20px'}}><AiFillMinusCircle/></span>
                                            <span style={{fontSize:'12px', marginLeft:'3px', cursor:'pointer'}}>Favorite</span>
                                        </span>
                                        :
                                        <span>
                                            <span style={{fontSize:'20px'}}><AiOutlinePlusCircle/></span>
                                            <span style={{fontSize:'12px', marginLeft:'3px', cursor:'pointer'}}>Favorite</span>
                                        </span>
                                    }
                                </span>
                            }
                            {/* <InputGroup style={{
                            }}>
                                <InputGroup.Text 
                                    id="basic-addon1"
                                    style={{
                                        border: '.1rem solid #ececec',
                                    }}
                                >
                                    <AiOutlineSearch/>
                                </InputGroup.Text>
                                <Form.Control
                                    style={{
                                        border: '.1rem solid #ececec',
                                    }}
                                    onChange={handleSearchChange}
                                    placeholder="검색"
                                    aria-label="Search"
                                    aria-describedby="basic-addon1"
                                />
                            </InputGroup> */}
                        </Col>
                    </Row>
                    {!isPrivateChatRoom && 

                        <>
                            <Row style={{ marginTop:'.7rem', marginBottom:'.7rem', paddingBottom:'10px', borderBottom: '1px solid #ececec'}}>
                                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                    <div style={{marginRight:'.7rem'}}>
                                        <div style={{display:'flex', alignItems:'center',}}>
                                            <span style={{fontSize:'10px', marginRight:'.3rem'}}>created By</span>
                                            <Image 
                                                src={chatRoom && chatRoom.createdBy.image}
                                                roundedCircle
                                                style={{width:'30px', height:'30px', marginRight:'.3rem'}}
                                            /> 
                                            <span style={{fontWeight: 'bold'}}>{chatRoom && chatRoom.createdBy.name}</span>
                                        </div>
                                    </div>
                                    {" "}
                                    {/* <div>
                                        <span style={{fontWeight: 'bold'}}>{chatRoom && chatRoom.createdBy.name}</span>
                                    </div> */}
                                    {/* <div style={{display:'flex', alignItems:'center'}}>
                                        <span style={{fontSize:'10px', marginRight:'.3rem'}}>description</span>
                                        <span>{chatRoom && chatRoom.description}</span>
                                    </div> */}
                                </div>
                            </Row>
                            <Row>
                                <div style={{display:'flex', alignItems:'center'}}>
                                    <span style={{fontSize:'10px', marginRight:'.3rem'}}>description</span>
                                    <span>{chatRoom && chatRoom.description}</span>
                                </div>
                            </Row>
                        </>
                    }
                    
                    
                    {/* <Row>
                        <Col>
                            <Accordion defaultActiveKey="0">
                                <Card>
                                    <Card.Header style={{padding:'0'}}>
                                        <CustomToggle eventKey="0"><span style={{fontSize:'12px', width:'100%'}}>Description</span></CustomToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>{chatRoom && chatRoom.description}</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                        <Col>
                            <Accordion defaultActiveKey="0">
                                <Card>
                                    <Card.Header style={{padding:'0'}}>
                                        <CustomToggle eventKey="0"><span style={{fontSize:'12px', width:'100%'}}></span></CustomToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            {userPosts && renderUserPosts(userPosts)}
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                    </Row> */}
                </Container>
            </div>
        </>
    );
};

export default MessageHeader;