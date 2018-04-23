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
class C_ManageZoneSpec extends GebReportingSpec {

    def "Scenario: 4.1 - Update contact for zone"() {
        given: "I am at the Manage Zone Page"
        to ManageZonePage
        sleep(1000)

        when: "I have not select any options"
        assert updateButton.@disabled == 'true'

        and: "I start step 1"
        step1DropDownField.click()
        sleep(100)
        step1DropDownList[0].click()

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
        sleep(100)

        and: "I am provided a confirm popup"
        assert confirmNoButton
        assert confirmYesButton
        confirmYesButton.click()

        then: "I should be back in the Manage zone page"
        at ManageZonePage
    }

}
