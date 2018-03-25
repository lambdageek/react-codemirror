import * as React from 'react';
import './CodeMirror.css';
import * as CM from 'codemirror';
import 'codemirror/lib/codemirror.css';
import * as _ from 'lodash';

export type ChangeEventHandler = (value: string, change: CM.EditorChangeLinkedList) => void;

export interface Props {
    config: CM.EditorConfiguration;
    value: string;
    onChange?: ChangeEventHandler;

}

export {EditorConfiguration, EditorChange, EditorChangeLinkedList} from 'codemirror';

export default class CodeMirror extends React.Component<Props> {
    textAreaElement: HTMLTextAreaElement | null = null;
    codeMirrorEditor: CM.EditorFromTextArea | null = null;
    setTextArea = (elt: HTMLTextAreaElement | null) => {
        this.textAreaElement = elt;
    }

    receiveEditorChange = (instance: CM.Editor, change: CM.EditorChangeLinkedList) => {
        if (this.props.onChange) {
            const s = instance.getValue();
            this.props.onChange (s, change);
        }
    }

    componentDidMount() {
        if (this.textAreaElement) {
            const cmConfig: CM.EditorConfiguration = {mode: this.props.config.mode};
            const ed = CM.fromTextArea (this.textAreaElement, cmConfig);
            this.codeMirrorEditor = ed;
            ed.on ('change', this.receiveEditorChange);
        }
    }

    componentWillUnmount () {
        // nothing
        if (this.codeMirrorEditor) {
            const ed = this.codeMirrorEditor;
            ed.off ('change', this.receiveEditorChange);
            ed.toTextArea ();
        }
    }
    render () {
        return (
            <div className="CodeMirror-holder">
              <textarea ref={this.setTextArea} value={this.props.value} readOnly={true}/>
            </div>
        );
    }

    /* Borrowed this from https://github.com/JedWatson/react-codemirror/blob/master/src/Codemirror.js
    */
    componentWillMount () {
        this.componentWillReceiveProps = _.debounce(this.componentWillReceiveProps, 0);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.codeMirrorEditor && nextProps.value !== undefined &&
            nextProps.value !== this.props.value &&
            this.codeMirrorEditor.getValue() !== nextProps.value) {
                const ed = this.codeMirrorEditor;
                ed.setValue(nextProps.value);
        }
    }
}