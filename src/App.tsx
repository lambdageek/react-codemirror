import * as React from 'react';
import './App.css';
import CodeMirror from './components/CodeMirror';
import FancyBoi from './components/FancyBoi';
import 'codemirror/mode/javascript/javascript';

const defaultValue = 'function hello { return "hello!"; }\n';

interface State {
  editorValue: string;
}

class App extends React.Component<{}, State> {
  nop = () => {
    // empty
  }
  constructor(props: {}) {
    super(props);
    this.state = {editorValue: defaultValue};
  }
  pickupChange = (value: string, ) => {
    this.setState({editorValue: value});
  }
  render() {
    const config: CodeMirror.EditorConfiguration = {mode: 'javascript'};
    return (
      <div className="App">
        <div className="AppTop">
          <CodeMirror config={config} value={this.state.editorValue} onChange={this.pickupChange}/>
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
