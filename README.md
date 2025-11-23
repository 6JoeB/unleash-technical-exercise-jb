# Autompletable Addresses

A React + Node.js TypeScript app for searching addresses with autocomplete.  

**Live demo:** [https://address-search.onrender.com](https://address-search.onrender.com)

## Features

- Autocomplete street search (min 3 chars, max 20 results)  
- Keyboard navigation (Arrow keys, Enter, Escape)  
- Displays street, postal number, city  
- Debounced API calls to reduce network load

## Tech Stack

- Front-end: React, TypeScript, Axios  
- Back-end: Node.js, Express, TypeScript  
- Testing: Jest, React Testing Library  

## Local Setup

### Back-end

#### Requirements

- Node.js and npm

#### Install
from /server run
```
npm install
```
#### Run server
from /server  run
```
npm start
```
#### Run tests
from /server run
```
npm test
```

### front-end

#### Requirements

The front-end needs to know where your back-end API is running.

Locally, you can create a .env file in client/
```
REACT_APP_API_URL=http://localhost:4000
```

#### Install
from /client run
```
npm install
```
#### Run client
from /client  run
```
npm start
```
#### Run tests
from /client run
```
npm test
```


