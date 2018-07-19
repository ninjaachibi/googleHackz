import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  DefaultDraftBlockRenderMap} from 'draft-js';

import * as colors from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import {SwatchesPicker} from 'react-color';
import {Map} from 'immutable';


const myBlocktypes = DefaultDraftBlockRenderMap.merge(new Map({
  center: {
    wrapper: <div className="center-align" />
  },
    right: {
    wrapper: <div className="left-align" />
    }
}))

export default class Documents extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      customStyles: {}
    };
  }

  onChange(editorState) {
    this.setState({
      editorState
    });
  }

  toggleInlineFormat(e, style) {
    e.preventDefault();
    this.setState({
    editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)
    })
  }

  toggleFormat(e, style, block) {
    e.preventDefault();
    if(block) {
      this.setState({
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)
      })
    } else {
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)
    }
  }

// dont forget block
  formatButton({icon, style}) {
    return (
      <RaisedButton
        backgroundColor={
          this.state.editorState.getCurrentInlineStyle().has(style) ?
          colors.red800 :
          colors.red200
        }
        icon={<FontIcon className="material-icons">{icon}</FontIcon>}
        onMouseDown={(e) => this.toggleInlineFormat(style)}
      />
    )
  }

  changeColor(color) {
    let newInlineStyles = Object.assign(
      {},
      this.state.inlineStyles,
      {
        [color.hex]: {
          color: color.hex
        }
      }
    );
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, color.hex)
    });
  }

  openColorPicker(e) {
    this.setState({
      colorPickerOpen: true,
      colorPickerButton: e.target
    });
  }

  closeColorPicker(e) {
    this.setState({
      colorPickerOpen: false
    });
  }

  colorPicker() {
    return (
      <div style={{display: 'inline-block'}}>
        <RaisedButton
          backgroundColor={colors.red200}
          icon={<FontIcon className="material-icons">format_color_text</FontIcon>}
          onClick={this.openColorPicker.bind(this)}
        />
        <Popover
          open={this.state.colorPickerOpen}
          anchorEl={this.state.colorPickerButton}
          anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
          targetOrigin={{vertical: 'top', horizontal: 'left'}}
          onRequestClose={this.closeColorPicker.bind(this)}
          >
            <SwatchesPicker onChangeComplete={this.changeColor.bind(this)} />
          </Popover>
        </div>
      );
    }


    render() {
      return (
        <div>

          <AppBar title="Document Editor" style={{alignItems: 'center'}}>

            <RaisedButton
              icon={<FontIcon className="material-icons">home</FontIcon>}
              onClick={()=>this.props.redirect(DocumentPortal)}
            />
          </AppBar>

          <div className="toolbar">
            {this.formatButton({icon:'format_bold', style:'BOLD'})}
            {this.formatButton({icon:'format_italic', style:'ITALIC'})}
            {this.formatButton({icon:'format_underlined', style: 'UNDERLINE'})}
            {this.formatButton({icon:'format_strikethrough',style: 'STRIKETHROUGH'})}
            {this.colorPicker()}
            {this.formatButton({icon:'format_unordered',style: 'unordered-list-item', block: true})}
            {this.formatButton({icon:'format_ordered',style: 'ordered-list-item', block: true})}
            {this.formatButton({icon:'format_align_left',style: 'unstyled', block: true})}
            {this.formatButton({icon:'format_align_center',style: 'center', block: true})}
            {this.formatButton({icon:'format_align_right',style: 'right', block: true})}
            {this.formatButton({icon:'undo', event: (()=>this.setState({editorState: EditorState.undo(this.state.editorState)}))})}
            {this.formatButton({icon:'redo', event: (()=>this.setState({editorState: EditorState.undo(this.state.editorState)}))})}
          </div>
          <div className="editor">
            <Editor
              ref="editor"
              blockRenderMap={myBlocktypes}
              customStyleMap={this.state.customStyles}
              onChange={this.onChange.bind(this)}
              editorState={this.state.editorState}
            />
          </div>
        </div>
      );
    }
  }
