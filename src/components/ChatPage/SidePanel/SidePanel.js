import React from 'react';
import UserPanel from './UserPanel';
import Favorited from './Favorited';
import ChatRooms from './ChatRooms';
import DirectMessages from './DirectMessages';

const SidePanel = () => {
    return (
        <div style={{
            backgroundColor: "#0e101c",
            padding:'2rem',
            minHeight:'100vh',
            color:'white',
            minWidth:'275px',
            /* position:'relative' */
        }}>
            <UserPanel/>
            <Favorited/>
            <ChatRooms/>
            <DirectMessages/>
        </div>
    );
};

export default SidePanel;