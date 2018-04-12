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

//      Agreements:
//        agreementList {$("tr", class: "agreement__table__item")}
        agreementList {$("form", class: "ui form").$("table", class: "ui selectable table").$("tbody").$("tr", class: "agreement__table__item")}

        searchField (wait: true) {$("input", id: "searchTerm")}
    }
}