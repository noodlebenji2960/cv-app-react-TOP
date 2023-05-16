import './App.css';
import React, {Component} from 'react';
import General from './components/General.js';
import Education from './components/Education.js'
import Practical from './components/Practical.js'

class App extends Component {


  render() {
    
    return (
      <div>
        <General/>
        <Education/>
        <Practical/>
      </div>
    );
  }
}

export default App;