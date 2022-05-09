# Dutch Odds Matcher
## Running in dev
1. Install Docker
2. Get an API key from https://the-odds-api.com/
3. Create the file: backend/api_key, and paste your API key into this file
3. Start the services:
```
docker-compose up
```

## Deploying in production
There are two assets that need to be deployed: the backend, and the frontend. Both services can be built into a docker image to allow for flexible deployment into a range of different web environments.

### Building the backend
1. Build the docker image
```
cd backend
```
```
docker build -t dutcher-backend .
```

### Building the frontend
1. Modify ./frontend/envs/.prod.env to point to the URL where the backend is deployed e.g the file should look something like this:
```
REACT_APP_API_ENDPOINT=https://backend.com/
```
2. Build the app
```
cd frontend
```
```
yarn && yarn build:prod
```
3. Build the docker image
```
docker build -t dutcher-frontend .
```
