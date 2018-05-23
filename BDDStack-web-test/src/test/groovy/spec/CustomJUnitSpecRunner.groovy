package spec

import org.junit.runner.RunWith
import org.junit.runners.Suite

@RunWith(Suite)
@Suite.SuiteClasses([
        A_LoginSpec.class,
        B_ViewRUPSpec.class,
        C_ManageZoneSpec.class,
        Z_MainFlowSpecs.class])
//        ,D_AgreementHolderFlowSpec.class])

class CustomJUnitSpecRunner {
}