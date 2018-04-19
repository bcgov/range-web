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

   def "Scenario: 3 - Search agreements"(){
       given: "I am at the Home page"
       to HomePage

       when: "I enter in the search field"
//       TODO: should start with clean db
       searchField.value("RAN073258")

       and: "I wait for response"
       sleep(3000)

       then: "I should see the filtered list"
       assert agreementList.size() == 1
   }


    def "Scenario: 3.1 - Open an agreement"(){
        given: "I am at the Home page with the search result"
        at HomePage

        when: "I click open the agreement"
        agreementList[0].click()
//issue on the firefox ->>   https://bugzilla.mozilla.org/show_bug.cgi?id=1393831

        then: "I should be in the Plan view"
        at PlanPage
    }

    def "Scenario: 3.2 - Update status of agreement to completed"(){
        given: "I am at the Plan page"
        at PlanPage

        when: "I see the status of the current RUP is Submitted"
//        RUPstatus.text() == "Submitted"

        and: "I click on the status DropDown and update to Complete"
//        statusDropDown.click()
//        sleep(100)
//        completeOption.click()
//        sleep(200)

        and: "I see pop up window for confirmation of action and confirm"
//        confirmButton.click()
//        sleep(100)

        then: "I should see the status of RUP updated"
        assert RUPstatus.text() == "Completed"
    }

}
