# Online Code Compiler

A web-based **online code compilation** platform that allows users to write, execute, and test code in multiple programming languages. This project is designed for developers, students, and anyone who wants to run code online without setting up a local environment.

## API Reference

#### Execute Code

```http
  POST /api/execute
```

| Parameter    | Type     | Description                               |
| :---------- | :------ | :---------------------------------------- |
| `language`  | `string` | **Required**. Programming language (e.g., Python, C++) |
| `code`      | `string` | **Required**. The code to be executed    |
| `input`     | `string` | Optional. Standard input for the program |

#### Get Execution Result

```http
  GET /api/result/${id}
```

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `id`      | `string` | **Required**. ID of executed code to fetch result |

## Installation

Install and run the project locally:

```bash
  git clone https://github.com/yourusername/online-code-compiler.git
  cd online-code-compiler
  npm install
  npm run dev
```
    
## Screenshots

![Screenshot (134)](https://github.com/user-attachments/assets/63bde887-31e9-415e-a00a-8df8d9b61928)M

## Tech Stack

**Client:** React, TailwindCSS  
**Server:** Node.js, Express.js  
**Database:** MongoDB, Firebase  
**Other Tools:** WebSockets, REST APIs, Docker, AWS

## Features
- Supports multiple programming languages (Python, C++, Java, etc.)
- Real-time code execution with WebSockets
- Secure sandbox environment for running code
- User authentication and history tracking
- Optimized backend for scalable performance

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
