import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import { Datalist } from './Actions'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export';
import moment from 'moment'

class UploadReport extends Component {
    _exporter;
    constructor(props) {
        super(props)
        this.state = {
            datalist: [{
                "Username": '',
                "Password": '',
                "CreateuserDate": '',
            }],
            txtsearch: "",
            start: 0,
            limits: 1000,
            exportUse: false
        };
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    export = () => {
        Datalist(this.props.txtsearch, this.state.start, this.state.limits).then((data) => {
            if (data.result) {
                this.setState({ datalist: this.fetchData(data.data), exportUse: true }, () => {
                    this._exporter.save();
                    this.setState({ exportUse: false })
                })
            }
        })
    }

    fetchData = (datalist) => {
        const data = []

        for (let i = 0; i < datalist.length; i++) {
            data.push({
                Username: datalist[i].username,
                Password: datalist[i].password,
                CreateuserDate: moment(datalist[i].createDate).format('DD/MM/YYYY HH:mm:ss'),
            });
        }
        return data
    }

    render() {
        const data = this.state.datalist;
        const fields = Object.keys(data[0]);

        return (<div>
            <Button
                color="primary"
                variant="contained"
                onClick={this.export}
            >
                Generate .Csv
        </Button>
            {this.state.exportUse ?
                <ExcelExport
                    data={data}
                    fileName={`Member${moment().format("YYYYMMDD HH:mm")}.csv`}
                    ref={(exporter) => { this._exporter = exporter; }}
                >
                    {fields.map((field) =>
                        (<ExcelExportColumn field={field} />)
                    )}
                </ExcelExport>
                : ''}
        </div>);
    }
}

export default UploadReport;
