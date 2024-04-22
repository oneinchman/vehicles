# Assignment

## Architecture

### Next.js

The app uses Next.js version 14 where React server components are used by default. Read more about them [here](https://nextjs.org/docs/app/building-your-application/rendering/server-components).

Server components enable components and pages to be rendered on the server. They can be combined with client components to form a hybrid application.

### Persistent storage

The app is using Prisma as ORM and SQLite as database engine. SQLite is a lightweight and filebased database suited for minimal applications such as this.

In order to create the database, run:

`npm run db-init`

This will push the database design from the schema to the database url, creating the database if not already created.

## How to run

To run the app in dev mode, run:

`npm run dev`

To run the app in production mode:

First build the app using `npm run build`, then run it using `npm run start`.

## Tests

Pure components are tested with [Vitest](https://vitest.dev/) and can be run using:

`npm run test`

However, due to the nature of React server components, tools for unit testing are not fully supported yet.
[Read more here](https://nextjs.org/docs/app/building-your-application/testing#async-server-components).

Due to this, the components/pages that use server components/actions use end-to-end tests instead ([Playwright](https://playwright.dev/)).

To run e2e tests:

`npm run e2e`

The playwright configuration will run the npm script `setup` in the background, which will empty the database, build the application and start a production server before running the tests.
