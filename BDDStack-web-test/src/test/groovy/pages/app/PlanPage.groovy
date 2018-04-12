package pages.app

import geb.Page

class PlanPage extends Page {
    static at = { title == "My Range App" }
//    static url = "range-use-plan/RAN073218"

    static content= {

        PDFButton {$("button", class: "ui button rup__btn")}
        RUPstatus {$("span", class: "status__label")}

        statusDropDown {$("div", class: "ui button item dropdown rup__status-dropdown")}

        completeOption {$("div", class: "menu transition").$("div", class: "selected item")}
        pendingOption {$("div", class: "menu transition").$("div", class: "item")}
//        pendingOption {$("div", role: "option")[1]}

//        pop up confirmation:
        confirmButton {$("button", class: "ui green inverted button")}
        rejectButton {$("button", class: "ui red basic inverted button")}
    }
}
