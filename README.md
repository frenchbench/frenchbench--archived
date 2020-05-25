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
npm install
```

## Disable telemetry for Next.js

```
npx next telemetry disable
```

## Configuration

Copy `.env.sample` as `.env` and edit.

## In Development env

```
# create tables
npm run db:upgrade:dev

# import random records
npm run db:seed:dev

# start
npm run dev
```

## In Staging/test env

```
npm run db:upgrade:staging
npm run build
npm run start
```

## In Production env

```
npm run db:upgrade
npm run build
npm run start
```
