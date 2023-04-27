import React, { useRef } from 'react'

/* React-routet-dom */
import { useNavigate } from "react-router-dom";

/* Redux */
import { useDispatch, useSelector } from 'react-redux';
import { setPhotoURL } from '../../../redux/actions/user_action';

/* React-icons */
import { BsChatRightTextFill } from 'react-icons/bs';

/* Bootstrap */
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';

/* Firebase */
import { getDatabase, ref, /* child, */ update } from "firebase/database";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { getStorage, ref as strRef, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const UserPanel = () => {
    const user = useSelector(state => state.user.currentUser)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const inputOpenImageRef = useRef();

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            navigate("/login");
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    }

    const handleUploadImage = async (event) => {
        const file = event.target.files[0];
        const auth = getAuth();
        const user = auth.currentUser;

        const metadata = { contentType: file.type };
        const storage = getStorage();
        // https://firebase.google.com/docs/storage/web/upload-files#full_example
        try {
            //스토리지에 파일 저장하기 
            let uploadTask = uploadBytesResumable(strRef(storage, `user_image/${user.uid}`), file, metadata)


            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    // eslint-disable-next-line default-case
                    switch (snapshot.state) {
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
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        // 프로필 이미지 수정
                        updateProfile(user, {
                            photoURL: downloadURL
                        })

                        dispatch(setPhotoURL(downloadURL))

                        //데이터베이스 유저 이미지 수정
                        update(ref(getDatabase(), `users/${user.uid}`), { image: downloadURL })
                    });
                }
            );
            // console.log('uploadTaskSnapshot', uploadTaskSnapshot)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            {/* logo */}
            <h1 style={{color:'#ec5990', marginBottom:'1rem', fontSize:'45px'}}>
                <BsChatRightTextFill/>{" "}<div style={{color:'white'}}>Chat App</div>
            </h1>
            <div style={{display:'flex', marginBottom:'1rem', paddingBottom:'1rem', alignItems:'center', justifyContent:'center',borderBottom: '1px solid rgb(79, 98, 148)'}}>
                <Image 
                    src={user && user.photoURL} 
                    /* roundedCircle  */
                    style={{width:'50px', height:'50px', outline:'2px solid rgb(79, 98, 148)', marginRight:'5px', borderRadius:'10px'}}
                />
                
                <Dropdown>
                    <Dropdown.Toggle style={{border:'none', background:'transparent', color:'#ec5990'}} id="dropdown-basic">
                        <span style={{color:'#888'}}>ID :</span>&nbsp;&nbsp;<span style={{color:'#fff', marginRight:'5px'}}>{user && user.displayName}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{border:'3px solid rgb(79, 98, 148)'}}>
                        <Dropdown.Item style={{fontSize:'13px'}} onClick={handleOpenImageRef}>
                            프로필 사진 변경
                        </Dropdown.Item>
                        <Dropdown.Item style={{fontSize:'13px'}} onClick={handleLogout}>
                            로그아웃
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <input
                onChange={handleUploadImage}
                accept="image/jpeg, image/png"
                style={{ display: 'none' }}
                ref={inputOpenImageRef}
                type="file"
            />
        </div>
    );
};

export default UserPanel;