package pages.app

import geb.Page

class HomePage extends Page {
    static at = { title == "My Range App" }
    static url = "/range-use-plans"
    static public content = {

//      Nav bar:
        selectRUPButton {$("a", class: "navbar__link")[0]}
        mangeZoneButton {$("a", class: "navbar__link")[1]}
        logoutButton {$("a", class: "navbar__link")[2]}
//        logoutButton {$("a", id: "sign-out")}

//      Agreements:
        agreementList {$("tr", class: "tenure-agreement-table-item")}


        searchField (wait: true) {$("input", id: "search")}
    }
}
