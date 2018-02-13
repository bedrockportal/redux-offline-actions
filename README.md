# redux-offline-actions

[![NPM](https://nodei.co/npm/redux-offline-actions.png?downloads=true)](https://nodei.co/npm/redux-offline-actions/)

[Flux Standard Action](https://github.com/acdlite/flux-standard-action) utilities for [Redux Offline](https://github.com/redux-offline/redux-offline).

### Table of Contents
* [Getting Started](#getting-started)
  * [Installation](#installation)
  * [Usage](#usage)


# Getting Started

## Installation

```bash
$ npm install --save redux-offline-actions
```

or

```
$ yarn add redux-offline-actions
```

The [npm](https://www.npmjs.com) package provides a [CommonJS](http://webpack.github.io/docs/commonjs.html) build for use in Node.js, and with bundlers like [Webpack](http://webpack.github.io/) and [Browserify](http://browserify.org/). It also includes an [ES modules](http://jsmodules.io/) build that works well with [Rollup](http://rollupjs.org/) and [Webpack2](https://webpack.js.org)'s tree-shaking.

The [UMD](https://unpkg.com/redux-offline-actions@latest/dist) build exports a global called `window.ReduxOfflineActions` if you add it to your page via a `<script>` tag. We *don’t* recommend UMD builds for any serious application, as most of the libraries complementary to Redux are only available on [npm](https://www.npmjs.com/search?q=redux).

## Usage

```js
import { handleActions, combineActions } from 'redux-actions'
import { createOfflineAction } from 'redux-offline-actions'

const defaultState = [];

const createTodo = createOfflineAction(
  'CREATE_TODO',
  text => text,
  text => {url: '/todo', method: 'post', args: {text}},
  'CREATE_TODO_COMMIT',
  'CREATE_TODO_ROLLBACK'
});

const reducer = handleActions({
  ['CREATE_TODO']: (state, { payload: { text } }) => [...state, text],

  ['CREATE_TODO_COMMIT']: (state, { meta: { text } }) => state.map(x => x === text ? {text, saved: true} : x),

  ['CREATE_TODO_ROLLBACK'] => (state, { meta: { text } }) => state.filter(x => x !== text)
}, defaultState);

export default reducer;
```

## Support and Feedback

If you find a bug or have a question, please submit an issue in Github directly. [redux-offline-actions Issues](https://github.com/bedrockportal/redux-offline-actions/issues)

If you're interested in contributing, please check out the [Contribution Instructions](CONTRIBUTING.md).
