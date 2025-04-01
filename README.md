# Notification Microservice

- Design with NestJS
- Unit Test Ready
- Multi microservices which consists of simple company and user microservice as well


# How to start dev

- This project is VSCode DevContainer ready, mean that you can utilize it as your virtual dev environment without further setup dependencies like NodeJS, Mongo etc.
- You will need to have following items:
  a. VSCode
  b. Remote Development Extensions (https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
  c. Docker
- After setup these three items, clone this project and open it through VSCode, then press Ctrl + Shift + P together and search for 'Dev Containers: Rebuild Container', press it and wait for your environment to ready (further reading: https://code.visualstudio.com/docs/devcontainers/containers#_quick-start-try-a-development-container)
- This virtual environment will help you to setup following stuffs:
  a. Copy over your host ssh key to here so that you can use your host ssh key here to commit code
  b. Setup one nodejs env + mongo as one docker compose services
  c. npm install for first init
- Create one .env file, then copy over the value inside .env.development to .env
- In order to run dev, can run with `npm run start:dev` to start all three microservices
- Here's the default endpoint for all three microservices:
  a. notification: http://localhost:3020/notifications
  b. company: http://localhost:3021/companys
  c. user: http://localhost:3022/users

# How to run unit test

- Currently this project only cover for jest unit test (also only focus on controller)
- Run `npm run test` to run all three controllers unit tests

# How to build + run in prod mode

- Run `npm run build` to build all three microservices togehter
- Setup your own .env
- Then run `npm run start:prod` to run all three microservices in prod mode