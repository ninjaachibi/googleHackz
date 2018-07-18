import React from 'react';
import {Editor, EditorState, RichUtils, convertFromRaw} from 'draft-js';
import ColorPicker, { colorPickerPlugin } from 'draft-js-color-picker';
import createStyles from 'draft-js-custom-styles';
import DocumentPortal from './DocumentPortal'; 



const styleMap = {
  'UPPERCASE': {
    textTransform: 'uppercase'
  },
  'LOWERCASE': {
    textTransform: 'lowercase'
  }
}

const presetColors = [
  '#ff00aa',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#B8E986',
  '#000000',
  '#4A4A4A',
  '#9B9B9B',
  '#FFFFFF',
];

const {styles,customStyleFn } = createStyles(['font-size'])

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
    this.getEditorState = () => this.state.editorState;
    this.picker = colorPickerPlugin(this.onChange, this.getEditorState);
    this.updateEditorState = editorState => this.setState({ editorState });
    this.toggleFontSize = this.toggleFontSize.bind(this);
  }

  onChange(editorState) {
    this.setState({editorState});
  }

  toggleFontSize(fontSize) {
    console.log(fontSize);
    const newEditorState = styles.fontSize.toggle(this.state.editorState, fontSize);
    console.log(newEditorState);
    return this.updateEditorState(newEditorState);
  }

  toggleInlineStyle(event,inlineStyle) {
    event.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
  };

  toggleBlockType(event, blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  };


  render() {

    const options = x => x.map(fontSize => {
          return <option key={fontSize} value={fontSize}>{fontSize}</option>;
        });

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

            <select onChange={e => this.toggleFontSize(e.target.value)}>
            {options(['6px', '8px', '10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '34px', '36px', '50px', '72px'])}
            </select>

          </div>

          <ColorPicker
            toggleColor={color => this.picker.addColor(color)}
            presetColors={presetColors}
            color={this.picker.currentColor(this.state.editorState)}
          />

          <Editor
            editorState={this.state.editorState}
            customStyleMap={styleMap}
            onChange={(e) => this.onChange(e)}
            blockStyleFn={this.myBlockStyleFn}
            customStyleFn={this.picker.customStyleFn}
          />

        </div>

      </div>
    );
  }
}
