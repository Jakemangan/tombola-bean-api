# Run instructions
- Please ensure Node v20 or greater is installed before running. 

## Build and run
1. `npm i` within the bean-api directory 
2. Build the dist folder using `npm build`
3. Run the API using `node dist/main`
4. Open http://localhost:3000/api for swagger documentation

## Run already built dist
1. `node {distFolderDirectory}/main`
2. Open http://localhost:3000/api for swagger documentation




On init the project will create an SQLite DB, bring it up to date with migrations and then insert the seed data from seed.json. 
Once the above has complete the nest framework will finish init and be ready to receive requests. 

# Authorization
- The /admin/bean and /search routes are protected by JWT authorization 
- /botd is unprotected and can be accessed with no authorization
- /admin/bean can only be accessed with a valid JWT that has a role claim of "admin"
- A utility script has been provided to generate valid JWTs for you, to use the script use one of the following options
    - Generate an admin JWT - `npx ts-node generate-jwt.ts --role admin`
    - Generate a non-admin JWT - `npx ts-node generate-jwt.ts` 
- JWTs can otherwise be built through an online utility such as http://jwtbuilder.jamiekurtz.com/ by providing the same iss, aud, payload claims and signing key using the values already provided in .env 

# Amble
### Technology Choices
- Typescript - I like it. I can write it quickly. I prefer the security of strongly typed languages over weakly typed ones. Typescript sits in a sweet spot where I can write it quickly and have the flexibility of JS while also ensuring type safety as much as any other strongly typed language.
- NestJS - A very .NET-like framework. Implements a lot of the same patterns such as controllers, middleware/guards, dependency injection, use of decorators/attributes. This similarity combined with the above comments about typescript mean I can write this task quickly and efficently. 
- SQLite - More than performant enough to handle 1,000s of concurrent connections. Therefore more than performant enough to handle a server such as this one with a simple design, not a lot of data and few responsibilities. Sharding/replication becomes a bit more of an issue when the server gets to the point of requiring sharding but any attempt to include sharding for a website of this size would be premature optimisation and unlikely needed unless allthebeans.com becomes an international conglomerate. 

### Considerations/notes 
- Obviously in production the JWT secret would not exist in the repo, it would be injected at runtime via some kind of config manager. It is in .env for practical purposes.
- Very basic JWT auth via HS256, no RS256 
- Naming conventions for DBO/DTO match that of the seed array for ease, usually I'd have more consistency with snake_cake as db columns and consistent capitals in names in general
- No ORM, this is intentional. 
- Localhost, so HTTPS is not present. In a production server valid TLS certificates would be in place to ensure HTTPS communication.
- Rate limiting is implemented across all endpoints with global rules. Short rule is 3 requests per 5 seconds.
- All SQL queries are parameterised to prevent SQL injection
- CORS is enabled, only requests from origin `allthebeans.com` or `localhost:3000` will be accepted. CORS_ORIGINS are provided in .env. However this is somewhat difficult to test without a browser to properly enforce CORS, as Postman does not. 

### Explaination of separated DB schema
The proper production-ready normalised DB schema for this task is present in the 20250926212502-create-normalized-bean-schema-up migration. It dawned on me after getting the DB/API/migrations/etc set up with the seed.json file structure mirrored into the bean table that the task will have been more to write something more normalized. I hope you're able to excuse that the API uses the more simple schema of having all the JSON data in a single table, and that the normalized schema is more of a representation of what I would do if the task was more involved than an API responsible for returning the data for 15 beans. 

I have written the migration after the development of the rest of the API to display what I would do to write the schema for a more normalised database. 

At any rate, you could argue that the more performant schema up until probably 100,000s of Beans is to have everything in a single table and simply return the columns required at the time rather than having the overhead of joining tables together, which adheres to the task principles of performance, simplicity and scalability to an extent. 
