import * as React from 'react';
import './CodeMirror.css';
import * as CM from 'codemirror';
import 'codemirror/lib/codemirror.css';
import * as _ from 'lodash';

export type ChangeEventHandler = (value: string, change: CM.EditorChangeLinkedList) => void;

interface FromToPos {
    from: CM.Position;
    to: CM.Position;
}

export interface ApplyMark extends FromToPos {
    options?: CM.TextMarkerOptions;
}

type DocRenderChild = (doc: CM.Doc | null) => React.ReactNode;

export interface Props {
    config: CM.EditorConfiguration;
    value: string;
    onChange?: ChangeEventHandler;
    oneMark?: ApplyMark;
    children?: DocRenderChild;
}

function asDocRenderChild (x: {}): DocRenderChild {
    return x as DocRenderChild;
}

export interface State {
    markyMark?: CM.TextMarker;
}

export {EditorConfiguration, EditorChange, EditorChangeLinkedList,
        Position, TextMarkerOptions} from 'codemirror';

export interface CodeMarkProps {
    doc: CM.Doc;
}

export class CodeMark extends React.Component<CodeMarkProps, {}> {
    render () {
        return null;
    }
}

export class CodeMirror extends React.Component<Props, State> {
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

    getDoc = () => {
        if (this.codeMirrorEditor) {
            return this.codeMirrorEditor.getDoc();
        } else {
            return null;
        }
    }
    componentDidMount() {
        if (this.textAreaElement) {
            const cmConfig: CM.EditorConfiguration = {
                mode: this.props.config.mode,
            };
            const ed = CM.fromTextArea (this.textAreaElement, cmConfig);
            this.codeMirrorEditor = ed;
            ed.setValue(this.props.value);
            ed.on ('change', this.receiveEditorChange);
            if (this.props.oneMark) {
                this.applyOneMark (ed, this.props.oneMark);
            }
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
        console.log ('rendering cm');
        return (
            <div>
                <div className="CodeMirror-holder">
                    <textarea ref={this.setTextArea} readOnly={true}/>
                </div>
                <div className="CodeMirror-markholder">
                    {this.props.children && asDocRenderChild (this.props.children) (this.getDoc())}
                </div>
            </div>
        );
    }

    /* Borrowed this from https://github.com/JedWatson/react-codemirror/blob/master/src/Codemirror.js
    */
    componentWillMount () {
        this.componentWillReceiveProps = _.debounce(this.componentWillReceiveProps, 0);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.codeMirrorEditor) {
            console.log ('new props');
            const ed = this.codeMirrorEditor;
            if (nextProps.value !== undefined &&
                nextProps.value !== this.props.value &&
                this.codeMirrorEditor.getValue() !== nextProps.value) {
                    ed.setValue(nextProps.value);
            }
            if (nextProps.oneMark !== undefined) {
                console.log ('new props have mark');
                if (this.props.oneMark !== nextProps.oneMark ||
                    (this.state.markyMark === undefined ||
                     !sameMarkRange (findMark (this.state.markyMark), nextProps.oneMark))) {
                    console.log ('new mark');
                    const oldMark = this.state.markyMark;
                    this.applyOneMark (ed, nextProps.oneMark);
                    if (oldMark) {
                        console.log ('clearing old mark');
                        oldMark.clear();
                    }
                }
            }
        }
    }

    applyOneMark = (ed: CM.EditorFromTextArea, oneMark: ApplyMark) => {
        console.log ('applying one mark');
        const newMark = makeMark(ed.getDoc (), oneMark);
        this.setState ({markyMark: newMark});
    }
}

function makeMark (doc: CM.Doc, mark:  ApplyMark): CM.TextMarker {
    return doc.markText (mark.from, mark.to, mark.options);
}

function findMark (mark: CM.TextMarker): FromToPos|undefined {
    const a = mark.find();
    /* @types/codemirror has Range as the return type of TextMarker.find,
     * but Range has from as a funtion type () => Position, when in reality
     * it appears to be just a normal position.
     */
    return a as {} as FromToPos|undefined;
}

function sameMarkRange (oldMark: FromToPos|undefined, newMark: FromToPos): boolean {
    if (oldMark) {
        return (samePosition (oldMark.from, newMark.from) &&
                samePosition (oldMark.to, newMark.to));
    } else {
        return false;
    }
}

function samePosition (p1: CM.Position, p2: CM.Position): boolean {
    return p1.line === p2.line && p1.ch === p2.ch;
}