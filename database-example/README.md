# Example on how to connect to the database through TS

## Init

Create a file `.env` with the following content:

```
PORT=8080
DB_HOST=""
DB_USER=""
DB_PWD=""
DB_NAME="borg"
```

Change the HOST, USER and PWD to the MySQL IP, username and password.

## Run

Before you run the app you need to install the dependencies:
```
npm install
```

To run the app on the localhost:
```
npm start
```

The app will be running on `localhost:8080`.
