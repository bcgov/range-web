import geb.spock.GebReportingSpec
import spock.lang.*

import pages.app.*
import pages.external.*

@Title(" Login ")
@Narrative("""
At Login page, I should be able to click on Login button and redirected to login webview using IDIR account.
""")
@See("?")
@Stepwise
class LoginSpec extends GebReportingSpec {

    def "Scenario: 1 - Go to website for the first time"(){
        given: "I am an application administrator"
        to LoginPage

        when: "I access the website"
        titleText == "My Range App"

        and: "I click on the login button"
        loginButton.click()

        then: "I should be redirected to login webview using IDIR account"
        at IDIRPage

    }

    def "Scenario: 2 - Login with IDIR account"(){
        given: "I am at the redhat page"
        at IDIRPage

        when: "I enter the IDIR account username and password"
        IDIRusername = "test"
        IDIRpassword = "test"

        and: "I click on submit"
        IDIRloginButton.click()

        then: "I should be redirected to the Home page"
        at HomePage
    }


//    def "Scenario: 3 - Search agreements"(){
//        given: "I am at the Home page"
//        at HomePage
//
//        when: "I enter in the search field"
//        //enter some string that does not exist:
//        searchField.value("yes")
//
//        and: "I hit enter"
//        sleep(1000)
//
//        then: "I should see the filtered list"
////        TODO: should be zero when search is implemented
//        assert agreementList.size() != 0
//    }



//
//    def "Scenario: 3 - Logout"(){
//        given: "I am at the Home page"
//        at HomePage
//
//        when: "I hit Logout button"
//        logoutButton.click()
//
//        then: "I should see the filtered list"
//        at LoginPage
//    }

    def "Scenario: 4 - Manage Zone"(){
        given: "I am at the Home page"
        at HomePage

        when: "I go to manage zone page"
        mangeZoneButton.click()

        and: "I'm at Manage Zone"
        at ManageZonePage
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
