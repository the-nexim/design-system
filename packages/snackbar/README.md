# @nexim/snackbar

This package provides a customizable snackbar component for displaying brief messages to users. It includes utilities for managing the snackbar's state and animations.

![NPM Version](https://img.shields.io/npm/v/%40nexim%2Fsnackbar)
![npm bundle size](https://img.shields.io/bundlephobia/min/%40nexim%2Fsnackbar)
![Build & Lint & Test](https://github.com/the-nexim/nanolib/actions/workflows/build-lint-test.yaml/badge.svg)
![NPM Downloads](https://img.shields.io/npm/dm/%40nexim%2Fsnackbar)
![NPM License](https://img.shields.io/npm/l/%40nexim%2Fsnackbar)

## Overview

`@nexim/snackbar` is a versatile library designed to provide a customizable snackbar component for displaying brief messages to users. It includes utilities for managing the snackbar's state and animations, ensuring efficiency and scalability in high-performance projects.

## Installation

Install the package using npm or yarn:

```sh
npm install @nexim/snackbar

# Or using yarn
yarn add @nexim/snackbar
```

## API

### snackbarSignal

To display a snackbar, emit the snackbarSignal with the desired options:

```ts
import {snackbarSignal} from '@nexim/snackbar';

snackbarSignal.notify({
  content: 'This is a snackbar message',
  // The following properties are optional.
  action: {
    label: 'Undo',
    handler: () => {
      console.log('Action button clicked');
    },
  },
  duration: '4s',
  addCloseButton: true,
});
```
