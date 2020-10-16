import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

import io from 'socket.io-client';

const Chat = (props) => {
    const { nickName } = props.location.state;

    const [UserState, setUserState] = useState({ name: nickName, msg: '' });
    const [Chat, setChat] = useState([]);
    const [CurrentUsersNumber, setCurrentUsersNumber] = useState(0);
    const [UserList, setUserList] = useState([]);

    const chatRef = useRef();
    const userListRef = useRef();
    const userListButtonRef = useRef();
    const socketRef = useRef();

    useEffect(() => {
        // dev
        socketRef.current = io.connect('http://localhost:3001');
        // production
        //socketRef.current = io.connect('http://domainname');

        socketRef.current.emit('login', UserState.name);
        return () => {
            socketRef.current.disconnect();
        }
    }, [UserState.name])

    useEffect(() => {
        socketRef.current.on('send msg', ({ name, msg }) => {
            setChat([...Chat, {name, msg}]);
            scrollToBottom();
        });
        return () => {
            socketRef.current.off('send msg');
        };
    });

    useEffect(() => {
        socketRef.current.on('new user', ({nickname, chatUsersNumber, currentUsers}) => {
            setCurrentUsersNumber(chatUsersNumber);
            setUserList(currentUsers);
            const name = 'new user';
            const msg = `${nickname} joined!`;
            setChat([...Chat, {name, msg}]);
        });
        return () => {
            socketRef.current.off('new user');
        };
    });

    useEffect(() => {
        socketRef.current.on('user exit', ({ exitedUserName, chatUsersNumber, currentUsers }) => {
            setCurrentUsersNumber(chatUsersNumber);
            setUserList(currentUsers);
            const name = 'user exit';
            const msg = `${exitedUserName} exited.`;
            setChat([...Chat, {name, msg}]);
        });
        return () => {
            socketRef.current.off('user exit');
        };
    });

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    });

    const handleClickOutside = (e) => {
        if(!userListButtonRef.current.contains(e.target)) {
            userListRef.current.style.display = "none";
        }
    };

    const handleClickInside = () => {
        userListRef.current.style.display = "block";
    }

    const renderChat = () => {
        return Chat.map(({name, msg}, index) => {
            if (name === 'new user') {
                return (
                    <div key={index} className="new-user-log">
                        <h4>{msg}</h4>
                    </div>
                )
            } else if (name === 'user exit') {
                return (
                    <div key={index} className="user-exit-log">
                        <h4>{msg}</h4>
                    </div>
                )
            } else {
                if(name === UserState.name) {
                    return (
                        <div key={index} className="self-log">
                            <h3>{msg}</h3>    
                        </div>
                    )
                }

                return (
                    <div key={index}>
                        <h3>{name}: {msg}</h3>
                    </div>
                )
            }
        });
    };

    const renderUserList = () => {
        return UserList.map(({ id, userName }) => {
            return (
                <ul key={id}>{userName}</ul>
            )
        })
    }

    const scrollToBottom = () => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-title-box">
                <span>Chat2</span>
            </div>
            <div className="chat-nickname-box">
                <input readOnly="true" type="text" value={UserState.name} placeholder="..."
                    onChange={(e) => {
                        setUserState({...UserState, name: e.target.value});
                }} />
                <span>{CurrentUsersNumber} people here!</span>
                <button ref={userListButtonRef} type="button" onClick={handleClickInside}>
                    info
                    <div className="user-list" ref={userListRef}>
                        {renderUserList()}
                    </div>
                </button>
                
            </div>
            <div className="chat-log-box" ref={chatRef}>
                {renderChat()}
            </div>
            <div className="chat-send-box">
                <form onSubmit={(e) => {
                    const { name, msg } = UserState;
                    e.preventDefault();
                    socketRef.current.emit('send msg', {name, msg});
                    setUserState({...UserState, msg: ''});
                }}>
                    <input type="text" value={UserState.msg} placeholder="Type message..."
                     onChange={(e) => {
                        setUserState({...UserState, msg: e.target.value});
                    }} />
                    <button type="submit" disabled={!UserState.msg} style={UserState.msg ? {backgroundColor:"#32e0c4"} : {backgroundColor:"white"}}>Send</button>
                </form>
            </div>
        </div>
    );
}


export default Chat;