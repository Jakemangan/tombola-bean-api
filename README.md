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

### Considerations/notes 
- Obviously in production the JWT secret would not exist in the repo, it would be injected at runtime via some kind of config manager. It is in .env for practical purposes.
- Very basic JWT auth via HS256, no RS256 
- Naming conventions for DBO/DTO match that of the seed array for ease, usually I'd have more consistency with snake_cake as db columns and consistent capitals in names in general
- No ORM, this is intentional. 
- Localhost, so HTTPS is not present. In a production server valid TLS certificates would be in place to ensure HTTPS communication.
- Rate limiting is implemented across all endpoints with global rules. Short rule is 3 requests per 5 seconds.
- All SQL queries are parameterised to prevent SQL injection
- CORS is enabled, only requests from origin `allthebeans.com` or `localhost:3000` will be accepted. CORS_ORIGINS are provided in .env. However this is somewhat difficult to test without a browser to properly enforce CORS, as Postman does not. 

Thoughts
- Any considerations for environments in the code e.g. uses of DEV in places
- Why is cost a string with £ chars

