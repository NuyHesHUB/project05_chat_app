import React, { useState, useRef} from 'react';

/* Redux */
import { useSelector } from 'react-redux';

/* React-icons */
import { BsSend } from 'react-icons/bs';
import { BsUpload } from 'react-icons/bs';

/* Bootstrap */
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/* Firebase */
import { getDatabase, ref, set, remove, push, child } from "firebase/database";
import { getStorage, ref as strRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const MessageForm = () => {
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)
    const [ content, setContent ] = useState("");
    const [ errors, setErrors ] = useState([]);
    
    const [ loading, setLoading ] = useState(false);
    const [ percentage, setPercentage ] = useState(0);

    const typingRef = ref(getDatabase(), "typing");

    const messagesRef = ref(getDatabase(), "messages");

    const inputOpenImageRef = useRef();
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)

    const handleChange = (e) => {
        setContent(e.target.value)
    }
    const createMessage = (fileUrl = null) => {
        const message = {
            timestamp: new Date(),
            user: {
                id: user.uid,
                name: user.displayName,
                image: user.photoURL
            }
        }
        /* console.log('message',message); */
        if (fileUrl !== null) {
            message["image"] = fileUrl;
        } else {
            message["content"] = content;
        }

        return message;
    }

    const handleSubmit = async () => {
        if(!content) {
            setErrors(prev => prev.concat("Type contents first"));
            return;
        }
        setLoading(true);
        console.log('loading',loading);
        //firebase 에서 메시지 저장
        try {
            await set(push(child(messagesRef, chatRoom.id)), createMessage())
            // typingRef.child(chatRoom.id).child(user.uid).remove();
            remove(child(typingRef, `${chatRoom.id}/${user.uid}`));
            await remove(child(typingRef, `${chatRoom.id}/${user.uid}`));
            setLoading(false)
            setContent("")
            setErrors([])
        } catch (error) {
            setErrors(pre => pre.concat(error.message))
            setLoading(false)
            setTimeout(() => {
                setErrors([])
            }, 5000);
        }
    }
    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    }
    
    /*--------------------------------------------*\
                Firebase 이미지 업로드 경로
    \*--------------------------------------------*/
    
    //Firebase file 업로드 경로 2가지로 변경 isPrivateChatRoom 일 때 /private 경로 그게 아니라면 (일반 ChatRoom) 일 때 public 경로
    const getPath = () => {
        if (isPrivateChatRoom) {
            return `/message/private/${chatRoom.id}`
        } else {
            return `/message/public`
        }
    }
    
    const handleUploadImage = (event) => {
        const file = event.target.files[0];
        const storage = getStorage();

        const filePath = `${getPath()}/${file.name}`;
        console.log('filePath', filePath);
        const metadata = { contentType: file.type }
        setLoading(true)

        try {
            // https://firebase.google.com/docs/storage/web/upload-files#full_example
            // Upload file and metadata to the object 'images/mountains.jpg'
            const storageRef = strRef(storage, filePath);
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);

            uploadTask.on('state_changed',
                UploadTaskSnapshot => {
                    const percentage = Math.round((UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100);

                    setPercentage(percentage);
                    
                    console.log('Upload is ' + percentage + '% done');

                    // eslint-disable-next-line default-case
                    switch (UploadTaskSnapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    // eslint-disable-next-line default-case
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                        // console.log('File available at', downloadURL);
                        set(push(child(messagesRef, chatRoom.id)), createMessage(downloadURL))
                        setLoading(false)
                    });
                }
            );
        } catch (error) {
            console.log(error)
        }
    }
    
    /*--------------------------------------------*\
                onKeyDown 이벤트 함수
    \*--------------------------------------------*/
    const handleKeyDown = (event) => {
        /* let change = !event.nativeEvent.isComposing */
        /* console.log('event.keyCode', event.keyCode); */
        console.log('isComposing',event.nativeEvent.isComposing);
        /* if (event.nativeEvent.isComposing === true) { 	   
            console.log('이즈커밍');
            return;
        } */
        if (event.keyCode === 13 && event.ctrlKey) {
            return;
        }else if(event.keyCode === 13){
            event.preventDefault();
            /* event.nativeEvent.isComposing = false; */
            handleSubmit();
        }
        if(content) {
            /*  typingRef.child(chatRoom.id).child(user.uid).set(user.displayName) */
            /* console.log('chatRoom.id',chatRoom.id); */
            /* console.log('user.uid',user.uid); */
            /* console.log('user.displayName',user.displayName); */
            /* set(push(child(typingRef, `${chatRoom.id}/${user.uid}`)), user.displayName) */
            /* set((child(typingRef, `${chatRoom.id}/${user.uid}`)), user.displayName) */
            /* push((child(typingRef, `${chatRoom.id}/${user.uid}`)), user.displayName) */
            set(child(typingRef, `${chatRoom.id}/${user.uid}`), user.displayName)
        }else {
            /* typingRef.child(chatRoom.id).child(user.uid).remove(); */
            remove(child(typingRef, `${chatRoom.id}/${user.uid}`))
        }
        
        /* const userUid = user.uid;
        if (content) {
            set(ref(getDatabase(), `typing/${chatRoom.id}/${user.uid}`), {
                userUid: user.displayName
            })
        } else {
            remove(ref(getDatabase(), `typing/${chatRoom.id}/${user.uid}`))
        } */
    }



    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                        key='unique'
                        as="textarea"
                        onKeyDown={handleKeyDown}
                        value={content}
                        onChange={handleChange}
                        rows={1}
                        placeholder="메시지를 입력해주세요"
                        style={{
                            outline:'none',
                            border: '.1rem solid #ececec',
                        }}
                    />
                </Form.Group>
            </Form>
            
            {
                !(percentage === 0 || percentage === 100) &&
                <ProgressBar striped variant="danger" label={`${percentage}%`} now={percentage}  />
            }

            <div>
                {errors.map(errorMsg => <p style={{color:'red'}} key={errorMsg}>
                    {errorMsg}
                </p>)}
            </div>
            
            <Row>
                <Col>
                    <button
                        onClick={handleSubmit}
                        disabled={loading ? true : false}
                        style={{
                            width: '100%',
                            color: '#fff',
                            marginTop: '20px',
                            padding: '15px',
                            border: 'none',
                            fontSize: '16px',
                            background: '#ec5990',
                            borderRadius: '10px'
                        }}
                    >
                        <BsSend/> Send
                    </button>
                </Col>
                <Col>
                    <button
                        onClick={handleOpenImageRef}
                        disabled={loading ? true : false}
                        style={{
                            width: '100%',
                            color: '#fff',
                            marginTop: '20px',
                            padding: '15px',
                            border: 'none',
                            fontSize: '16px',
                            background: '#0e101c',
                            borderRadius: '10px'
                        }}
                    >
                        <BsUpload/> Upload
                    </button>
                </Col>
            </Row>
            <input 
                accept='image/jpeg, image/png'
                style={{display:'none'}}
                type="file" 
                ref={inputOpenImageRef}
                onChange={handleUploadImage}
            />
        </div>
    );
};

export default MessageForm;