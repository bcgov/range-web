import geb.spock.GebReportingSpec
import spock.lang.*

import pages.app.*
import pages.external.*

@Title(" Zone ")
@Narrative("""
At Mange Zone page, I should see two steps to update zone.
""")
@See("https://trello.com/c/hnrjJEGd/208-web-change-the-zone-associated-with-an-agreement")
@Stepwise
class C_ManageZoneSpec extends GebReportingSpec {

    @Ignore
    def "Scenario: 4 - Manage Zone"(){
        given: "I am at the Manage Zone Page"
        to ManageZonePage

        when: "I have not select any options"
//        check the contact placeholder and the disabled update button
//        assert currentContactField == "Not selected"
        assert updateButton.@disabled == 'true'

        and: "I start step 1"
        step1DropDownField.click()
        sleep(100)
        step1DropDownList[0].click()

        and: "Verify the current contact is correct"
//        assert currentContactField == "Jar Jar Binks"

        and: "I start step 2"
        step2DropDownField.click()
        sleep(100)
        step2DropDownList[0].click()

        and: "I click on Update button"
        assert updateButton.@disabled == ''
        updateButton.click()
        sleep(5000)

        then: "I should see the confirm page popup"
        assert confirmYesButton
        assert confirmNoButton
        confirmYesButton.click()
    }

}
