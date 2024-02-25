# NodeJS Authentication with ScyllaDB

A nodejs API project that lets you register and login using JWT and ScyllaDB.

## Stack

**Server:** Node, Express, JWT

**Database:** ScyllaDB, Redis

## Installing Scylla

You can use docker to run ScyllaDB. Used Scylla to save user's register and login data. Execute the following command to run a node:

```bash
   docker run --name <container_name> -d -p 9042:9042 -p 7001:7001 -p 7000:7000 scylladb/scylla
```

Go into ScyllaDB

```bash
   docker exec -it <container_name> cqlsh
```

## Installing Redis

You can use docker to run Redis. Used Redis to cache the fetched data. Execute the following command to run a node:

```bash
   docker run --name <container_name> -d -p 6349:6349 -p 8001:8001 redis
```

Go into Redis

```bash
   docker exec -it <container_name> redis-cli
```

## Installation

After cloning the code run the following command to install the NPM dependencies

```bash
   npm install
```

## Running application

```bash
   npm start
```

## Useful docker commands

To check the status of containers:

```bash
   docker ps
```

Start a container:

```bash
   docker start <container_id or container_name>
```

Restart a container

```bash
   docker restart <container_id or container_name>
```

## Authors

- [@sudheerdevv](https://github.com/sudheerdevv)
