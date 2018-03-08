# About My Range Application (MyRA) for Web

The Range Mobile Pathfinder project is developing a suite of applications to support the sustainable management of cattle range on crown lands in British Columbia. [Learn more about the Range Program](https://www.for.gov.bc.ca/hra/)

The goal is to move important crown land management documents from paper to digital, and to make this information accessible in the field through disconnected mobile devices. This also supports a new and consistent process for Range staff across the province to support decision making processes.

An Agile Scrum team is developing the Alpha product to test basic fuctions after March 31, 2018. Future releases will lead towards an application that can be used by staff and public range use agreement holders, on multiple platforms.

- [For the latest product vision and feature roadmap, please see our RealtimeBoard](https://realtimeboard.com/app/board/o9J_kzhjVKg=/) 

For the Alpha Release, the **web application** documented here will allow Range Branch Staff to view Range Use Plans that have been created in the iOS application. It will also enable users to assign staff to a set of agreements they are responsible for managing.

### Related MyRA Documentation

- [MyRA iOS application Github Repository](https://github.com/bcgov/range-ios)
- [MyRA Web application Github Repository](https://github.com/bcgov/range-web)
- [MyRa API Github Repository](https://github.com/bcgov/range-api)
- [Our current Sprint Backlog is visible on Trello](https://trello.com/b/YxiYOPGU)
- [See the database Schema on Schema-Spy](http://schema-spy-range-myra-dev.pathfinder.gov.bc.ca/)

## Folder Structure
```
root/
  .eslintrc         // Displaying Lint Output in the Editor
  LICENSE
  README.md
  coverage/         // Test coverage
  node_modules/     // Dependencies
  package.json
  semantic.json     // Semantic UI setting
  public/
    index.html
    favicon.ico
  src/
    actions/        // Redux actions
    components/     
    handlers/       // Utils
    reducers/       // Redux reducers
    semantic/       // Semantic UI styling definitions and overrides
    store/          // Redux middlewares
    styles/         
    index.js
    setupTests.js   // Setup for Jest
    registerServiceWorker.js
```

For the project to build, **these files must exist with exact filenames**:

* `public/index.html` is the page template;
* `src/index.js` is the JavaScript entry point.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test:watch`
Launches the test runner in the interactive watch mode.<br>

### `npm test -- --coverage`

Launches the test runner with a coverage report.<br>

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Routing
This project uses [React Router v4](https://github.com/ReactTraining/react-router) with `browserHistory` (which uses the HTML5 [`pushState` history API](https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries) under the hood).

```
components/
  routes/
    PrivateRoute.js   
    PublicRoute.js
```

**If we have a logged-in user,** 

* PrivateRoute.js - display the component, otherwise redirect to login page.

* PublicRoute.js - redirect to the home page, otherwise, display the component.

## Styling
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

* Integration with Sass 
  - Whlie running the app creating `src/App.scss` file results in generating `src/App.css` automatically.

* Semantic UI
  * Dependencies - [Getting Started](http://learnsemantic.com/guide/expert.html)
  * Custum Theming - [Semantic UI Theming](https://semantic-ui.com/usage/theming.html#override-files)

## Create React App
  This project is based on Facebook's [Create-React-App](https://github.com/facebook/create-react-app). Check out their documentation for any references and other awesome features.
