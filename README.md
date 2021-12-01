# Development Environment
- OS: Fedora 34
- Nodejs: v16.9.1
- NPM: 7.21.1
# Running Instructions
- Make sure you have Nodejs and NPM installed
- Navigate to the root folder that contains **src** and **public** folders
- Run: npm install
- Wait for NPM to install the modules
- Run: npm start
# Development Guideline
All the source code lives inside the **src** folder
## index.js
Apart from containing the initial ReactJs DOM render, it also handles the initialization of the ApolloJs Client.
## App.js
Our very first component that is supposed to be loaded by ReactJS, it also contains the routing logic
## src/pages
Each page has its own folder inside **src/pages** and the folder name will use **kebab-case**. Inside the folder all the **jsx** and **css** files will use **PascalCase** and other files will use **camelCase**. **e.g: src/new-home/NewHome.jsx src/new-home/allHomesList.js**
## src/pages/[page-name]/components
When a page grows into a big component, it is best to break it down into different sub components, and this is exactly the purpose of this folder. If the sub component is making network requests then it has to have **onDataReady**, **onDataLoading**, **onDataError** props defined, and make use of them. For usage you can check **src/pages/home/components/forms/Forms.jsx**.
## src/components
Each component will be stored under **src/component** and the naming follows the same convention as the pages. The components can include other components inside but not any other dependencies such as database or the global state of the application.
## src/mutations
Graphql mutations are categorized by the name of the page where the mutation is caleld from. **e.g: src/mutations/login** will contain all the mutations that are called from **src/pages/login**. Again it follows the same naming convention as **src/pages** on that this time the **.gql** files will be using **CamelCase**
## src/queries
Graphql queries follows the same pattern of the mutations. When some of the queries are called across different pages then they are stored under **src/queries/app**.
## src/hooks
Custom ReactJS hooks goes into this folder. Each hook is supposed to have its own js file, they are named with **PascalCase**.

# Display Loading and Error Messages
When a mutation or query is executed, we use the **onComplete** callbackto hide the message if the query or mutation has been successfully completed.

We also extract all the loading and error variables from **useQuery**, **useLazyQuery**, and **useMutation** functions and observe all the loadings within a single **useEffect** and observe each error in a separate **useEffects**.

# Components Guide
## country-card
All the props are straight forward to figure out other than **content** prop. **content** is an object that contains a key value pair where **key** will be used as a title to be displayed in the content are of the component and the **value** can either be of a primitive type or an array of primitive types.
## message-box
This component is used to display messages. The **show** prop is used to either show or hide this component, and the **onClickClose** is called when the close button is pressed. The calling component is supposed to set the **show** prop accordingly.
## suggestive-input
This is the type of text input which shows a list of possible matches to help autocomplete your input. **suggestions** prop is where it happens, it is an object with following keys:
- IComponent
- props_map
- value_key
- items

**items** is an array of objects that represents the list of suggestions. Each key of the item object will be used as a value for the **props_map** and each prop of **IComponent** will be used as a key of the **props_map**. So **props_map** does mapping between the the **props** of the **IComponent** and the values passed to those props from each item through the **items** array. **IComponent** will be used as a row component for each suggestion item. **value_key** will be set to the item key that is supposed to be emitted through **onChange** prop. So **value_key** must be the key used within an item.
## suggestion-row
This is the component that can be passed to as the **IComponent** to the **suggestive-input**
## form-card
It takes in an array of input elements as **inputs**, array of button elements as **buttons**, and a list of possible suggestions for the inputs that use **suggestive-input**. Here the **suggestions** prop is an object with each key set to the name of the input element as passed in the **inputs** prop. The value to each key in **suggestions** prop will be what was described for suggestions in the **suggestive-input** section. When a button is clicked the name of that button is emitted through the **onBtnClick** prop. When an input changes its value, that is emitted by the name of the input and its value through the **inputChange** event prop.
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
