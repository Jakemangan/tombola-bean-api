Please ensure Node v20 or greater is installed before running. 

Thoughts 
- Any considerations for environments in the code e.g. uses of DEV in places
- Why is cost a string with £ chars
- Logging is basic 
- Naming conventions for DBO/DTO match that of the seed array for ease, usually I'd have more consistency with snake_cake as db columns and consistent capitals in names in general
- Usually I would have a repo layer for operations that are 
- Very basic JWT auth via HS256, no RS256 