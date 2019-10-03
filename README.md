# About My Range Application (MyRangeBC) for Web


The Range Mobile Pathfinder project is developing a suite of applications to support the sustainable management of cattle range on crown lands in British Columbia. [Learn more about the Range Program](https://www.for.gov.bc.ca/hra/)

The goal is to move important crown land management documents from paper to digital, and to make this information accessible in the field through disconnected mobile devices. This also supports a new and consistent process for Range staff across the province to support decision making processes.

An Agile Scrum team developed the Alpha product to test basic fuctions and was done March 31, 2018. Future releases by the Kamloops Range team at Kamloops Innovation Centre will lead towards an application that can be used by staff and public range use agreement holders, on multiple platforms.

For the Alpha Release, the web application documented here allows Range Branch Staff to view Range Use Plans that have been created in the iOS application. Soon, Range Officers will also be able to create and maintain records on web, but the offline abilities remain an iOS only feature for the time being.  It also enables users to assign staff to a set of agreements they are responsible for managing.

### Related MyRangeBc Documentation

- [MyRangeBC iOS application Github Repository](https://github.com/bcgov/range-ios)
- [MyRangeBC Web application Github Repository](https://github.com/bcgov/range-web)
- [MyRangeBC API Github Repository](https://github.com/bcgov/range-api)
- Our current Sprint Backlog is visible on GitHub Issues, see each repo for what is going on.
- [See the database Schema on Schema-Spy](http://schema-spy-range-myra-dev.pathfinder.gov.bc.ca/)

## Folder Structure
```
root/
  .eslintrc           // Displaying Lint Output in the Editor
  LICENSE
  README.md
  package.json
  semantic.json       // Semantic UI build settings for gulp
  coverage/           // Test coverage
  openshift/
  public/             // Images, index.html etc...
  semantic/           // Semantic UI custum styling definitions and overrides
  src/
    actionCreators/   // Network related Redux actions
    actions/          // Redux actions
    components/       // React components
    constants/        // Variables, strings, etc...
    reducers/         // Redux reducers
    semantic/         // Minified Semantic UI
    styles/           // All the Sass files
    tests/            // Integration and Unit testing
    utils/            // Helper functions
    index.js
```

For the project to build, **these files must exist with exact filenames**:

* `public/index.html` is the page template;
* `src/index.js` is the JavaScript entry point.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in the interactive watch mode.<br>

### `npm test -- --coverage`

Launches the test runner with a coverage report.<br>

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.<br><br>

In `/semantic` directory, you can also run:
### `gulp build`
Builds all files for Semantic UI including js, css, and assets. Build tool settings are stored in semantic.json.

## Create React App
  The application was built on top of [Create-React-App](https://github.com/facebook/create-react-app) with [Redux selector pattern](https://github.com/markerikson/react-redux-links/blob/master/redux-reducers-selectors.md#selectors) for state management and [React Router v4](https://github.com/ReactTraining/react-router) for routing & code splitting. The project was ejected once to add more plugins and make changes in Webpack configuration, then it was switched back to the unejected state with the newer version since it took care of all the demands.

## Routing & Code Splitting
This project takes advantage of React Router v4 to acheive many things such as authentication, authorizing users based on their roles, code splitting, dynamic route matching and so on.

Create React App allows us to dynamically import parts of our app using the `import()` proposal to reduce initial load time. Related reference can be found [here](https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html).

## Styling
* [Semantic UI React](https://react.semantic-ui.com/usage) was chosen for the main css framework. It includes Gulp build tools so the project can preserve its own theme changes, allowing us to customise the style variables. Detailed documentation on theming in Semantic UI can be found [here](http://learnsemantic.com/developing/customizing.html).

* [BEM(Block Element Modifier)](http://getbem.com/introduction) methodology was chosen for naming convention.

* Integration with Sass 

* Post-Processing CSS

  ```css
  .App {
    display: flex;
  }
  ```

  becomes this:

  ```css
  .App {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  ```


## License

	Copyright 2018 Province of British Columbia

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at 

	   http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
   

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons Licence" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/80x15.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">range-web</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">the Province of Britich Columbia</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.

