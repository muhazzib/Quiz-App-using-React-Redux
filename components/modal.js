import Modal from 'react-modal';
import React, { Component } from 'react';


const customStyles = {
 content : {
   top                   : '20%',
   left                  : '50%',
   right                 : 'auto',
   bottom                : 'auto',
   marginRight           : '-50%',
   transform             : 'translate(-50%, -50%)'
 }
};

class Modalcom extends React.Component {
 constructor() {
   super();
 }


 render() {
   return (
     <div>
       <Modal
         isOpen={this.props.ModalBoolean}
         onRequestClose={this.props.closeModalRequest}
         style={customStyles}
         contentLabel="Example Modal"
       >

        {this.props.ModalText}
        
       </Modal>
     </div>
   );
 }
}

export default Modalcom