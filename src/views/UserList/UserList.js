import React, { Component } from 'react';
import { UsersTable } from './components';
import TextField from '@material-ui/core/TextField';
import { Datalist, Delete, insertMember, updateMember } from './Actions'
import uuid from 'uuid/v1';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from '@material-ui/core/Modal';
import { SearchInput } from 'components';
import ExportTOCSV from './export';
let userData = localStorage;
class PatientList extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      datalist: [],
      start: 0,
      limits: 10,
      total: 0,
      modalDelete: false,
      deleteid: '',
      username: '',
      password: "",
      txtsearch: '',
      editData: [],
      modalEdit: false
    };
    this._mounted = true;
  }

  componentWillMount() {
    this.getData();
    if (userData.length === 0) {
      window.location = '/admin'
    }
  }

  componentWillUnmount() {
    this._mounted = false
  }

  getData = () => {
    Datalist(this.state.txtsearch, this.state.start, this.state.limits).then((data) => {
      if (data.result) {
        this.setState({ datalist: this.fetchData(data.data), total: data.rows, loading: false })
      }
    })
  }

  fetchData = (datalist) => {
    const data = []
    console.log(datalist)

    for (let i = 0; i < datalist.length; i++) {
      data.push({
        id: uuid(),
        email: datalist[i].username,
        password: datalist[i].password,
        createdAt: datalist[i].createDate,
        action: <ButtonGroup size="small" aria-label="small outlined button group">
          <Button onClick={(e) => this.editData(datalist[i])}>Edit</Button>
          <Button onClick={(e) => this.delete(datalist[i].memberId)}>Delete</Button>
        </ButtonGroup>
      });
    }
    return data
  }

  editData = (data) => {
    this.setState({ editData: data, usernameOld: data.username, newusername: data.username, modalEdit: true })
  }

  delete = (id) => {
    this.setState({ modalDelete: true, deleteid: id })
  }

  conFirmDelete = () => {
    Delete(this.state.deleteid).then((data) => {
      const jstoast = toast;
      if (data.result) {
        jstoast.success('Delete Finish');
        this.setState({ modalDelete: false, deleteid: '' }, () => {
          this.getData();
        })
      } else {
        jstoast.error('Error cant Delete');
      }
    })
  }

  closeModalDelete = () => {
    this.setState({ modalDelete: false, deleteid: '' })
  }

  closeModalEdit = () => {
    this.setState({ modalEdit: false, editData: [], usernameOld: '', newusername: '' })
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleChangeSearch = e => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.getData();
    })
  }

  handleSave = (e) => {
    e.preventDefault();
    const jstoast = toast;
    if (this.ValidateEmail(this.state.username)) {
      if (!!this.state.username && this.state.password !== '') {
        insertMember(this.state.username, this.state.password).then((data) => {
          if (data.result && data.data.affectedRows !== undefined) {
            jstoast.success('Insert Member Finish');
            this.setState({ username: '', password: '' }, () => {
              this.getData();
            })
          } else {
            jstoast.error(data.message);
          }
        })

      } else {
        jstoast.error('Please Input Password');
      }
    } else {
      if (!!this.state.password) {
        jstoast.error('Email Not Valid');
      } else {
        jstoast.error('Please Input Email and Password');
      }
    }
  }

  conFirmUpdate = (e) => {
    e.preventDefault();
    const jstoast = toast;
    if (this.ValidateEmail(this.state.newusername)) {
      let formData = {}
      formData['username'] = this.state.newusername;
      formData['usernameOld'] = this.state.usernameOld;
      formData['memberId'] = this.state.editData.memberId;
      if (this.state.newpassword !== '' && this.state.newpassword !== undefined) {
        formData['password'] = this.state.newpassword
      }

      updateMember(formData).then((data) => {
        if (data.result && data.data.affectedRows !== undefined) {
          jstoast.warn('Update Member Finish');
          this.setState({ editData: [], usernameOld: '', newusername: '', modalEdit: false }, () => {
            this.getData();
          })
        } else {
          jstoast.error(data.message);
        }
      })
    } else {
      jstoast.error('Email Not Valid');
    }
  }

  ValidateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  exportCsv = () => {
    console.log(`exp`)
  }

  render() {
    const containerStyle = {
      zIndex: 1999
    };

    return (
      <div style={{ padding: "24px" }}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          style={containerStyle}
        />

        {this.state.modalEdit ?
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.modalEdit}
            onClose={this.closeModalEdit}
          >
            <div style={{
              "backgroundColor": "white",
              width: 800,
              position: 'absolute',
              border: '2px solid #000',
              outline: 'none',
              top: `50%`,
              left: `50%`,
              transform: `translate(-50%, -50%)`,
            }}>
              <center>
                <br /> <h2 id="modal-title">Update User</h2>  <br /> <br /> <br />
                <form
                  onSubmit={this.handleSave}
                >
                  <span style={{ flexGrow: 1 }} />
                  <TextField
                    id="standard-name"
                    name="newusername"
                    label="Email"
                    style={{
                      marginLeft: "8px",
                      marginRight: "8px",
                      width: 200,
                    }}
                    value={this.state.newusername}
                    onChange={this.handleChange}
                    margin="normal"
                  />
                  <TextField
                    id="standard-uncontrolled"
                    label="Password"
                    name="newpassword"
                    type="password"
                    onChange={this.handleChange}
                    value={this.state.newpassword}
                    style={{
                      marginLeft: "8px",
                      marginRight: "8px",
                      width: 200,
                    }}
                    margin="normal"
                  />

                </form>

                <Button variant="contained" color="primary" onClick={this.conFirmUpdate}> Update </Button> &nbsp;
                <Button variant="contained" color="default" onClick={this.closeModalEdit}> Cancel </Button>
                <br /> <br /> <br />
              </center>
            </div>
          </Modal> : ''}

        {this.state.modalDelete ?
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.modalDelete}
            onClose={this.closeModalDelete}
          >
            <div style={{
              "backgroundColor": "white",
              width: 800,
              position: 'absolute',
              border: '2px solid #000',
              outline: 'none',
              top: `50%`,
              left: `50%`,
              transform: `translate(-50%, -50%)`,
            }}>
              <center>
                <br /> <h2 id="modal-title">Do You Want To Delete ?</h2>  <br /> <br /> <br />
                <Button variant="contained" color="primary" onClick={this.conFirmDelete}> Delete </Button> &nbsp;
                <Button variant="contained" color="default" onClick={this.closeModalDelete}> Cancel </Button>
                <br /> <br /> <br />
              </center>
            </div>
          </Modal> : ''}

        <form
          onSubmit={this.handleSave}
        >
          <div style={{
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            marginTop: '16px',
          }}>

            <span style={{ flexGrow: 1 }} />
            <TextField
              id="standard-name"
              name="username"
              label="Email"
              style={{
                marginLeft: "8px",
                marginRight: "8px",
                width: 200,
              }}
              value={this.state.username}
              onChange={this.handleChange}
              margin="normal"
            />
            <TextField
              id="standard-uncontrolled"
              label="Password"
              name="password"
              type="password"
              onChange={this.handleChange}
              value={this.state.password}
              style={{
                marginLeft: "8px",
                marginRight: "8px",
                width: 200,
              }}
              margin="normal"
            />

            <Button
              color="primary"
              variant="contained"
              type="submit"
            >
              Add user
        </Button>

          </div>
        </form>

        <div style={{
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          marginTop: '16px',
        }}>
          <SearchInput
            style={{ marginRight: "8px" }}
            placeholder="Search user"
            name="txtsearch"
            value={this.state.txtsearch}
            onChange={this.handleChangeSearch}
          />

          <ExportTOCSV txtsearch={this.state.txtsearch} />
        </div>

        <div style={{ marginTop: "16px" }}>
          <UsersTable users={this.state.datalist} total={this.state.total} />
        </div>
      </div>
    );
  }
}
export default (PatientList);
