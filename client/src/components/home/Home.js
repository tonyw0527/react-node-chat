import React, { useState } from 'react';
import './Home.css';
import { useHistory } from 'react-router-dom';

const Home = () => {

    const history = useHistory();
    
    const [NickName, setNickName] = useState('');

    return (
        <div className="home-wrapper">
            <div>
                <span>Set your nickname</span>
            </div>
            <div>
                <input type="text" maxLength="9" placeholder="Type your name..." value={NickName} onChange={(e) => {setNickName(e.target.value)}} />

                <button disabled={!NickName} type="button" onClick={() => {
                    history.push('/chat', { nickName: NickName });
                }}>Go Chat!</button>
            </div>
            
        </div>
    );
}

export default Home;