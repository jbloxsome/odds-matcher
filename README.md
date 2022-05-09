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
There are two assets that need to be deployed: the backend, and the frontend.

### Building the backend
1. Build the docker image
```
cd backend
```
```
docker build -t dutcher-backend .
```

### Building the frontend
1. Build the app
```
cd frontend
```
```
yarn && yarn build
```
2. Build the docker image
```
docker build -t dutcher-frontend .
```
