import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  ContentState,
  DefaultDraftBlockRenderMap} from 'draft-js';

  import * as colors from 'material-ui/styles/colors';
  import AppBar from 'material-ui/AppBar';
  import FontIcon from 'material-ui/FontIcon';
  import RaisedButton from 'material-ui/RaisedButton';
  import Popover from 'material-ui/Popover';
  import {SwatchesPicker} from 'react-color';
  import {Map} from 'immutable';
  import DropDownMenu from 'material-ui/DropDownMenu';
  import MenuItem from 'material-ui/MenuItem';
  import DocumentPortal from './DocumentPortal';
  import History from  './History'

  const myBlocktypes = DefaultDraftBlockRenderMap.merge(new Map({
    center: {
      wrapper: <div className="center-align" />
    },
    right: {
      wrapper: <div className="right-align" />
    }
  }))

export default class Document extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      inlineStyles: {},
      title: this.props.options.title,
      search: ''
    };
    this.docId = this.props.options.docId;
    this.socket = this.props.socket;
    this.onChange = this.onChange.bind(this);
    this.generateDecorator = this.generateDecorator.bind(this);
    this.findWithRegex = this.findWithRegex.bind(this);
    this.SearchHighlight = this.SearchHighlight.bind(this);
  }

  componentDidMount () {
    let self = this;
    this.socket.emit('openDocument', {docId: this.docId, user: this.props.user }, (res) => {
      console.log('res is ', res);
      //set initial state of document with res
      if(res.doc.content.length > 1 ) {
        let raw = res.doc.content[res.doc.content.length - 1]
        let contentState = convertFromRaw(raw);
        self.setState({editorState: EditorState.createWithContent(contentState)});
        console.log('loaded saved document');
      }
    })

    this.socket.on('syncContent', async(data) => {
      console.log('hear change from other socket', data);

      let cursor = self.state.editorState.getSelection();
      // console.log('current selection state is', cursor);
      let contentState = convertFromRaw(data);
      // console.log('contentState is', contentState);
      let editorState = EditorState.forceSelection(EditorState.createWithContent(contentState), cursor);
      await this.setState({editorState: editorState});
    })
  }

  componentWillUnmount () {
    this.socket.emit('closeDocument', {docId: this.docId, user: this.props.user })
  }

  async onChange(editorState) {
    await this.setState({editorState});

    let contentState = editorState.getCurrentContent();
    let raw = convertToRaw(contentState)
    // console.log(raw);
    this.socket.emit('syncContent', {raw, docId: this.docId})
  }

  onSave() {
    let contentState = this.state.editorState.getCurrentContent();
    let raw = convertToRaw(contentState)
    this.socket.emit('saveDocument', {raw, docId: this.docId})
  }



    toggleFormat(e, style, block) {
      e.preventDefault();
      if (block) {
        this.setState({
          editorState: RichUtils.toggleBlockType(this.state.editorState, style)
        })
      } else {
        this.setState({
          editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)
        })
      }
    }


    formatButton({ icon, style, block }) {
      return (
        <RaisedButton
          className="button"
          backgroundColor={
            this.state.editorState.getCurrentInlineStyle().has(style) ?
            colors.red800 :
            colors.red200
          }
          onMouseDown={e => this.toggleFormat(e, style, block)}
          icon={<FontIcon className="material-icons">{icon}</FontIcon>}
        />
      )
    }

    changeColor(color) {
      const newInlineStyles = Object.assign(
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
            style={{width: '50px', height: '100px'}}
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
            <SwatchesPicker className="button" onChangeComplete={this.changeColor.bind(this)} />
            </Popover>
          </div>
        );
      }

      changeFontSize(e, key, value) {
        let newInlineStyles = Object.assign(
          {},
          this.state.inlineStyles,
          {
            [value]: {
              fontSize: value
            }
          }
        );
        this.setState({
          editorState: RichUtils.toggleInlineStyle(this.state.editorState, String(value)),
          fontSize: value,
          inlineStyles: newInlineStyles
        })
      }

    onChangeSearch(e){
      const search = e.target.value;
      this.setState({
        search,
        editorState: EditorState.set(this.state.editorState, { decorator: this.generateDecorator(search) }),
      });
    }

    // highlightSearch(){
    //     console.log('search', this.state.searchInput);
    //   }


     generateDecorator(highlightTerm)  {
      const regex = new RegExp(highlightTerm, 'g');
      return new CompositeDecorator([{
        strategy: (contentBlock, callback) => {
          if (highlightTerm !== '') {
            this.findWithRegex(regex, contentBlock, callback);
          }
        },
        component: this.SearchHighlight,
      }])
    }

     findWithRegex(regex, contentBlock, callback) {
      const text = contentBlock.getText();
      let matchArr, start, end;
      while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        end = start + matchArr[0].length;
        callback(start, end);
      }
    }

   SearchHighlight(props) {
     console.log('serachhighlight', props)
    return <span style={{backgroundColor: "yellow"}}>{props.children}</span>
  }


    fontSize() {
        return (
          <DropDownMenu className="button"
            value={this.state.fontSize}
            onChange={this.changeFontSize.bind(this)}
            >
              <MenuItem value={8} primaryText="8" />
              <MenuItem value={10} primaryText="10" />
              <MenuItem value={12} primaryText="12" />
              <MenuItem value={14} primaryText="14" />
              <MenuItem value={16} primaryText="16" />
              <MenuItem value={18} primaryText="18" />
              <MenuItem value={20} primaryText="20" />
              <MenuItem value={22} primaryText="22" />
              <MenuItem value={24} primaryText="24" />
              <MenuItem value={36} primaryText="36" />
              <MenuItem value={48} primaryText="48" />
              <MenuItem value={52} primaryText="52" />
            </DropDownMenu>
          )
        }

        // changeHeaderSize(e, key, value) {
        //   let newInlineStyles = Object.assign(
        //     {},
        //     this.state.inlineStyles,
        //     {
        //       [value]: {
        //         headerSize: value
        //       }
        //     }
        //   );
        //   this.setState({
        //     editorState: RichUtils.toggleInlineStyle(this.state.editorState, value),
        //     inlineStyles: newInlineStyles
        //   })
        // }
        //
        // headerSize() {
        //   return(
        //     <DropDownMenu
        //       value={this.state.headerSize}
        //       onChange={this.changeFontSize.bind(this)}
        //       >
        //         <MenuItem value={h1} primaryText="h1" />
        //         <MenuItem value={10} primaryText="10" />
        //         <MenuItem value={12} primaryText="12" />
        //         <MenuItem value={14} primaryText="14" />
        //         <MenuItem value={16} primaryText="16" />
        //         <MenuItem value={18} primaryText="18" />
        //         <MenuItem value={20} primaryText="20" />
        //         <MenuItem value={22} primaryText="22" />
        //         <MenuItem value={24} primaryText="24" />
        //         <MenuItem value={36} primaryText="36" />
        //         <MenuItem value={48} primaryText="48" />
        //         <MenuItem value={52} primaryText="52" />
        //       </DropDownMenu>
        //     )
        //   }
 //  generateDecorator =(highlightTerm) => {
 //    const regex = new RegExp(highlightTerm, 'g');
 //    return new CompositeDecorator([{
 //      strategy: (contentBlock, callback) => {
 //        if (highlightTerm !== '') {
 //          this.findWithRegex(regex, contentBlock, callback);
 //        }
 //      },
 //      component: this.SearchHighlight,
 //    }])
 //  };
 //
 // findWithRegex =(regex, contentBlock, callback) => {
 //    const text = contentBlock.getText();
 //    let matchArr, start, end;
 //    while ((matchArr = regex.exec(text)) !== null) {
 //      start = matchArr.index;
 //      end = start + matchArr[0].length;
 //      callback(start, end);
 //    }
 //  };
 //
 // SearchHighlight = (props) => {
 //   console.log('highlighter', props)
 //    return <span className="search-and-replace-highlight">{props.children}</span>
 //  };

        render() {
          return (
            <div>

              <AppBar title={this.state.title} style={{alignItems: 'center'}}>

                <input type="search"
                onChange={ (e) => this.onChangeSearch(e)}
                value={this.state.search}
                placeholder="search"/>

                <RaisedButton
                  className="button"
                  icon={<FontIcon className="material-icons">home</FontIcon>}
                  onClick={()=>this.props.redirect(DocumentPortal)}
                  backgroundColor={colors.red200}
                />
                <RaisedButton
                  className="button"
                  icon={<FontIcon className="material-icons">backup</FontIcon>}
                  onClick={()=>this.onSave()}
                  backgroundColor={colors.red200}
                />
              </AppBar>

              <div className="toolbar">
                <RaisedButton
                  icon={<FontIcon className="material-icons">undo</FontIcon>}
                  onClick={(()=>this.setState({editorState: EditorState.undo(this.state.editorState)}))}
                  backgroundColor={colors.red200}
                />
                <RaisedButton
                  icon={<FontIcon className="material-icons">redo</FontIcon>}
                  onClick={(()=>this.setState({editorState: EditorState.redo(this.state.editorState)}))}
                  backgroundColor={colors.red200}
                />
                {this.formatButton({ icon: 'format_bold', style: 'BOLD'})}
                {this.formatButton({ icon: 'format_italic', style: 'ITALIC'})}
                {this.formatButton({ icon: 'format_underlined', style: 'UNDERLINE'})}
                {this.formatButton({ icon: 'format_strikethrough', style: 'STRIKETHROUGH'})}
                {this.colorPicker()}
                {this.formatButton({icon:'format_list_bulleted',style: 'unordered-list-item', block: true})}
                {this.formatButton({icon:'format_list_numbered',style: 'ordered-list-item', block: true})}
                {this.formatButton({icon:'format_align_left',style: 'unstyled', block: true})}
                {this.formatButton({icon:'format_align_center',style: 'center', block: true})}
                {this.formatButton({icon:'format_align_right',style: 'right', block: true})}
                {this.fontSize()}

                <button onClick={()=>this.props.redirect(History, {docId: this.docId})}>History</button>

              </div>
              <div className="editor">
                <Editor
                  ref="editor"
                  blockRenderMap={myBlocktypes}
                  customStyleMap={this.state.inlineStyles}
                  onChange={this.onChange.bind(this)}
                  editorState={this.state.editorState}
                />
              </div>
            </div>
          );
        }
      }
