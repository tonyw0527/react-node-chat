import React from 'react';
import './App.css';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Chat from './components/chat/Chat';

const App = () => {

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/chat" component={Chat} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
