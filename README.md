# frenchbench-app

FrenchBench intelligent team builder App and API using:

* Node.js v12
* React.js
* Next.js
* Knex.js
* PostgreSQL v12
* SQLite3
* Bcrypt
* Dotenv
* UUID

## Installation

```
npm i -g lerna typescript
lerna bootstrap
```

## Disable telemetry for Next.js

```
cd packages/app
npx next telemetry disable
```

## Configuration

For packages/app and packages/api, copy `.env.sample` as `.env` and edit.

## In Development env

```
cd packages/api
# create tables
npm run db:upgrade:dev

# import random records
npm run db:seed:dev

# check code style using eslint
npm run lint

# start
npm run start:dev

cd packages/app
npm run start:dev
```

## In Staging/test env

```
cd packages/api
npm run db:upgrade:staging
npm run build
npm run start

cd packages/app
npm run build
npm run start
```

## In Production env

```
cd packages/api
npm run db:upgrade
npm run build
npm run start

cd packages/app
npm run build
npm run start
```
