import React, { Component } from 'react';
import axios from 'axios';
import Navigation from '../Navigation';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import placeholderImg from './placeholder.png';
import './Settings.css';

class Settings extends Component {
  state = {
    oldpassword: '',
    newpassword: '',
    logo: '',
    modal: false,
    modalHeader: '',
    modalBody: '',
    companyName: '',
    newCompanyName: 'not selected',
    companyAddress: '',
    newCompanyAddress: 'not selected',
    invoiceNumber: '',
    newInvoiceNumber: 0
  };
  
  handleSubmit = e => {
    e.preventDefault();
    axios.put(`http://localhost:3001/new-password`,
      {
        oldpassword: this.state.oldpassword,
        newpassword: this.state.newpassword
      },
      {
        params: { 
          userId: localStorage.getItem('userId'),
        },
        headers: { 
          'Authorization': localStorage.getItem('tkn')
        }
      })
      .then(res => {
        this.setState({ 
          modalHeader: `Success!`,
          modalBody: `Your password was changed!!!`,
          modal: true
        });
      })
      .catch(err => {
        alert(
          'Old Password does not match or new password is same as old password!!!'
        );
        // const message = err.response.data.error;
        //   if (err.response.status === 500) {
        //     this.setState({ passwordErr: '*****Old Password not match*****' });
        //   } else {
        //     this.setState({ passwordErr: 'Old Password does not match!!!' });
        //   }
      });
  };
  handleOldPasswordChange = event => {
    this.setState({ oldpassword: event.target.value });
  };
  handleNewPasswordChange = event => {
    this.setState({ newpassword: event.target.value });
  };
  handleChangeCompanyName = event => {
    this.setState({ companyName: event.target.value });
  }
  handleChangeCompanyAddress = event => {
    this.setState({ companyAddress: event.target.value });
  }
  handleChangeInvoiceNumber = event => {
    this.setState({ invoiceNumber: event.target.value });
  }
  changeCompanyName = event => {
    event.preventDefault();
    const companyName = this.state.companyName;
    axios.put('http://localhost:3001/company-name', { companyName },
    {
      params: { 
        userId: localStorage.getItem('userId'),
      },
      headers: { 
        'Authorization': localStorage.getItem('tkn')
      }
    }
    ).then((res) => {
      let newCompanyName;
      if (res.data.length > 15) {
        newCompanyName = res.data.substring(0, 15) + '...';
      } else {
        newCompanyName = res.data;
      }
      this.setState({ 
        newCompanyName,
        modalHeader: `Success!`,
        modalBody: `Your Company Name was saved!`,
        modal: true
      });
    }).catch((err) => {
      console.log(err);
      if (err.response) {
        const message = err.response.data.err;
        console.log(message)
        if (message) {
          this.setState({ 
            modalHeader: `Failure!`,
            modalBody: message,
            modal: true,
          });
        }
      }
    });
  }

  changeCompanyAddress = event => {
    event.preventDefault();
    const invoiceNumber = this.state.invoiceNumber;
    axios.put('http://localhost:3001/invoice-number', { invoiceNumber },
    {
      params: { 
        userId: localStorage.getItem('userId'),
      },
      headers: { 
        'Authorization': localStorage.getItem('tkn')
      }
    }).then((res) => {
      this.setState({ 
        newInvoiceNumber: res.data,
        modalHeader: `Success!`,
        modalBody: `Your Current Invoice Number was saved!`,
        modal: true
      });
    }).catch((err) => {
      console.log(err);
      if (err.response) {
        const message = err.response.data.err;
        console.log(message)
        if (message) {
          this.setState({ 
            modalHeader: `Failure!`,
            modalBody: message,
            modal: true,
          });
        }
      }
    });
  }

  changeInvoiceNumber  = event => {
    event.preventDefault();
    const invoiceNumber = this.state.invoiceNumber;
    axios.put('http://localhost:3001/invoice-number', { invoiceNumber },
    {
      params: { 
        userId: localStorage.getItem('userId'),
      },
      headers: { 
        'Authorization': localStorage.getItem('tkn')
      }
    }).then((res) => {
      let newInvoiceNumber;
      if (res.data) {
        newInvoiceNumber = res.data;
      } else {
        newInvoiceNumber = 0
      }
      this.setState({
        newInvoiceNumber,
        modalHeader: `Success!`,
        modalBody: `Your Current Invoice Number was saved!`,
        modal: true
      });
    }).catch((err) => {
      console.log(err);
      if (err.response) {
        const message = err.response.data.err;
        console.log(message)
        if (message) {
          this.setState({ 
            modalHeader: `Failure!`,
            modalBody: message,
            modal: true,
          });
        }
      }
    });
  }

