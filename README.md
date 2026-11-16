# Java Web Calculator

A desktop calculator application built with **Java 21, Spring Boot, JavaScript and Electron**. The project combines a RESTful backend with a modern web interface and aims to deliver a standalone Windows desktop application.

## Overview

Java Web Calculator is a full-stack calculator application designed to perform mathematical operations through a dedicated Java backend.

The project follows a layered architecture, separating the presentation layer, business logic and API communication.

The application is being developed to run both as a web application and as a standalone desktop application using Electron.

## Features

### Mathematical Operations
- Addition, subtraction, multiplication and division.
- Decimal number support.
- Chained mathematical operations.
- Operator precedence.
- Parentheses support.
- Negative numbers.
- Division-by-zero handling.

### Backend
- RESTful API built with Spring Boot.
- Layered architecture (Controller, Service and DTO).
- Mathematical expression evaluation using the Shunting Yard algorithm.
- High-precision decimal arithmetic with `BigDecimal`.
- Centralized exception handling.
- Input validation.

### Frontend
- Responsive user interface.
- Dark-themed calculator design.
- JavaScript-based interaction.
- Asynchronous communication with the backend using Fetch API.
- Calculation history using browser localStorage.
- Previous calculation retrieval.

### Desktop Application
- Electron-based desktop interface.
- Automatic Spring Boot backend startup.
- Independent application window.
- Backend process lifecycle management.
- Planned standalone Windows installer with an embedded Java runtime.

## Tech Stack

| Technology | Purpose |
|---|---|
| Java 21 | Backend development |
| Spring Boot | REST API and application framework |
| Maven | Dependency management and build automation |
| JavaScript | Frontend logic |
| HTML5 | User interface structure |
| CSS3 | Styling and responsive design |
| Electron | Desktop application |
| Electron Builder | Desktop packaging |
| jpackage | Java runtime packaging |
| Git | Version control |

## Architecture

The application follows a layered architecture.

```text
java-web-calculator/
│
├── electron/
│   ├── main.js
│   └── preload.js
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/calculator/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── dto/
│   │   │       └── exception/
│   │   │
│   │   └── resources/
│   │       └── static/
│   │           ├── index.html
│   │           ├── css/
│   │           │   └── styles.css
│   │           └── js/
│   │               └── calculator.js
│   │
│   └── test/
│
├── target/
├── package.json
├── pom.xml
└── README.md
```

## REST API

The backend exposes the following endpoints:

### 1. Basic Calculation

**POST** `/api/calculator/calculate`

Request:

```json
{
  "number1": 10,
  "number2": 5,
  "operation": "+"
}
```

Response:

```json
{
  "number1": 10,
  "operation": "+",
  "number2": 5,
  "result": 15
}
```

Supported operators: `+`, `-`, `*`, `/`.

### 2. Mathematical Expression Evaluation

**POST** `/api/calculator/expression`

Request:

```json
{
  "expression": "5 + 3 * 2"
}
```

Response:

```json
{
  "expression": "5 + 3 * 2",
  "result": 11
}
```

The expression evaluator uses the Shunting Yard algorithm to handle operator precedence and parentheses.

## Getting Started

### Prerequisites

For development, you need:

- Java JDK 21.
- Node.js and npm.
- Maven (or the included Maven Wrapper).
- Git.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/java-web-calculator.git

cd java-web-calculator
```

### 2. Build the Java backend

On Windows:

```powershell
.\mvnw.cmd clean package
```

### 3. Run the web application

```powershell
.\mvnw.cmd spring-boot:run
```

Open your browser:

```text
http://localhost:8080
```

### 4. Run the desktop application

Install the Node.js dependencies:

```bash
npm install
```

Start Electron:

```bash
npm start
```

The Electron application starts the Spring Boot backend automatically.

**Note:** The current development configuration requires Java to be installed on the host machine. A self-contained Java runtime is planned for the production distribution.

## Development Scripts

| Command | Description |
|---|---|
| `.\mvnw.cmd spring-boot:run` | Run the Spring Boot application |
| `.\mvnw.cmd clean package` | Build the backend JAR |
| `npm install` | Install Node.js dependencies |
| `npm start` | Launch the Electron application |
| `npm run dist` | Generate the Windows installer (after packaging configuration is completed) |

## Future Improvements

- [ ] Complete standalone Java runtime packaging using jpackage.
- [ ] Automate backend startup and shutdown in production.
- [ ] Generate a Windows installer using Electron Builder and NSIS.
- [ ] Add keyboard input support.
- [ ] Improve expression validation and error handling.
- [ ] Implement unit tests with JUnit 5 and Mockito.
- [ ] Add integration tests for REST endpoints.
- [ ] Improve the calculation history interface.
- [ ] Add persistent calculation history using a database.
- [ ] Improve application security and packaging.

## Learning Objectives

This project explores several software engineering concepts:

- REST API development.
- Object-oriented programming.
- Layered software architecture.
- Separation of concerns.
- Mathematical expression parsing.
- Asynchronous JavaScript.
- Desktop application development.
- Process management.
- Application packaging and distribution.

## License

This project is distributed under the MIT License.
