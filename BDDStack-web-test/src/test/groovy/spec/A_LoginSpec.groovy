package spec

import geb.spock.GebReportingSpec
import spock.lang.*

import pages.app.*
import pages.external.*

@Title(" Login ")
@Narrative("""
At Login page, I should be able to click on Login button and redirected to login webview using IDIR account.
""")
@See("https://trello.com/c/jz3ZNwCJ/69-web-there-is-a-login-page")
@Stepwise
class A_LoginSpec extends GebReportingSpec {

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

        when: "I enter the IDIR account username and password as Admin"
        IDIRusername = "myra1"
        IDIRpassword = "myra1"

        and: "I click on submit"
        IDIRloginButton.click()

        then: "I should be redirected to the Home page"
        at HomePage
    }
}
