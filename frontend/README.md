# Frontend

## Tech Stack

- [Chakra UI](https://chakra-ui.com/docs/components)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Development

To make adjustments to only the frontend application:

Start other services

```bash
docker-compose -f docker-compose.frontend.yml up --build -d
```

Run `npm run dev` in the `frontend` directory.

Visit the frontend at http://localhost:3000

To stop the services

```bash
docker-compose -f docker-compose.frontend.yml stop
```

## References

- [Tailwind Cheatsheet](https://tailwindcomponents.com/cheatsheet/)
- [JWT with React](https://www.youtube.com/watch?v=nI8PYZNFtac)
- [Persistent user login](https://www.youtube.com/watch?v=27KeYk-5vJw)