  handleUploadImage = event => {
    const imageFile = event.target.files[0];
    if (!imageFile) return;
    const logo = new FormData();
    logo.append('logo', imageFile);
    axios.put('http://localhost:3001/upload', logo, 
    {
      params: { userId: localStorage.getItem('userId') },
      headers: { 
        'Authorization': localStorage.getItem('tkn'),
        'Content-Type': imageFile.type
      }
    }).then((res) => {
      this.setState({ 
        logo: `data:${res.data.contentType};base64,${res.data.binaryData}`,
        modalHeader: `Success!`,
        modalBody: `Your logo was uploaded and saved!`,
        modal: true
      });
    }).catch((err) => {
      console.log(err);
      if (err.response) {
        const message = err.response.data.err;
        console.log(message)
        if (message) {
          this.setState({ 
            modalHeader: `Failure!`,
            modalBody: message,
            modal: true,
          });
        }
      }
    });
  }

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <div className="UserSetting">
        <Navigation />
        <main>
          <header>
            <h3 className="UserSetting-header">Account</h3>
            <h5 className="UserSetting-subheader">Change your basic account settings.</h5>
          </header>
          <div className="UserSetting-password-section">
            <form onSubmit={this.handleSubmit} >
              <div>
                <label>Old Password</label>&emsp;
                <input
                  className="Old-Password-field"
                  type="password"
                  onChange={this.handleOldPasswordChange}
                  value={this.state.oldpassword}
                />
              </div>
              <div>
                <label>New Password</label>&emsp;
                <input
                  className="New-Password-field"
                  type="password"
                  onChange={this.handleNewPasswordChange}
                  value={this.state.newpassword}
                />
              </div>
              <button type="submit" className="UserSetting-password-btn">
                Save
              </button>
            </form>
          </div>
          <div className="UserSetting-logo-section">
            <header>
              <h4 className="UserSetting-logo-header">Content</h4>
              <h5 className="UserSetting-logo-subheader">Select image to upload.</h5>
            </header>
            <form encType="multipart/form-data">
                <img className="UserSetting-logo-preview" src={this.state.logo} alt="logo"/>
                
                <p>Only *.jpeg and *.png images <br/> will be accepted with the size &lt; 0.4mb</p>
                <input className="UserSetting-logo-input" type="file" name="logo" accept="image/*" 
                  onChange={(event)=> { this.handleUploadImage(event) }} />
            </form>
          </div>
          <div className="UserSetting-company-section">
            <form onSubmit={(event) => {this.changeCompanyName(event)}}>
              <label>Company Name: {this.state.newCompanyName}</label><br/>
              <input
                  type="text"
                  value={this.state.companyName}
                  onChange={this.handleChangeCompanyName}
                />
              <Button color="secondary">Save</Button>
            </form>
            <br/>
            <form onSubmit={(event) => {this.changeCompanyAddress(event)}}>
              <label>Company Address: {this.state.newCompanyAddress}</label><br/>
              <input
                  type="text"
                  value={this.state.companyAddress}
                  onChange={this.handleChangeCompanyAddress}
                />
              <Button color="secondary">Save</Button>
            </form>
            <br/>
            <div className="UserSetting-invoice-section">
              <form onSubmit={(event) => {this.changeInvoiceNumber(event)}}>
                <label>Current Invoice Number: {this.state.newInvoiceNumber}</label><br/>
                <input
                    type="text"
                    value={this.state.invoiceNumber}
                    onChange={this.handleChangeInvoiceNumber}
                  />
                <Button color="secondary">Save</Button>
              </form>
            </div>
          </div>
        </main>
        {/* Modal */}
        <div>
          <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
            <ModalHeader toggle={this.toggleModal}>{this.state.modalHeader}</ModalHeader>
            <ModalBody>{this.state.modalBody}</ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleModal}>OK</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }

  componentDidMount() {
    axios.get('http://localhost:3001/logo', {
      params: { userId: localStorage.getItem('userId') },
      headers: { 
        'Authorization': localStorage.getItem('tkn'),
      }
    }).then((res) => {
      if (res.data.message  === 'Logo is not selected') {
        this.setState({ logo: placeholderImg });
      } else {
        this.setState({ logo: `data:${res.data.userLogo.contentType};base64,${res.data.userLogo.binaryData}`});
      }

      let newCompanyName = res.data.companyName;
      if (newCompanyName) {
        if (newCompanyName.length > 15) {
          this.setState({ newCompanyName: newCompanyName.substring(0, 15) + '...'});
        } else {
          this.setState({ newCompanyName });
        }
      }

      const newCompanyAddress = res.data.companyAddress;
      if (newCompanyAddress) {
        if (newCompanyAddress.length > 13) {
          this.setState({ newCompanyAddress: newCompanyAddress.substring(0, 13) + '...'});
        } else {
          this.setState({ newCompanyAddress });
        }
      }

      const newInvoiceNumber = res.data.currentInvoiceNumber;
      if (newInvoiceNumber) {
        this.setState({ newInvoiceNumber });
      }
    }).catch((err) => {
      console.log(err)
      // const message = err.response.data.err;
      // console.log(message)
    });
  }
}
export default Settings;
