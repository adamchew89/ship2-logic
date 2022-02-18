# `Express Typescript Starter - SHIP 2.0 Logic Module + SQLite DB`

## `Express Typescript Starter RESTful API`

<hr/>

This project is created with the following main libraries:

| Library                                                        | Purpose                              |
| -------------------------------------------------------------- | ------------------------------------ |
| [BcryptJS](https://github.com/dcodeIO/bcrypt.js#readme)        | Password hashing for Node.js         |
| [Body-Parser](https://github.com/expressjs/body-parser#readme) | Middleware body parser for Node.js   |
| [Cors](https://github.com/expressjs/cors#readme)               | Middleware cors enabler for Node.js  |
| [Dotenv](https://github.com/motdotla/dotenv#readme)            | Environment variable loader module   |
| [Envalid](https://github.com/af/envalid#readme)                | Environment variable validator       |
| [Express](https://expressjs.com/)                              | Minimalist web framework for Node.js |
| [JWT](https://jwt.io/)                                         | Json web token                       |
| [Lodash](https://lodash.com/)                                  | Javascript utility library           |
| [Morgan](https://github.com/expressjs/morgan#readme)           | HTTP request middleware logger       |
| [SQLite3](https://github.com/mapbox/node-sqlite3#readme)       | SQLite3 NodeJS adapter               |
| [TypeORM](https://typeorm.io/)                                 | NodeJS object relation mapper        |
| [Winston](https://github.com/winstonjs/winston#readme)         | Multi-transport logger               |

### Development

| Library                                                                    | Description                                                       |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [@Jest-Mock/Express](https://github.com/bikk-uk/jest-mock-express#readme)  | Lightweight Jest mock for unit testing Express                    |
| [Husky](https://github.com/typicode/husky/blob/main/README.md)             | Modern native Git hooks made easy                                 |
| [Jest](https://jestjs.io/)                                                 | Javascript testing framework                                      |
| [Lint-Staged](https://github.com/okonet/lint-staged/blob/master/README.md) | Run linters against staged git files                              |
| [Prettier](https://prettier.io/)                                           | An opinionated code formatter                                     |
| [TS-Jest](https://kulshekhar.github.io/ts-jest/)                           | Typescript testing framework                                      |
| [TS-Node](https://github.com/TypeStrong/ts-node#readme)                    | Typescript execution and REPL for Node.js with source map support |
| [TSC-Alias](https://github.com/justkey007/tsc-alias#readme)                | Typescript module alias mapping                                   |
| [TSConfig-Paths](https://github.com/dividab/tsconfig-paths#readme)         | Typescript tsconfig path resolver                                 |
| [Typescript](https://www.typescriptlang.org/)                              | Superset syntax for Javascript                                    |

<hr/>

## `Getting started`

<hr/>

### 1. Checkout / Download Source Code

To get a running copy on your local instance, checkout or download a copy of the repository from [Express-Typescript-Starter](https://github.com/adamchew89/express-typescript-starter).

If you do not have access to the continental github repository above, kindly contact the administrator(s) for permission:

- Adam Chew <adamchew89@gmail.com>

<hr/>

### 2. Dependencies Installation

To complete the following instructions, [Node.js](https://nodejs.org/en/) must be installed on your terminal.

- Navigate from your preferred command line interface (CLI) tool to the application's root directory: `cd ~/<project-root-folder>`
- Execute the following command to start installing the project dependencies: `npm install` or `npm i`

<hr/>

### 3. Setting-up Local Environment Variables

The following instructions will create an environment variable file for local use:

- Navigate from your preferred command line interface (CLI) tool to the application's root directory: `cd ~/<project-root-folder>`
- Execute the following command to copy a environmental variable file template: `cp .env .env.development`
- Open and modify the values contained within the file to your requirement.
- Ensure that an existing database is running for this segment to work.

<hr/>

### 4. Start Application

The following instructions will start hosting the application locally:

- Navigate from your preferred command line interface (CLI) tool to the application's root directory: `cd ~/<project-root-folder>`
- Execute the following command to start a development server locally: `yarn start`
- Execute the following command to start a production server locally: `yarn start:prod`

<hr/>

### 5. Build Production Version

The following instructions will compile the source codes into a production-ready version:

- Navigate from your preferred command line interface (CLI) tool to the application's root directory: `cd ~/<project-root-folder>`
- Execute the following command to build and compile the source codes: `npm run build`

<hr/>

### 6. Unit Testing

The following instructions will start a unit test process on the application:

- Navigate from your preferred command line interface (CLI) tool to the application's root directory: `cd ~/<project-root-folder>`
- Execute the following command to start the unit test process: `npm run test:local`
- Open a browser tab (Google Chrome recommended) and proceed to the following url to view the coverage report: `~/<project-root-folder>/coverage/lcov-report/index.html`

<hr/>

### 7. API Documentation

The following instructions will enable the viewing of the OpenAPI documentation:

- Navigate from your preferred command line interface (CLI) tool to the application's root directory: `cd ~/<project-root-folder>`
- Execute the following command to start the development server: `npm run dev`
- Open a browser tab (Google Chrome recommended) and proceed to the following url to view the OpenAPI documentation: `http://localhost:<port>/api-docs`

<hr />

### 8. Database Migration/Seeding

The following instructions will enable the migration of database structure and seeding of data to database tables:

- Navigate from your preferred command line interface (CLI) tool to the application's root directory: `cd ~/<project-root-folder>`
- Execute the following command to start the development server: `npm run dev`
- Upon successfully starting the server, a new configuration file will be generated on the project root directory: `config.json`
- Execute the following command to start migrating database structures into the database: `npx sequelize-cli db:migrate`
- Execute the following command to start seeding data into the database: `npx sequelize-cli db:seed:all`

<hr />

### 9. Containerization

The following instructions will enable the containerization of the application:

- Navigate from your preferred command line interface (CLI) tool to the application's root directory: `cd ~/<project-root-folder>`
- Execute the following command to start the image building process: `docker build -t expressts-starter-image .`
- Execute the following command to start the container building process: `docker run -it --publish 3000:3000 --rm --name expressts-starter-container expressts-starter-image`

<hr />

### 10. Kubernetes Deployment

> All container images will need to be build before proceeding to this segment.
> Images include:
>
> - expressts-starter:v1 (To be built in target production environment. Hence, ensure values in `.env.production` are correct.)
> - mysql (From docker hub)
> - rabbitmq:3.8.14 (From docker hub)
> - redis (From docker hub - Future use)

The following instructions will deploy the application onto a kubernetes cluster:

- Navigate from your preferred command line interface (CLI) tool to the application's root directory: `cd ~/<project-root-folder>`
- Execute the following command to start the secrets deployment process. Commands are found in `~/<project-root-folder>/kubernetes/secrets/README.md`
- Execute the following command to start the volumes deployment process: `kubectl apply -f ./kubernetes/volumes/`
- Execute the following command to start the containers deployment process: `kubectl apply -f ./kubernetes/deployments/`
- Execute the following command to start the services deployment process: `kubectl apply -f ./kubernetes/services/`
- Execute the following url address on a browser to verify expressts-starter deployment: `http://localhost/api/api-docs`

- Execute the following command to start the dashboard deployment process: Commands are found in `~/<project-root-folder>/kubernetes/deployments/README.md`
- Execute the following command to start the dashboard proxy process: `kubectl proxy`
- Execute the following url address on a browser to verify: `http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/`
