# Backend Repository Documentation

[Frontend Repository](https://github.com/andreatranchina/fuse-video)

## Endpoints

root: https://fuse-video-backend.onrender.com/

### Users

- `GET /user/allUsers`: Get all users from the database.

- `GET /user/:id`: Get a single user's details by their user ID.

- `GET /user/viewProfile/:id`: Get a user's profile, followers, and mutual followers based on their user ID. Requires `loggedInUserId` as a query parameter to determine the accessing user.

- `GET /user/byEmail/:email`: Get a user's data based on their email.

- `POST /user`: Creates a new user record in the database. Requires providing user details such as `email`, `imgUrl`, `firstName`, and `lastName`.

- `PUT /user/:id`: Updates a user's information based on their user ID. Accepts `userName`, `firstName`, `lastName`, `email`, `imgUrl`, `mobile`, `country`, `state`, `city`, `bio`, `language`, `isDeactivated`, `isPrivate`, `mobileNotifications`, and `emailNotifications`.

### Follow

- `GET /followers/:userId`: Get followers for a user by their ID

- `GET /followings/:userId`: Get an array of user IDs followed by the logged-in user (by `loggedInUserId`).

- `POST /follow`: Follows a user by creating a new `Follow` record in the database. Requires `loggedInUserId` and `userId` in the request body.

- `DELETE /follow`: Unfollows a user by deleting the `Follow` record from the database. Requires `loggedInUserId` and `userId` in the request body.

### Livestream

- `GET /livestreams`: Get all livestreams from the database.

- `GET /livestream/:id`: Get a single livestream by its ID.

- `GET /livestream/byCode/:code`: Get a livestream by its unique code.

- `POST /livestream`: Adds a new livestream record to the database. Requires providing livestream details such as `title`, `description`, `user_id`, and `code`.

- `DELETE /livestream/:id`: Deletes a livestream record by its ID.

### Videochat

- `GET /videochats`: Get all videochats from the database.

- `GET /videochats/:id`: Get a single videochat by its ID.

- `GET /videochats/byCode/:code`: Get a videochat by its unique code.

- `POST /videochats`: Adds a new videochat record to the database. Requires providing videochat details such as `title`, `description`, `user_id`, and `code`.

- `DELETE /videochats/:id`: Deletes a videochat record by its ID.

### Message

- `GET /messages`: Get all messages from the database.

- `GET /messages/:id`: Get a single message by its ID.

- `POST /messages`: Adds a new message record to the database. Requires providing message details such as `content`, `user_id`, `livestream_id`, and `videochat_id`.

- `DELETE /messages/:id`: Deletes a message record by its ID.

## Setup Instructions

To set up the backend on your local machine, follow these steps:

1. Install the necessary dependencies using `npm i`.

2. Set up a .env file and use the your own API keys:

`  GOOGLE_ID= 
  GOOGLE_CLIENT_SECRET= 
  GOOGLE_CALLBACK_URL= 
  ELASTICEMAIL_USER= 
  ELASTICEMAIL_KEY= 
  TWILIO_SID= 
  TWILIO_AUTH_TOKEN= 
  TWILIO_PHONE_NUMBER= 
 `

4. Start the server using `npm start`.

5. Create the database and run `node seed.js`.
