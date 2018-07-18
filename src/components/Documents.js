import React from 'react';
import {Editor, EditorState, RichUtils, convertFromRaw} from 'draft-js';
import DocumentPortal from './DocumentPortal'

const styleMap = {
  'UPPERCASE': {
    textTransform: 'uppercase'
  },
  'LOWERCASE': {
    textTransform: 'lowercase'
  }
}


export default class Documents extends React.Component {

  myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'right') {
      return 'align-right';
    }
    if (type === 'center') {
      return 'align-center'
    }
    if (type === 'left') {
      return 'align-left'
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    this.onChange = (editorState) => this.setState({editorState})
  }


  toggleInlineStyle(event,inlineStyle) {
    event.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
  }

  toggleBlockType(event, blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }


  render() {
    return (
      <div id="content">
        <h1>Document Editor </h1>
        <button onClick={()=>this.props.redirect(DocumentPortal)}>Back to Document Portal</button>

      <div className="editor">

        <div className="toolbar">
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'BOLD')}>Bold</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'ITALIC')}>Italic</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UNDERLINE')}>Underline</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'STRIKETHROUGH')}>Strikethrough</button>

            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UPPERCASE')}>Uppercase</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'LOWERCASE')}>Lowercase</button>

            <button onMouseDown={(e) => this.toggleBlockType(e, 'unordered-list-item')}>Unordered List</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'ordered-list-item')}>Ordered List</button>

            <button onMouseDown={(e) => this.toggleBlockType(e, 'header-one')}>H1</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'header-two')}>H2</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'header-three')}>H3</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'header-four')}>H4</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'header-five')}>H5</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'header-six')}>H6</button>

            <button onMouseDown={() => this.toggleBlockType(this.state.editorState, 'left')}>Left</button>
            <button onMouseDown={() => this.toggleBlockType(this.state.editorState, 'center')}>Center</button>
            <button onMouseDown={() => this.toggleBlockType(this.state.editorState, 'right')}>Right</button>

            <button onMouseDown={()=>this.setState({editorState: EditorState.undo(this.state.editorState)})}>Undo</button>
            <button onMouseDown={()=>this.setState({editorState: EditorState.redo(this.state.editorState)})}>Redo</button>




        </div>
        <Editor
          editorState={this.state.editorState}
          customStyleMap={styleMap}
          onChange={this.onChange}
          blockStyleFn={this.myBlockStyleFn}
        />

      </div>

      </div>
    );
  }
}
