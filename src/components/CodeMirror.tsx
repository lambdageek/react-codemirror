import * as React from 'react';
import './CodeMirror.css';
import * as CM from 'codemirror';
import 'codemirror/lib/codemirror.css';

export interface Props {
    config: CM.EditorConfiguration;
    value: string;
}

export {EditorConfiguration} from 'codemirror';

export default class CodeMirror extends React.Component<Props> {
    textAreaElement: HTMLTextAreaElement | null = null;
    codeMirrorEditor: CM.EditorFromTextArea | null = null;
    setTextArea = (elt: HTMLTextAreaElement | null) => {
        this.textAreaElement = elt;
    }
    componentDidMount() {
        if (this.textAreaElement) {
            const cmConfig: CM.EditorConfiguration = {mode: this.props.config.mode};
            const ed = CM.fromTextArea (this.textAreaElement, cmConfig);
            this.codeMirrorEditor = ed;
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
              <textarea ref={this.setTextArea} value={this.props.value}/>
            </div>
        );
    }
}