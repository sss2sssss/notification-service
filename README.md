# Notification Microservice

- Design with NestJS
- Unit Test Ready
- Multi microservices which consists of simple company and user microservice as well


# How to start dev

- This project is VSCode DevContainer ready, mean that you can utilize it as your virtual dev environment without further setup dependencies like NodeJS, Mongo etc.
- You will need to have following items:
  - VSCode
  - Remote Development Extensions (https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
  - Docker
- After setup these three items, clone this project and open it through VSCode, then press Ctrl + Shift + P together and search for 'Dev Containers: Rebuild Container', press it and wait for your environment to ready (further reading: https://code.visualstudio.com/docs/devcontainers/containers#_quick-start-try-a-development-container)
- This virtual environment will help you to setup following stuffs:
  - Copy over your host ssh key to here so that you can use your host ssh key here to commit code
  - Setup one nodejs env + mongo as one docker compose services
  - npm install for first init
- Create one .env file, then copy over the value inside .env.development to .env
- In order to run dev, can run with `npm run start:dev` to start all three microservices
- Here's the default endpoint for all three microservices:
  - notification: http://localhost:3020/notifications
  - company: http://localhost:3021/companys
  - user: http://localhost:3022/users
- Also Swagger Documents will be auto populate as well:
  - notification: http://localhost:3020/api
  - company: http://localhost:3021/api
  - user: http://localhost:3022/api

# How to run unit test

- Currently this project having both controller unit test and e2e test
- Run `npm run test` to run all three controllers unit tests
- Run `npm run test:e2e` to run all three app service e2e tests, note that it will involve db read/ write so better to use the config from .env.test and paste into .env, and before this please run `npm run start:dev` to start the all the service before you run the `npm run test:e2e` as inside the service having Axios API call to other microservices

# How to build + run in prod mode

- Run `npm run build` to build all three microservices togehter
- Setup your own .env
- Then run `npm run start:prod` to run all three microservices in prod mode

# How to containerized if is not on DevContainer

- A mongo db is ready inside the docker compose script, you can use that or ready up your own mongodb connection and update on the .env
- Run `docker compose build` to build container
- Then `docker compose up -d` to up the container