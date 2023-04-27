import React from 'react';

function Message({ message, user }) {

    const isImage = message => {
        return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
    }
    const isMessageMine = (message, user) => {
       if(user) {
           return message.user.id === user.uid
       }
    }

    return (
        <div style={{ marginBottom: '5px', display:'flex'}}>
            <div>
                <img
                style={{
                    width:'40px', 
                    height:'40px', 
                    borderRadius: '10px', 
                    marginRight: '20px', 
                    marginTop:'1px',
                    outline: '1px solid #ECECEC',
                }}
                src={message.user.image}
                alt={message.user.name}
                />
            </div>
            <div style={{
                backgroundColor: isMessageMine(message, user) && "#ECECEC",
                /* minWidth:'200px', */
                maxWidth:'500px',
                borderRadius: '10px',
                padding: '5px 15px'
            }}>
                <h6>{message.user.name}</h6>
                {isImage(message) ?
                    <img style={{ maxWidth: '300px' }} alt="이미지" src={message.image} />
                    :
                    <p style={{margin:'0', fontSize:'14px'}}>
                        {message.content}
                    </p>
                }
            </div>
        </div>
    );
};

export default Message;