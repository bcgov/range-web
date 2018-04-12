package spec

import geb.spock.GebReportingSpec
import spock.lang.*

import pages.app.*
import pages.external.*

@Title(" Home ")
@Narrative("""
At Home page, I should see a search field that search all the agreements by RAN #, Agreement holder, Staff contact.
""")
@See("https://trello.com/c/0G0t1c3e/161-web-search-rup-by-agreement-holder-name")
@Stepwise
class B_ViewRUPSpec extends GebReportingSpec {
//TODO: Check for token validity and of logged into the web app (what about iOS???)
////
//    def setupSpec() {
//        given: "I enter Range web app"
//        to LoginPage
//
//        when: ""
//
//        and: "Login to app if not yet"
//        to LoginPage
//
//    }

//   @Ignore
   def "Scenario: 3 - Search agreements"(){
       given: "I am at the Home page"
       to HomePage

       when: "I enter in the search field"
//      enter some string that does not exist / one specific RAN
       searchField.value("RAN073257")

       and: "I wait for response"
       sleep(5000)

       then: "I should see the filtered list"
       assert agreementList.size() == 1
   }

//    @Ignore
    def "Scenario: 3.1 - Open an agreement"(){
        given: "I am at the Home page"
        to HomePage
        sleep(5000)

        when: "I click open the first agreement"
//should be only one in table after search:
        agreementList[0].click()

        then: "I should be in the Plan view"
        at PlanPage
    }

    def "Scenario: 3.2 - Update status of agreement"(){
        given: "I am at the Plan page"
        at PlanPage
        sleep(2000)

        when: "I see the status of the current RUP is Pending"
        RUPstatus.text() == "Pending"

        and: "I click on the status DropDown and update to Complete"
        statusDropDown.click()
        sleep(100)
        completeOption.click()
        sleep(500)

        and: "I see pop up window for confirmation of action and confirm"
        confirmButton.click()

        then: "I should see the status of RUP updated"
        assert RUPstatus.text() == "Completed"
    }

}
