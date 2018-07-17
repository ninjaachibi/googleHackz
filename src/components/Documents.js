import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';


const styleMap = {
  'UPPERCASE': {
    textTransform: 'uppercase'
  },
  'LOWERCASE': {
    textTransform: 'lowercase'
  }
}


export default class Documents extends React.Component {

  constructor(props) {
    super(props);
    this.state={editorState: EditorState.createEmpty() };
    this.onChange = (editorState) => this.setState({editorState})
  }


  toggleInlineStyle(event,inlineStyle) {
    event.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
  }

  toggleBlockType(event, blockType) {
    event.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  render() {
    return (
      <div id="content">
        <h1>Document Editor </h1>

      <div className="editor">

        <div className="toolbar">
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'BOLD')}>B</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'ITALIC')}>I</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UNDERLINE')}>U</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'STRIKETHROUGH')}>S</button>

            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UPPERCASE')}>ABC</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'LOWERCASE')}>xyz</button>

            <button onMouseDown={(e) => this.toggleBlockType(e, 'unordered-list-item')}>Unordered List</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'ordered-list-item')}>Ordered List</button>

            <button onMouseDown={(e) => this.toggleBlockType(e, 'header-one')}>H1</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'header-two')}>H2</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'header-three')}>H3</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'header-four')}>H4</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'header-five')}>H5</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'header-six')}>H6</button>


        </div>
        <Editor editorState={this.state.editorState} customStyleMap={styleMap} onChange={this.onChange} />

      </div>

      </div>
    );
  }
}
