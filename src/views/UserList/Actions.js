import { serverApi, getToken, keyjwt } from './../../configs/conf'
import queryString from 'query-string'
import genSalt from './../../actions/salt'
import { hashSync } from 'bcryptjs'

export function Datalist(txtsearch, start, limit) {
    return fetch(serverApi() + `api/member/getmemberlist`, {
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': "Bearer " + getToken()
        },
        method: "POST",
        body: queryString.stringify({ start: start, limit: limit, txtsearch: txtsearch })
    }).then((resp) => resp.json()).catch((err) => {
        // redirecturl()
    })
}


export function Delete(id) {
    return fetch(serverApi() + `api/member/${id}`, {
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

export function insertMember(username, password) {
    let salt = genSalt(username + keyjwt());
    let hash = hashSync(password, salt);
    return fetch(serverApi() + `api/member/save`, {
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': "Bearer " + getToken()
        },
        method: "POST",
        body: queryString.stringify({ username: username, password: hash })
    }).then((resp) => resp.json()).catch((err) => {
        // redirecturl()
    })
}

export function updateMember(formData) {
    return fetch(serverApi() + `api/member/update`, {
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

