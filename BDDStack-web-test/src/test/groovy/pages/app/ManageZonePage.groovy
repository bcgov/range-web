package pages.app

import geb.Page
import geb.Module

class ManageZonePage extends Page {
    static at = { title == "My Range App" }
    static url = "/manage-zone"

    static content = {

        step1DropDownField { $('#manage-zone__zone-dropdown')}
        step2DropDownField { $('#manage-zone__contact-dropdown')}

//        step1DropDownList { $("#manage-zone__zone-dropdown").$("div", class: "visible").$("div", class: "item") }
        step1DropDownList { $("#manage-zone__zone-dropdown > div.visible > div.item") }
        step2DropDownList { $("#manage-zone__contact-dropdown > div.visible > div.item") }

        currentContactField {$("div", class:"#manage-zone__text-field__content")}

        updateButton {$("button", class: "ui primary button")}

        confirmYesButton {$("button", class: "ui green inverted button")}
        confirmNoButton {$("button", class: "ui red basic inverted button")}
    }
}