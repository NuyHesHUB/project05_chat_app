import React from 'react';
import { useSelector } from 'react-redux';

const renderUserPosts = (userPosts) => 
        Object.entries(userPosts)
        .sort((a,b) => b[1].count - a[1].count)
        .map(([key, val], i) => (
            <div key={i}>
                <table style={{width:'100%'}}>
                    <tbody style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                        <tr style={{display:'flex', alignItems:'center'}}>
                            <td>
                                <img
                                    src={val.image}
                                    style={{borderRadius:'25px',width:'20px',height:'20px',marginRight:'5px'}}
                                    alt={val.name}
                                />
                            </td>
                            <td style={{fontSize:'14px'}}>
                                {key}
                            </td>
                        </tr>
                        <tr style={{width:'100%', textAlign:'right'}}>
                                <td style={{fontSize:'13px', display:'inline-block'}}>{val.count} 개</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ))
        /* <div key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 .1rem', marginBottom:'5px', marginTop:'5px'}}>
                <div style={{width:'80px'}}>
                    <img
                        src={val.image}
                        style={{borderRadius:'25px',width:'20px',height:'20px',marginRight:'5px'}}
                        alt={val.name}
                    />
                    <span style={{fontSize:'14px', fontWeight:'bold', marginRight:'10px'}}>{key}</span>
                </div>
                <div style={{}}>
                    <span style={{fontSize:'13px'}}>
                        {val.count} 개
                    </span>
                </div>
            </div> */

const UserPosts = () => {
    const userPosts = useSelector(state => state.chatRoom.userPosts);
    return (
        <div>
            {userPosts && renderUserPosts(userPosts)}
        </div>
    );
};

export default UserPosts;