package pages.app

import geb.Page

class LoginPage extends Page {
    static at = { title == "My Range App" }
    static url = "/login"
    static content = {
        loginButton (wait: true) {$("button", id:"login-button")}
        titleText (wait: true) {$("div", class: "login__title").text()}
    }
}
