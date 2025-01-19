# @nexim/icon

![NPM Version](https://img.shields.io/npm/v/@nexim/icon)
![npm bundle size](https://img.shields.io/bundlephobia/min/@nexim/icon)
![Build & Lint & Test](https://github.com/the-nexim/design-system/actions/workflows/build-lint-test.yaml/badge.svg)
![NPM Downloads](https://img.shields.io/npm/dm/@nexim/icon)
![NPM License](https://img.shields.io/npm/l/@nexim/icon)

## Overview

The `icon` class is a CSS utility for rendering Material Design icons with consistent styling. It supports customization and ensures icons are aligned and visually appealing in any project.

## Installation

Install the package using npm or yarn:

```sh
npm install @nexim/icon

# Or using yarn
yarn add @nexim/icon
```

## API

- in the first step you must download woff file from google, you can check this [repo](https://github.com/marella/material-icons/blob/main/iconfont/material-icons-outlined.woff)
- move the woff file into your project
- copy and past this `@font-face` into your main css file

```css
@font-face {
  font-family: 'material-icon-outlined';
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url('font path') format('woff');
}
```

- import `@nexim/icon/style/main.css` into your main css file
- use like that

```html
<span class="icon">home</span>
```
