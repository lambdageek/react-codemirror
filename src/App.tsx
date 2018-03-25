import * as React from 'react';
import './App.css';
import FancyBoi from './components/FancyBoi';
import 'codemirror/mode/javascript/javascript';
import * as CodeMirror from './components/CodeMirror';

const defaultValue = 'function hello { return "hello!"; }\n';

interface State {
  editorValue: string;
  whereMark: CodeMirror.ApplyMark;
}
const defaultWhereMark: CodeMirror.ApplyMark = {
  from: {line: 0, ch: 9},
  to: {line: 0, ch: 14},
  options: {className: 'salty-marker', title: 'Salty Boi'}
};

class App extends React.Component<{}, State> {
  nop = () => {
    // empty
  }
  constructor(props: {}) {
    super(props);
    this.state = {
      editorValue: defaultValue, 
      whereMark: defaultWhereMark
    };
  }
  pickupChange = (value: string, change: CodeMirror.EditorChangeLinkedList) => {
    this.setState({editorValue: value});
    
  }
  render() {
    const config: CodeMirror.EditorConfiguration = {mode: 'javascript'};
    return (
      <div className="App">
        <div className="AppTop">
          <CodeMirror.CodeMirror
           config={config}
           value={this.state.editorValue}
           onChange={this.pickupChange}
          >
           {(itf) => <CodeMirror.CodeMark itf={itf} applyMark={this.state.whereMark}/>}
          </CodeMirror.CodeMirror>
        </div>
        <div className="FancyBois">
          <FancyBoi>
            <button type="button" onClick={this.nop}>Click Me</button>
          </FancyBoi> 
          {' '}
          <FancyBoi style={{fontStyle: 'italic'}}>
            <button type="button" onClick={this.nop}>And Me</button>
          </FancyBoi>
          {' '}
          <FancyBoi>
            <span>Today's soup is trout ala creme: {this.state.editorValue.length}.</span>
          </FancyBoi>
        </div>
      </div>
    );
  }
}

export default App;
