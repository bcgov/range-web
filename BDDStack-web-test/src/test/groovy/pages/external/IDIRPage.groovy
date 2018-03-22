package pages.external

import geb.Page

class IDIRPage extends Page {
    static at = { title == "Log in to mobile"}
    static url = "https://dev-sso.pathfinder.gov.bc.ca/auth/realms/mobile/protocol/openid-connect/auth?response_type=code&client_id=range-test&redirect_uri=http://web-range-myra-dev.pathfinder.gov.bc.ca/login"
    static content = {
        IDIRusername (wait: true) {$("input", id: "username")}
        IDIRpassword (wait: true) {$("input", id: "password")}
        IDIRloginButton (wait: true) {$("input", id: "kc-login")}

    }
}



