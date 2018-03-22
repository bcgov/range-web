package pages.app

import geb.Page

class PlanPage extends Page {
    static at = { title == "My Range App" }
// try the first plan:
    static url = "range-use-plan/1"

    static content= {

        PDFButton {$("button", class: "ui button range-use-plan__btn")}

        statusDropDown {$("div", class: "ui button item dropdown")}

        completeOption {$("div", role: "option")[0]}
        pendingOption {$("div", role: "option")[1]}
    }
}
