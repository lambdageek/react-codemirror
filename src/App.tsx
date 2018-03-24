import * as React from 'react';
import './App.css';
import CodeMirror from './components/CodeMirror';
import 'codemirror/mode/javascript/javascript';

const defaultValue = 'function hello { return "hello!"; }\n';

class App extends React.Component {
  render() {
    const config: CodeMirror.EditorConfiguration = {mode: 'javascript'};
    return (
      <div className="App">
       <CodeMirror config={config} value={defaultValue}/>
      </div>
    );
  }
}

export default App;
