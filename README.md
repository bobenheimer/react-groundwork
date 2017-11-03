# react-groundwork
A starting point for react applications. The goal of this project is to provide a very fast and simple basic
structure to create single page react apps with unit testing already setup. It is slightly opinionated (sass, karma,
mocha, chai), but makes no opinions about flux/mv* architecture or package management (npm/yarn).

## Getting Started

To get started, simply fork this project.

### Installing

Install with npm or [yarn.](https://github.com/yarnpkg/yarn) All examples will be using yarn.

```
yarn install
```

## The Project

### Config file

The project config is located at `src/config.js`.
```
module.exports = {
  // Whether to use node in production (as opposed to having something like nginx serve your files).
  // If this is false, npm start will spit out an index.html file in /dist
  useServerInProd: true,
  port: 3030,
  publicPath: '/' // e.g. the "/myapp" in www.mywebsite.com/myapp
};
```

### Working on the project

To start the project in development mode:

```
yarn run dev
```

This will rebuild the static files on changes and restart the server on server changes.

### Building for prod

```
yarn start
```

This will bundle assets with minification, and depending on config.useServerInProd, will either start a node server
or spit out `/dist/index.html`.


## Running the tests

Unit tests are setup with karma and jasmine, with the assumption that each test ends in `.test.js`.

```
yarn test
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
