import React, { Component } from 'react';
import axios from 'axios';
import Navigation from '../Navigation';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import placeholderImg from './placeholder.png';
import './Settings.css';
// import emailValidation from '../Authorisation/emailRegExp';
class Settings extends Component {
  // email and password state
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
    newCompanyAddress: 'not selected'
  };
  
  // click on submit button event handle
  handleSubmit = e => {
    e.preventDefault();
    // const email = this.state.email;
    // const oldpassword = this.state.oldpasword;
    // const newpassword = this.state.newpassword;
    // check email is not empty string
    // if (!email) {
    //   return this.setState({ emailErr: '***** email need to provide *****' });
    // }
    // } else {
    //   this.setState({ emailErr: '' });
    // if (!oldpassword) {
    //   return this.setState({
    //     oldpasswordErr: '***** password should not empty blank *****'
    //   });
    // }
    // } else {
    //   this.setState({ oldpasswordErr: '' });
    // if (!emailValidation.test(email)) {
    //   return this.setState({ emailErr: '*invalid email format mr@-x-x-.xxx' });
    // }
    // }else {
    //    this.setState({ emailErr: '' });
    // }
    // console.log(
    //   this.state.email,
    //   this.state.oldpassword,
    //   this.state.newpassword
    // );
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
      this.setState({ 
        newCompanyName: res.data,
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
    const companyAddress = this.state.companyAddress;
    axios.put('http://localhost:3001/company-address', { companyAddress },
    {
      params: { 
        userId: localStorage.getItem('userId'),
      },
      headers: { 
        'Authorization': localStorage.getItem('tkn')
      }
    }
    ).then((res) => {
      this.setState({ 
        newCompanyAddress: res.data,
        modalHeader: `Success!`,
        modalBody: `Your Company Address was saved!`,
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
    }
    ).then((res) => {
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
        <h3 className="UserSetting-header">User Settings Page</h3>
        <main>
          <form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data">
            <div className="UserSetting-logo-section">
              <img className="UserSetting-logo-preview" src={this.state.logo} alt="logo"/>
              <h6 className="Upload-images-header"> Select image to upload:</h6>
              <p>Only *.jpeg and *.png images <br/> will be accepted with the size &lt; 0.4mb</p>
              <input className="UserSetting-logo-input" type="file" name="logo" accept="image/*" 
                onChange={(event)=> { this.handleUploadImage(event) }} />
            </div>       
            <div className="UserSetting-password-section">
              <div>
                <label>Old Password:</label>
                <input
                  className="Old-Password-field"
                  type="password"
                  onChange={this.handleOldPasswordChange}
                  value={this.state.oldpassword}
                />
                <br />
              </div>
              <div>
                <label>New Password:</label>
                <input
                  className="New-Password-field"
                  type="password"
                  onChange={this.handleNewPasswordChange}
                  value={this.state.newpassword}
                />
                <br />
                <br />
              </div>
              <button type="submit" className="usersetting">
                SAVE
              </button>
              <br />
              <br />
            </div>      
          </form>
          <form onSubmit={(event) => {this.changeCompanyName(event)}}>
            <label>Company Name: {this.state.newCompanyName}</label>
            <input
                type="text"
                value={this.state.companyName}
                onChange={this.handleChangeCompanyName}
              />
            <Button color="secondary">
              Save Changes
            </Button>
          </form>
          <br/>
          <form onSubmit={(event) => {this.changeCompanyAddress(event)}}>
            <label>Company Address: {this.state.newCompanyAddress}</label>
            <input
                type="text"
                value={this.state.companyAddress}
                onChange={this.handleChangeCompanyAddress}
              />
            <Button color="secondary" onClick={this.changeCompanyAddress}>
              Save Changes
            </Button>
          </form>
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

      const newCompanyName = res.data.companyName;
      if (newCompanyName) {
        this.setState({ newCompanyName });
      }

      const newCompanyAddress = res.data.companyAddress;
      if (newCompanyAddress) {
        this.setState({ newCompanyAddress });
      }
    }).catch((err) => {
      console.log(err)
      // const message = err.response.data.err;
      // console.log(message)
    });
  }
}
export default Settings;