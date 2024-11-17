# Backend

## Setting Up the Development Environment

1. Set up enviroments:
    - copy `.env-example` and rename to `.env`
    - fill `.env` with your data

2. Start the project in Docker using `docker-compose`:

   ```bash
   docker-compose up -d
   
## Running Tests

1. Complete the steps in the [Setting Up the Development Environment](#setting-up-the-development-environment) section.

2. Run the tests using the following command:

   ```bash
   docker-compose exec backend python manage.py test