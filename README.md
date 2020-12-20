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

## Installation & Setup

_Note:_ typescript und yarn are ideally installed globally

- After cloning, run `yarn install`
- Create a MySQL database for your project
- Copy `.env_example` to `.env` and adjust its variables accordingly.
- **optional**: adjust _models/user/migration.js_ and _models/user/UerInterface.ts_ to your needs
- run `node migrate` to write table(s) to your database
