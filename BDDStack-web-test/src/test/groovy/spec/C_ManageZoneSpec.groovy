package spec

import geb.spock.GebReportingSpec
import spock.lang.*

import pages.app.*
import pages.external.*

@Title(" Mange Zone ")
@Narrative("""
At Mange Zone page, I should see two steps to update zone. (not verifying the actual change as feature not implemented)
""")
@See("https://trello.com/c/hnrjJEGd/208-web-change-the-zone-associated-with-an-agreement")
@Stepwise
@Ignore
class C_ManageZoneSpec extends GebReportingSpec {

    def "Scenario: 4.1 - Update contact for zone"() {
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

        then: "I should be able to click on Update button"
        assert updateButton.@disabled == ''
    }

    def "Scenario: 4.0 - Submit the update"() {
        given: "I am at the Manage Zone Page"
        at ManageZonePage

        when: "I click on Update button"
        updateButton.click()
        sleep(5000)

        and: "I am provided a confirm popup"
        assert confirmNoButton
        assert confirmYesButton
        confirmYesButton.click()

        then: "I should be back in the Manage zone page"
        at ManageZonePage
    }

}
