import React from 'react';
import TextEditor from './editor.js';


export default class App extends React.Component {
  render() {
    return (<div>
      <TextEditor />
      <h2>Hello, Robert!!!</h2>
    </div>);
  }
}

// const styles = StyleSheet.create({
//   star: {
//     boxSizing: 'border-box',
//
//   },
//   content: {
//     width: 480,
//     margin: 0
//
//   },
//   editor: {
//     border: 1,
//     borderColor: 'grey',
//     padding: 6
//   },
//
// });
