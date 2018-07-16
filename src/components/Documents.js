import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';


export default class Documents extends React.Component {

  constructor(props) {
    super(props);
    this.state={editorState: EditorState.createEmpty() };
    this.onChange = (editorState) => this.setState({editorState})
  }

  toggleInlineStyle(e,inlineStyle) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
  }

  render() {
    return (
      <div id="content">
        <h1>Document Editor </h1>

      <div className="editor">

        <div className="toolbar">
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'BOLD')}>Bold</button>
        </div>
        <Editor editorState={this.state.editorState} onChange={this.onChange} />

      </div>

      </div>
    );
  }
}
