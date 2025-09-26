Run instructions
- Please ensure Node v20 or greater is installed before running. 

Build and run
1. "npm i" within the bean-api directory 
2. Build the dist folder using "npm build"
3. Run the API using "node dist/main"

Run already built 
1. "node {distFolderDirectory}/main

On init the project will create an SQLite DB, bring it up to date with migrations and then insert the seed data from seed.json. 
Once the above has complete the nest framework will finish init. 

Considerations/notes 
- Obviously in production the JWT secret would not exist in the repo, it would be injected at runtime via some kind of config manager. It is in .env for practical purposes.
- Very basic JWT auth via HS256, no RS256 
- Naming conventions for DBO/DTO match that of the seed array for ease, usually I'd have more consistency with snake_cake as db columns and consistent capitals in names in general
- There is only a single "dev" DB instance

Thoughts
- Any considerations for environments in the code e.g. uses of DEV in places
- Why is cost a string with £ chars

