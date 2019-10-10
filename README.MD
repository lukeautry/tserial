# tserial

Runtime deserialization for TypeScript interfaces and type aliases

## Table of Contents

- [Overview](#overview)
- [Design Goals](#design-goals)
- [Installation](#installation)
- [Usage](#usage)

## Overview

[Read the blog post for a high level summary](https://lukeautry.com/blog/tserial)

TypeScript's structural typing system offers a powerful way to represent the shape of data. Data delivered across system is, by default, not validated. A developer version can use type assertions to "cast" untrusted input to the intended type, but this is insecure and incorrect. The developer should write code that validates input data and coerces it to the right type.

`tserial` automates this process and offers the developer a way to securely deserialize data at runtime.

## Design Goals

- Should use plain TypeScript expressions as the source of truth (no DSLs or codecs)
- Should define a subset of type expressions that represent serializable data. Expressions involving functions (classes, function declarations and expressions, etc) will not be permitted.
- Should offer consumers a way to opt-in to interfaces/type aliases they would like to be validated at runtime
- Should generate a single file with a deserialization routine
- Should have no runtime dependencies
- Should have minimal build time dependencies
- Deserialization routine should use composable assertions and type guards which incrementally prove adherence to a type expression via narrowing
  - Hedges against "stale" output since compiler will usually raise errors when narrowing produces an incomplete type
- Deserialization routine must produce granular error data; if data isn't valid, useful, structured error data should be returned to the caller
- Node.js, browser, and [deno](https://github.com/denoland/deno) support

## Installation

NOTE: This is not yet published on NPM

```sh
npm install tserial --save-dev

yarn add tserial --dev
```

## Usage

The CLI and Node API use the same underlying modules. Both generate file content. The CLI takes care of writing the file to the file system, while the Node API just returns string content.

In either mode, it's highly recommended to use a formatter like [prettier](https://prettier.io) to format the generated code. No attempt has been made to autogenerate well-formatted code.

### CLI

```sh
# all options
tserial --help

# minimal command, use tsconfig.json at project root and default tag identifier
tserial --out ./path/to/generated_file.ts

# custom tsconfig
tserial --out ./path/to/generated_file.ts --tsconfig some-custom-tsconfig.json

# custom tag name (defaults to serializable)
# custom tsconfig
tserial --out ./path/to/generated_file.ts --tag myCustomTag

# deno imports
tserial --out ./path/to/generated_file.ts --deno
```

### Node API

The best documentation is the source code itself. Check out [this file](test/render/render-content.ts) for an example of how the test suite calls the Node API.
