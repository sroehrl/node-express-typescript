# Express api server w/ typescript

[![Maintainability](https://api.codeclimate.com/v1/badges/df25bcbd6e685e3c29bb/maintainability)](https://codeclimate.com/github/sroehrl/node-express-typescript/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/df25bcbd6e685e3c29bb/test_coverage)](https://codeclimate.com/github/sroehrl/node-express-typescript/test_coverage)
[![Build Status](https://travis-ci.com/sroehrl/node-express-typescript.svg?branch=master)](https://travis-ci.com/sroehrl/node-express-typescript)

A clean setup/boilerplate for your REST Api. This repo is aimed at providing developers with
a testable, easy to use structure for rapid API development.

- typescript
- express
- MySQL & orm & migration
- route loading
- jest
- JWT authentication
- yarn

## Content

- [Installation & Setup](#installation--setup) 
- [Authentication](#authentication) 
- [Routing & Resolving](#routing-and-resolving) 

## Installation & Setup

_Note:_ typescript und yarn are ideally installed globally

- After cloning, run `yarn install`
- Create a MySQL database for your project
- Copy `.env_example` to `.env` and adjust its variables accordingly.
- **optional**: adjust _models/user/migration.js_ and _models/user/UerInterface.ts_ to your needs
- run `node migrate` to write table(s) to your database

## Authentication

This package includes authentication middleware for JWT authentication. Authenticated endpoints 
expect an authorization header.

_Register_

```javascript
// example
fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    body: JSON.stringify({
        password: '123456',
        userName: 'demo993'
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
```

_Login_

```javascript
// example
fetch('http://localhost:3000/api/login', {
    method: 'POST',
    body: JSON.stringify({
        password: '123456',
        userName: 'demo993'
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
    .then(j => j.json())
    .then(result => {
        // retrieve JWT token
        const JWT = result.token;
    })
```

_Making authenticated calls_

```javascript
// example
fetch('http://localhost:3000/api/protected', {
    method: 'GET',
    headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `bearer ${yourToken}`
    }
})
    .then(j => j.json())
    .then(result => {
        console.log(result)
    })
```
## Models

Models expect a migration.js in order to sync database tables.
Let's have a look at the user model as an example

```javascript
const base = {
    user:{ // table name
        id: 'binary(16) NOT NULL',
        userName: 'varchar(40) DEFAULT NULL',
        password: 'varchar(255) DEFAULT NULL',
        createdAt: 'timestamp NULL DEFAULT current_timestamp()',
        deletedAt: 'datetime DEFAULT NULL'
    },
    user_role:{} // another table
}

module.exports = {
    base,
    migrations: [] // alterations to existing models should be placed in migrations array
}
```
Simple models (one db table) do not need a model class and can simply be created at runtime
using /utils/resolver.ts _(used in all auth routes)_

## Routing and Resolving

Files in /src/routes are loaded automatically. 

```javascript
// e.g. /src/routes/comments.ts
import {Express, Request, Response} from 'express-serve-static-core';
import Resolver from "../utils/resolver";
import {Model} from "../models/Model";

const Comment = new Resolver(new Model('comment'));

export default  (app: Express) => {
    // GET /api/comment/{id} gets a comment (assuming comment model exists) by id
    app.get('/api/comment/:id', Comment.get)
}
```