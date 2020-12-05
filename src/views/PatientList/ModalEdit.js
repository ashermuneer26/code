import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FileBase64 from 'react-file-base64';
import Checkbox from '@material-ui/core/Checkbox';
import { updatePatient } from './actions'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const jstoast = toast;

class modalEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: props.editData.firstName,
            lastName: props.editData.lastName,
            phone: props.editData.phone,
            email: props.editData.email,
            signature: props.editData.signature,
            role: props.editData.role,
            files: [],
            showsign: true,
            checkBox: [],

            Chiropractic: false,
            Physiotherapy: false,
            "Massage Therapy": false,
            "Free Consultation": false,
            Acupuncture: false,
            Homeopathy: false,
            Psychology: false,
            Osteopathy: false
        };
        this._mounted = true;
    }

    componentWillMount() {
        this.setCheckBox()
    }

    componentWillUnmount() {
        this._mounted = false
    }

    setCheckBox = () => {
        var str = this.props.editData.role
        var res = str.split(",");
        for (let i = 0; i < res.length; i++) {
            this.setState({ [res[i]]: true })
        }
    }

    closeEdit = () => {
        this.props.onUpdateEdit({ close: true })
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleChangeTextBox = (e, checked) => {
        this.setState({ ...this.state, [e.target.name]: checked })
    }

    getFiles(files) {
        this.setState({ files: files })
    }

    delfile = () => {
        this.setState({ showsign: false })
    }

    checkState = () => {
        let checkData = []
        let nameFC = "Free Consultation"
        let nameMT = "Massage Therapy"
        if (this.state[nameFC]) checkData.push(nameFC)
        if (this.state[nameMT]) checkData.push(nameMT)
        if (this.state.Osteopathy) checkData.push("Osteopathy")
        if (this.state.Psychology) checkData.push("Psychology")
        if (this.state.Homeopathy) checkData.push("Homeopathy")
        if (this.state.Chiropractic) checkData.push("Chiropractic")
        if (this.state.Physiotherapy) checkData.push("Physiotherapy")
        if (this.state.Acupuncture) checkData.push("Acupuncture")

        return checkData
    }

    conFirmUpdate = (e) => {
        e.preventDefault();
        let { editData } = this.props

        if (this.checkState().length === 0) {
            jstoast.error('Pleas Select Services');
            e.preventDefault();
            return false
        } else if (!!this.state.firstName && !!this.state.lastName) {
            let formData = {}
            formData['userId'] = editData.userId;
            formData['firstName'] = this.state.firstName;
            formData['lastName'] = this.state.lastName;
            formData['email'] = this.state.email;
            formData['phone'] = this.state.phone;
            if (this.state.files.base64 !== undefined) {
                var str = this.state.files.base64;
                var res = str.split(",");
                formData['signature'] = res[1];
            }
            if (this.checkState().length > 0) {
                formData['role'] = this.checkState().toString();
            }
            // console.log(formData)
            updatePatient(formData).then((data) => {
                if (data.result) {
                    jstoast.success('Update Finish');
                    this.props.onUpdateEdit({ update: true })
                }
            })
        } else {
            if (this.state.firstName === '') {
                jstoast.error('Pleas Fill Firstname');
            } else if (this.state.lastName === '') {
                jstoast.error('Pleas Fill Lastname');
            }
        }
    }

    render() {
        const containerStyle = {
            zIndex: 1999
        };
        let name = "Free Consultation"
        let nameMT = "Massage Therapy"
        return (
            <div style={{ padding: "24px" }}>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    style={containerStyle}
                />
                <Grid container spacing={3}>

                    <Grid item xs={4}>
                        <TextField
                            id="standard-name"
                            label="Firstname"
                            name="firstName"
                            value={this.state.firstName}
                            onChange={this.handleChange}
                            style={{
                                marginLeft: "8px",
                                marginRight: "8px",
                                width: 200,
                            }}
                            margin="normal"
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            id="standard-name"
                            label="Lastname"
                            name="lastName"
                            value={this.state.lastName}
                            onChange={this.handleChange}
                            style={{
                                marginLeft: "8px",
                                marginRight: "8px",
                                width: 200,
                            }}
                            margin="normal"
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            id="standard-name"
                            label="Email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            style={{
                                marginLeft: "8px",
                                marginRight: "8px",
                                width: 200,
                            }}
                            margin="normal"
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            id="standard-name"
                            label="Phone number"
                            name="phone"
                            value={this.state.phone}
                            onChange={this.handleChange}

                            style={{
                                marginLeft: "8px",
                                marginRight: "8px",
                                width: 200,
                            }}
                            margin="normal"
                        />
                    </Grid>

                    <Grid item xs={8}>
                        <div style={{ display: 'flex', }}>
                            <FormControl component="fieldset" style={{ margin: "24px" }}>
                                <FormLabel component="legend">Services</FormLabel>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox checked={this.state.Osteopathy} onChange={this.handleChangeTextBox} name="Osteopathy" value="Osteopathy" />}
                                        label="Osteopathy"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={this.state.Psychology} onChange={this.handleChangeTextBox} name="Psychology" value="Psychology" />}
                                        label="Psychology"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={this.state.Homeopathy} onChange={this.handleChangeTextBox} name="Homeopathy" value="Homeopathy" />
                                        }
                                        label="Homeopathy"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={this.state.Acupuncture} onChange={this.handleChangeTextBox} name="Acupuncture" value="Acupuncture" />
                                        }
                                        label="Acupuncture"
                                    />
                                </FormGroup>
                            </FormControl>
                            <FormControl component="fieldset" style={{ margin: "24px" }}>
                                <FormLabel component="legend">Services</FormLabel>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={this.state[nameMT]} onChange={this.handleChangeTextBox} name="Massage Therapy" value="Massage Therapy" />
                                        }
                                        label="Massage Therapy"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={this.state.Physiotherapy} onChange={this.handleChangeTextBox} name="Physiotherapy" value="Physiotherapy" />
                                        }
                                        label="Physiotherapy"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={this.state.Chiropractic} onChange={this.handleChangeTextBox} name="Chiropractic" value="Chiropractic" />
                                        }
                                        label="Chiropractic"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={this.state[name]} onChange={this.handleChangeTextBox} name="Free Consultation" value="Free Consultation" />
                                        }
                                        label="Free Consultation"
                                    />
                                </FormGroup>

                            </FormControl>

                        </div>
                    </Grid>

                    <Grid item xs={3}>
                        <FileBase64
                            multiple={false}
                            onDone={this.getFiles.bind(this)} />
                    </Grid>

                    {this.state.showsign ?
                        <Grid item xs={3}>
                            <img alt="signature" src={`data:image/jpeg;base64,${this.state.signature}`} width={150} height={100} />
                        </Grid>
                        : ''}
                    {this.state.showsign ?
                        <Grid item xs={3}>
                            <Button variant="contained" color="secondary" onClick={this.delfile}> Delete </Button>
                        </Grid> : ''}
                </Grid>


                <br />
                <br />
                <br />
                <Button variant="contained" color="primary" onClick={this.conFirmUpdate}> Update </Button> &nbsp;
        <Button variant="contained" color="default" onClick={this.closeEdit}> Cancel </Button>
            </div >
        );
    }
}
export default (modalEdit);
