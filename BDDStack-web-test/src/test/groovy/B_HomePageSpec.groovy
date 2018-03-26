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
class B_HomePageSpec extends GebReportingSpec {

   @Ignore
   def "Scenario: 3 - Search agreements"(){
       given: "I am at the Home page"
       to HomePage

       when: "I enter in the search field"
       //enter some string that does not exist:
       searchField.value("yes")

       and: "I hit enter"
       sleep(1000)

       then: "I should see the filtered list"
       assert agreementList.size() == 0
   }

}
