//import geb.spock.GebReportingSpec
//import pages.app.*
//import pages.external.*
//import spock.lang.*
//
//@Title("Basic Navigational Tests")
//@Narrative("""
//As a user I expect all links in the Myra web application to work.
//- At Home page, I should see a top navigation bar that direct me to the desired pages.
//""")
//@Stepwise
//class MainFlowSpecs extends GebReportingSpec {
//
//    @Unroll
//    def "Navigatino at the Home page"() {
//        given: "I start on the #startPage"
//        to startPage
//
//        when: "I click on the link #clickLink"
//        waitFor { $("a", class:"navbar__link")[clickLink].click() }
//
//        then:
//        at assertPage
//
//        where:
//        startPage                   | clickLink                                 || assertPage
////        HomePage    		        | $("a", class:"navbar__link")[0]   || HomePage
////        HomePage    		        | $("a", class:"navbar__link")[1]   || ManageZonePage
////        HomePage    		        | $("a", class:"navbar__link")[2]   || LoginPage
//        HomePage    		        | 0   || HomePage
//        HomePage    		        | 1   || ManageZonePage
//        HomePage    		        | 2   || LoginPage
//
//    }
//
//}