## Locally connecting Databases & using environment variables

We will need to install node postgres, express and supertest on our machine in order to interact and test with our databases respectively. 

In addition to this we need to make a .env file each for our test and development databases in order to make sure which one we are connecting to. Please also remember to gitignore these files so we are not pushing any sensitive data onto github. 

Within our project we will need MVC files to connect the databases locally, these will consist of app.js, controller.js, error-handling-controller.js and models.js in order to link our psql requests to our functions editing our databases.

