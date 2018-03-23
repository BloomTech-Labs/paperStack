import React, { Component } from 'react';
import LandingPage from './components/LandingPage';
import CreateAccount from './components/CreateAccount';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <LandingPage /> */}
        <CreateAccount />
      </div>
    );
  }
}

export default App;
