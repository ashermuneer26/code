import { serverApi, keyjwt } from './../configs/conf'
import genSalt from './../actions/salt'
import { hashSync } from 'bcryptjs'

export function submitLogin(username, password) {
    let salt = genSalt(username + keyjwt());
    let hash = hashSync(password, salt);
    return fetch(serverApi() + 'api/member/login', {
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        method: "POST",
        body: "email=" + username + "&password=" + hash
    }).then((resp) => resp.json()).then((data) => {
        if (data.data.memberId !== undefined) {
            localStorage.users = JSON.stringify({
                userdata: data.data
            })
            localStorage.token = data.token
            return data
        } else {
            return false
        }
    })
}