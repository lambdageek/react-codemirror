import * as React from 'react';
import './CodeMirror.css';
import * as CM from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

const defaultValue = 'function hello { return "hello"; }\n';
                                  
export default class CodeMirror extends React.Component {
    textAreaElement: HTMLTextAreaElement | null = null;
    codeMirrorEditor: CM.EditorFromTextArea | null = null;
    setTextArea = (elt: HTMLTextAreaElement | null) => {
        this.textAreaElement = elt;
    }
    componentDidMount() {
        if (this.textAreaElement) {
            this.codeMirrorEditor =
                CM.fromTextArea (this.textAreaElement,
                                 {mode: 'javascript'});
        }
    }

    componentWillUnmount () {
        // nothing
        if (this.codeMirrorEditor) {
            this.codeMirrorEditor.toTextArea ();
        }
    }
    render () {
        return (
            <div className="CodeMirror-holder">
              <textarea ref={this.setTextArea} value={defaultValue}/>
            </div>
        );
    }
}