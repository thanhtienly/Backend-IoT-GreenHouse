## How to run each microservice in this repository
1. Clone this project with 3 microservice with the command: \
`
git clone https://github.com/thanhtienly/Backend-IoT-GreenHouse.git
`
2. Move to working microservice, for example: \
`
cd device-service
`
3. Install dependencies with command: \
`
npm install
`
4. Create a .env.local file, copy all fields from .env.dev file to & fill values for all of these fields
5. Create database in the DBMS (PostgreSQL) mannually, then run the migrations with the command: \
`
npm run migration:run
`
7. Run microservice in dev mode with command: \
`
npm run start:dev
`
