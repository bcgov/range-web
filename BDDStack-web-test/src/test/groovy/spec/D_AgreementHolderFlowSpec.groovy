package spec

import geb.spock.GebReportingSpec
import spock.lang.*

import pages.app.*
import pages.external.*

@Title(" App Usage as an Agreement Holder ")
@Narrative("""
As AH, I should be able to:
1. Login to web app
2. See a list of agreements and RUP
3. Update schedule of a RUP
""")
@Stepwise
@Ignore
class D_AgreementHolderFlowSpec extends GebReportingSpec {

    def "Scenario: AH1 - Go to website for the first time"(){
        given: "I am an application administrator"
        to LoginPage

        when: "I access the website"
        titleText == "My Range App"

        and: "I click on the login button"
        loginButton.click()

        then: "I should be redirected to login webview using IDIR account"
        at IDIRPage
    }

    def "Scenario: AH2 - Login with BCeID account"(){
        given: "I am at the redhat page"
        at IDIRPage

        when: "I enter the BCeID account username and password as Agreement Holder"
        BCeIDusername = "xxx"
        BCeIDpassword = "xxx"

        and: "I click on submit"
        BCeIDloginButton.click()

        and: "I am at the next page"
//        TODO: get BCeID accounts

        then: "I should be redirected to the Home page"
        at HomePage
    }

    def "Scenario: AH3.0 - Check AH RUP update"() {
        given: "I am at Home Page"
        at HomePage

        when: "I see a list of Agreements and RUPs"

        and: "I click open a Completed RUP"

        then: "I should not be able to edit it"
//        and go back
    }

    def "Scenario: AH3.1 - Check AH RUP update"(){
        given: "I am at Home Page"
        at HomePage

        when: "I see a list of Agreements and RUPs"

        and: "I click open a Submitted RUP"

        and: "I update a field"

        then: "I should be able to update it"

    }


    def "Scenario: AH4 - Logout"(){
        given: "I am at Home page"
        at HomePage

        when: "I click on logout button"
        logoutButton.click()

        then: "I should be redirected to the Login page"
        at LoginPage
    }

}
