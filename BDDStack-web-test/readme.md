# BDDStack testing for MyRa Web Application

## Description

This is an example of incorporating Geb into a Gradle build. It shows the use of Spock and JUnit 4 tests.

The build is setup to work with a variety of browsers and we aim to add as many as possible.
A JenkinsSlave image has been created that can run Chrome/Firefox Headless tests. This offers a viable option for replacing phantomJs. Please see the [JenkinsSlave Dockerfile][dockerfile] setup.
This repository also holds a Dockerfile for a CentOS based image that will run headless tests as well.

## Usage

The following commands will launch the tests with the individual browsers, either headless or with browser opened up:

    ./gradlew -i clean -DchromeTest.single=CustomJUnitSpecRunner chromeTest
    ./gradlew -i clean -DchromeHeadlessTest.single=CustomJUnitSpecRunner chromeHeadlessTest
    ./gradlew -i clean -DfirefoxHeadlessTest.single=CustomJUnitSpecRunner firefoxHeadlessTest
    ./gradlew -i clean -DedgeTest.single=CustomJUnitSpecRunner edgeTest
    ./gradlew -i clean -DieTest.single=CustomJUnitSpecRunner ieTest

    
To run with all, you can run:

    ./gradlew -i clean -Dtest.single=CustomJUnitSpecRunner test

Replace `./gradlew` with `gradlew.bat` in the above examples if you're on Windows.
