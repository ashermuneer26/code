import { serverApi, getToken } from './../../configs/conf'
import queryString from 'query-string'

export function Datalist(dateStart, dateEnd, txtsearch, start, limit) {
    return fetch(serverApi() + `api/patient/getuserlist`, {
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': "Bearer " + getToken()
        },
        method: "POST",
        body: queryString.stringify({ txtsearch: txtsearch, dateStart: dateStart, dateEnd: dateEnd, start: start, limit: limit })
    }).then((resp) => resp.json()).catch((err) => {
        // redirecturl()
    })
}


export function Delete(id) {
    return fetch(serverApi() + `api/patient/${id}`, {
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': "Bearer " + getToken()
        },
        method: "DELETE",
    }).then((resp) => resp.json()).catch((err) => {
        // redirecturl()
    })
}

export function updatePatient(formData) {
    return fetch(serverApi() + `api/patient/update`, {
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': "Bearer " + getToken()
        },
        method: "PUT",
        body: queryString.stringify(formData)
    }).then((resp) => resp.json()).catch((err) => {
        // redirecturl()
    })
}