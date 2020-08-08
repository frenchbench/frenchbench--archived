#!/usr/bin/env bash

# lib dep
lerna add uuid --scope frenchbench-common

# lib dev dep
lerna add -D typescript --scope frenchbench-common
lerna add -D ts-node --scope frenchbench-common
lerna add -D @types/node --scope frenchbench-common
lerna add -D @typescript-eslint/eslint-plugin --scope frenchbench-common
lerna add -D @typescript-eslint/parser --scope frenchbench-common
lerna add -D eslint --scope frenchbench-common

# api dep
lerna add axios --scope frenchbench-api
lerna add bcrypt --scope frenchbench-api
lerna add cookie --scope frenchbench-api
lerna add cors --scope frenchbench-api
lerna add dataloader --scope frenchbench-api
lerna add date-fns --scope frenchbench-api
lerna add dotenv --scope frenchbench-api
lerna add express --scope frenchbench-api
lerna add graphql --scope frenchbench-api
lerna add express-graphql --scope frenchbench-api
lerna add jsonwebtoken --scope frenchbench-api
lerna add pg --scope frenchbench-api
lerna add sqlite3 --scope frenchbench-api
lerna add knex --scope frenchbench-api
lerna add morgan --scope frenchbench-api
lerna add response-time --scope frenchbench-api
lerna add uuid --scope frenchbench-api

# api dev dep
lerna add -D typescript --scope frenchbench-api
lerna add -D ts-node --scope frenchbench-api
lerna add -D @types/node --scope frenchbench-api
lerna add -D @types/express --scope frenchbench-api
lerna add -D eslint --scope frenchbench-api
lerna add -D @typescript-eslint/eslint-plugin --scope frenchbench-api
lerna add -D @typescript-eslint/parser --scope frenchbench-api
lerna add -D faker --scope frenchbench-api
lerna add -D jest --scope frenchbench-api
lerna add -D supertest --scope frenchbench-api


# app dep
lerna add axios --scope frenchbench-app
lerna add cookie --scope frenchbench-app
lerna add cookie-parser --scope frenchbench-app
lerna add cross-env --scope frenchbench-app
lerna add date-fns --scope frenchbench-app
lerna add dotenv --scope frenchbench-app
lerna add express --scope frenchbench-app
lerna add gray-matter --scope frenchbench-app
lerna add http-proxy-middleware --scope frenchbench-app
lerna add js-cookie --scope frenchbench-app
lerna add react --scope frenchbench-app
lerna add react-dom --scope frenchbench-app
lerna add next --scope frenchbench-app
lerna add next-connect --scope frenchbench-app
lerna add remark --scope frenchbench-app
lerna add remark-html --scope frenchbench-app
lerna add swr --scope frenchbench-app

# app dev dep
lerna add -D typescript --scope frenchbench-app
lerna add -D ts-node --scope frenchbench-app
lerna add -D @types/node --scope frenchbench-app
lerna add -D @types/react --scope frenchbench-app
lerna add -D @types/react-dom --scope frenchbench-app
lerna add -D eslint --scope frenchbench-app
lerna add -D @typescript-eslint/eslint-plugin --scope frenchbench-app
lerna add -D @typescript-eslint/parser --scope frenchbench-app

# internal dep
lerna add frenchbench-common --scope frenchbench-app
lerna add frenchbench-common --scope frenchbench-api
