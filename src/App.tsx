import * as React from 'react';
import './App.css';
import CodeMirror from './components/CodeMirror';

class App extends React.Component {
  render() {
    return (
      <div className="App">
       <CodeMirror/>
      </div>
    );
  }
}

export default App;
