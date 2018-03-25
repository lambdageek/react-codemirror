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

type DocRenderChild = (itf: CodeMarkItf) => React.ReactNode;

export interface Props {
    config: CM.EditorConfiguration;
    value: string;
    onChange?: ChangeEventHandler;
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

// stuff the parent passes down
export interface CodeMarkItf {
    reapplyMark: (newMark: ApplyMark, forceUpdate?: boolean) => void;
    needsNewMark: (oldApplyMark: ApplyMark|undefined, applyMark: ApplyMark) => boolean;
}
export interface CodeMarkProps {
    itf: CodeMarkItf;
    applyMark?: ApplyMark;
}

export class CodeMark extends React.Component<CodeMarkProps, {}> {
    componentDidMount() {
        const itf = this.props.itf;
        if (this.props.applyMark) {
            itf.reapplyMark (this.props.applyMark, true); 
        }
    }
    componentWillReceiveProps(nextProps: CodeMarkProps) {
        if (nextProps.applyMark !== undefined) {
            console.log ('new props have mark');
            if (this.props.itf.needsNewMark (this.props.applyMark, nextProps.applyMark)) {
                console.log ('needs new marker');
                this.props.itf.reapplyMark (nextProps.applyMark);
            }
        }    
    }
    componentWillUnmount() {
        // empty
    }
    render() {
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

    getChildItf: () => CodeMarkItf = () => {
        return {
            reapplyMark: this.reapplyMark,
            needsNewMark: this.needsNewMark,
        };
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
        }
    }

    componentWillUnmount () {
        // nothing
        if (this.codeMirrorEditor) {
            const ed = this.codeMirrorEditor;
            ed.off ('change', this.receiveEditorChange);
            ed.toTextArea ();
            this.codeMirrorEditor = null;
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
                    {this.props.children && asDocRenderChild (this.props.children) (this.getChildItf())}
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
        }
    }

    reapplyMark = (oneMark: ApplyMark, forceUpdate?: boolean) => {
        const ed = this.codeMirrorEditor;
        if (ed) {
            const doc = ed.getDoc ();
            const oldMark = this.setMarkyMark (makeMark (doc, oneMark));
            if (oldMark) {
                oldMark.clear ();
            }
        }
        if (forceUpdate) {
            this.forceUpdate ();
        }
    }
    needsNewMark = (oldMark: ApplyMark | undefined, newMark: ApplyMark) => {
        return (oldMark !== newMark ||
                (this.state && this.state.markyMark === undefined) ||
                !sameMarkRange (((this.state && this.state.markyMark) ?
                                 findMark (this.state.markyMark) 
                                 : undefined),
                                newMark));
    }

    setMarkyMark = (newMarkyMark: CM.TextMarker) => {
        const oldMark = this.state && this.state.markyMark;
        this.setState ({markyMark: newMarkyMark});
        return oldMark;
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