# range-myra-web

The Range project will move important crown land management documents from paper to digital, and make them accessible in the field through disconnected mobile devices. The web application will help ranch officers and districts to manage tenure agreements and get overview of the land usage.

## Folder Structure
```
range-web/
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

### `npm test`

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

* Adding a CSS Preprocessor (Sass)
  Creating `src/App.scss` file while running the app results in generating `src/App.css` automatically. <br><br>

* Semantic UI
  * Dependencies - [Getting Started](http://learnsemantic.com/guide/expert.html)
  * Custum Theming - [Semantic UI Theming](https://semantic-ui.com/usage/theming.html#override-files)

## Create React App
  This project is based on Facebook's [Create-React-App](https://github.com/facebook/create-react-app).
  Check out their documentation for any references and other awesome features.
