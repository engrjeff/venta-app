# Venta App

## To run and test the app locally, follow the steps below:

- Pull Latest Changes

```shell
git pull
```

- Install dependencies

```shell
npm install
```

- Seed database

```shell
npx prisma db push
```

```shell
npx prisma generate
```

If the database changes required the purging/clearing of all records, just seed some database records again with the following command:

```shell
npx prisma db seed
```

- Build the app

```shell
npm run build
```

- Start the app

```shell
npm run start
```

- Inspect database (Optional)

```shell
npx prisma studio
```

A browser should automatically appear under http://localhost:5555

- Open the app in the browser with the url: http://localhost:3002

## Notes:

When purging (clearing) the database is needed, do the following:

- Go to `package.json` then find the ff:

```json
"prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
```

- Replace the part `prisma/seed.ts` with `prisma/purge.ts`. It should look like the ff.:

```json
"prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/purge.ts"
  },
```

- Run `npx prisma db seed`.

- Restore the script to the original:

```json
"prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
```
