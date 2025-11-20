# Mudmauler

Mudmauler is a full-stack web application combining a React frontend with a Spring Boot backend and MySQL database.

## Available Scripts

In the project directory, you can run:

### Backend

Navigate to your backend directory and run:

./mvnw spring-boot:run

text

This starts the Spring Boot backend at [http://localhost:8080](http://localhost:8080).

### Frontend

Navigate to your frontend directory and run:

npm install
npm start

text

Open [http://localhost:3000](http://localhost:3000) to view the React app in your browser.

The page will reload if you make edits.\
Any lint errors will be shown in the console.

### `npm test`

Runs test watcher in interactive mode to test React components.\
See the [React Testing documentation](https://facebook.github.io/create-react-app/docs/running-tests) for details.

### `npm run build`

Builds the React app for production into the `build` folder, minified and optimized.\
Ready for deployment.

### Learn More

- [React documentation](https://reactjs.org/)
- [Spring Boot documentation](https://spring.io/projects/spring-boot)
- [MySQL documentation](https://dev.mysql.com/doc/)

### Troubleshooting

- Ensure MySQL is running and accessible.
- Check CORS configuration if React cannot reach backend.
- Make sure ports 8080 and 3000 are free and not blocked by firewalls.
