import React, { Component } from 'react';
import { UsersTable } from './components';
import Avatar from '@material-ui/core/Avatar';
import uuid from 'uuid/v1';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { Datalist, Delete } from './actions'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SearchInput } from 'components';
import TextField from '@material-ui/core/TextField';
import ModalEeit from './ModalEdit';
import ExportTOCSV from './Export';
let userData = localStorage;
const jstoast = toast;

class PatientList extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      datalist: [],
      start: 0,
      limits: 10,
      total: 0,
      openModal: false,
      modalDelete: false,
      modalEdit: false,
      editData: [],
      signpic: '',
      deleteid: '',
      txtsearch: '',
      dateStart: '',
      dateEnd: '',
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
    Datalist(this.state.dateStart, this.state.dateEnd, this.state.txtsearch, this.state.start, this.state.limits).then((data) => {
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
        name: datalist[i].firstName,
        Lname: datalist[i].lastName,
        services: datalist[i].role,
        createdAt: datalist[i].createDate,
        email: datalist[i].email,
        phone: datalist[i].phone,
        sign: <Avatar onClick={(e) => this.handleOpen(datalist[i])} src={`data:image/jpeg;base64,${datalist[i].signature}`} />,
        action: <ButtonGroup size="small" aria-label="small outlined button group">
          <Button onClick={(e) => this.showWdit(datalist[i])}>Edit</Button>
          <Button onClick={(e) => this.delete(datalist[i].userId)}>Delete</Button>
        </ButtonGroup>
      });
    }
    return data
  }

  handleOpen = (data) => {
    this.setState({ openModal: true, signpic: data.signature })
  }

  closeModal = (data) => {
    this.setState({ openModal: false })
  }

  delete = (id) => {
    this.setState({ modalDelete: true, deleteid: id })
  }

  showWdit = (data) => {
    this.setState({ modalEdit: true, editData: data })
  }

  closeEdit = (data) => {
    this.setState({ modalEdit: false })
  }

  conFirmDelete = () => {
    Delete(this.state.deleteid).then((data) => {

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
    this.setState({ modalDelete: false })
  }

  onTableUpdate = (data) => {
    let page = +data.page !== 0 ? +data.page + 1 : +data.page;
    let offset = Math.ceil((+page * +this.state.limits) - +this.state.limits)
    let newoffset = offset < 0 ? 0 : offset

    this.setState({ start: newoffset }, () => {
      this.getData()
    })
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  changeDate = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  submitSearch = () => {
    this.getData()
  }

  onUpdateEdit = (data) => {
    this.setState({ modalEdit: false })
    if (data.update) {
      jstoast.success('Update Finish');
      this.getData()
    }
  }

  render() {
    let { signpic } = this.state
    const containerStyle = {
      zIndex: 1999
    };

    return (
      <div style={{ padding: "24px" }}>
        <br />
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
            onClose={this.closeEdit}
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
                <br /> <h2 id="modal-title">Update User</h2>

                <ModalEeit editData={this.state.editData} onUpdateEdit={this.onUpdateEdit.bind(this)} />
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
                <h2 id="modal-title">Do You Want To Delete ?</h2>
                <br />
                <br />
                <br />
                <Button variant="contained" color="primary" onClick={this.conFirmDelete}>
                  Delete
      </Button> &nbsp;
                <Button variant="contained" color="default" onClick={this.closeModalDelete}>
                  Cancel
      </Button>
                <br />
                <br />
                <br />
              </center>
            </div>
          </Modal> : ''}

        {this.state.openModal ?
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.openModal}
            onClose={this.closeModal}
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
                <h2 id="modal-title">Signature</h2>
                <img alt="signature" src={`data:image/jpeg;base64,${signpic}`} /></center>
            </div>
          </Modal> : ''}

        <div style={{
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          marginTop: '16px',
        }}>
          <span style={{ flexGrow: 1 }} />
          <form noValidate>
            <TextField
              id="date"
              label="From Date"
              type="date"
              name="dateStart"
              // defaultValue={moment().format("YYYY-MM-DD")}
              onChange={this.changeDate}
              style={{
                marginLeft: "8px",
                marginRight: "8px",
                width: 200,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>

          <form noValidate>
            <TextField
              id="date"
              label="To Date"
              type="date"
              name="dateEnd"
              // defaultValue={moment().format("YYYY-MM-DD")}
              onChange={this.changeDate}
              style={{
                marginLeft: "8px",
                marginRight: "8px",
                width: 200,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>

          <SearchInput
            style={{ marginRight: "8px" }}
            placeholder="Patient name"
            name="txtsearch"
            value={this.state.txtsearch}
            onChange={this.handleChange}
          />

          <Button
            color="primary"
            variant="contained"
            onClick={this.submitSearch}
          >
            Show Data
        </Button>
          &nbsp;
          <ExportTOCSV txtsearch={this.state.txtsearch} dateStart={this.state.dateStart} dateEnd={this.state.dateEnd} />
        </div>


        <div style={{ marginTop: "16px" }}>
          <UsersTable users={this.state.datalist} total={this.state.total} onTableUpdate={this.onTableUpdate.bind(this)} />
        </div>
      </div >
    );
  }
}
export default (PatientList);

