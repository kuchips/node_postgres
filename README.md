# node_postgres

This repo is a data-driven API written in Node.js to connect to a Postgres database using ORM implementation, built on express, dotenv, sequelize & winston packages. This API performs basic CRUD operations on a postgres database.

**[Express](https://expressjs.com/)** is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

__[Dotenv](https://www.npmjs.com/package/dotenv)__ is a zero-dependency module that loads environment variables from a .env file into process.env. 

**[Sequelize](https://sequelize.org/)** is a promise-based Node.js ORM for Postgres,MySQL, MariaDB, SQLite and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more.

**[Winston](https://github.com/winstonjs/winston)** is designed to be a simple and universal logging library with support for multiple transports. A transport is essentially a storage device for your logs. Each winston logger can have multiple transports (see: Transports) configured at different levels (see: Logging levels). For example, one may want error logs to be stored in a persistent remote location (like a database), but all logs output to the console or a local file.

## Installation

1. Run the following script from the root folder to install postgres database on your machine(Mac only). This script will install the postgres database and also creates a database (posts_db) & a table (posts). If your machine is already installed with Postgres database, skip to step 2.

```
./install_postgres.sh
```

2. If the postgres is installed using step 1, you can skip this step. Create the below user, database and table in your existing postgres at psql command prompt:

```

CREATE USER postgres;

CREATE DATABASE posts_db;

\c posts_db;

CREATE TABLE IF NOT EXISTS posts(post_id serial PRIMARY KEY, customer_id INTEGER NOT NULL, post_msg VARCHAR(400) NOT NULL, post_status CHAR(1) NOT NULL, post_type VARCHAR(10) NOT NULL, media_url VARCHAR(100),added_ts TIMESTAMP NOT NULL);

INSERT INTO posts(customer_id,post_msg,post_status,post_type,media_url,added_as) VALUES (12345,'Hi there!','A','Post','www.google.com',current_timestamp);
```

3. Run 'npm install' in the root folder. This will install the following packages from npm.

```
"body-parser": "1.19.0",
"cors": "2.8.4",
"dotenv": "8.2.0",
"express": "4.16.3",
"pg": "7.18.2",
"sequelize": "5.21.5",
"winston": "^3.2.1"
```

## Start the express server

Run the following command to start the Express server that listens on port 5000 to interact with the postgres database:

```
npm start

```

## HTTP requests

HTTP requests to interact with the postgres database:

```
#To get all the posts from the posts table. By default it fetches first 100 posts
curl --request GET 'http://localhost:5000/posts'

#To get the posts for pagination. Substitute 10 with your own value
curl --request GET 'http://localhost:5000/posts?offset=10&limit=10'

#To get posts of a specific post_id
curl --request GET 'http://localhost:5000/posts?post_id=1'

#To get posts of a specific customer
curl --request GET 'http://localhost:5000/posts?customer_id=12345'

#To search for a reference of a word('Hi') in all posts
curl --request GET 'http://localhost:5000/posts?search=Hi'

#To add a new Post
curl --request POST 'http://localhost:5000/posts' --header 'Content-Type: application/json' -d @data_insert.json

#To update an existing Post
curl --request PATCH 'http://localhost:5000/posts?post_id=21' --header 'Content-Type: application/json' -d @data_update.json

#To delete an existing Post by post_id
curl --request DELETE 'http://localhost:5000/posts?post_id=1'

```
