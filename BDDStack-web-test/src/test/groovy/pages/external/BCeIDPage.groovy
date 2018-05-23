package pages.external

import geb.Page

class BCeIDPage extends Page {
    static at = { title == "Government of British Columbia"}
//    static url = "https://dev-sso.pathfinder.gov.bc.ca/auth/realms/mobile/protocol/openid-connect/auth?response_type=code&client_id=range-test&redirect_uri=http://web-range-myra-dev.pathfinder.gov.bc.ca/login"
    static content = {
        BCeIDusername (wait: true) {$("input", id: "user")}
        BCeIDpassword (wait: true) {$("input", id: "password")}
        BCeIDloginButton (wait: true) {$("input", name: "btnSubmit")}

    }
}



