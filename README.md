# PinItUp

PinItUp is a clone of Pintrest. It is a social media platform based around images more so than text and news. With a modern and slick feel as well as an easy-to-navigate layout, this clone is (almost) the real deal. 

# Live Link

https://pinitup.onrender.com/

## Tech Stack
### Frameworks and Libraries
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)

 ### Database:
 ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
  
 ### Hosting:
 ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

# Endpoints
## Auth

| **Endpoint**                                     | **Method**   | **Description**                                        |
| ----------------------------------------------- | ------------ | ------------------------------------------------------ |
| **Users API**                                   |              |                                                        |
| `/users/`                                      | GET          | Query for all users and return them in a list of user dictionaries. |
| `/users/username/<string:username>`             | GET          | Query for a user by username and return that user in a dictionary. |
| `/users/<int:id>`                              | GET          | Query for a user by ID and return that user in a dictionary. |
| `/users/set/<int:id>`                         | GET          | Query to set the current user with updated information. |
| `/users/follow/<int:creatorId>`                | PUT          | Follow another user.                                   |
| `/users/unfollow/<int:creatorId>`              | PUT          | Unfollow another user.                                 |
| `/users/<string:username>/edit`                | PUT          | Update user profile.                                   |
| **Authentication API**                          |              |                                                        |
| `/auth/`                                       | GET          | Authenticates a user.                                  |
| `/auth/login`                                  | POST         | Logs a user in.                                        |
| `/auth/logout`                                 | GET          | Logs a user out.                                       |
| `/auth/signup`                                 | POST         | Creates a new user and logs them in.                   |
| `/auth/unauthorized`                           | GET          | Returns unauthorized JSON when flask-login authentication fails. |
| **Boards API**                                 |              |                                                        |
| `/boards/<string:username>/all`                | GET          | Get all boards for a user.                             |
| `/boards/<int:id>`                            | GET          | Get a single board.                                    |
| `/boards/new`                                 | POST         | Create a new board.                                    |
| `/boards/<int:id>/edit`                      | PUT          | Update a single board.                                 |
| `/boards/<int:id>/addpin`                    | PUT          | Add a pin to a board.                                  |
| `/boards/<int:id>/removepin`                 | DELETE       | Remove a pin from a board.                             |
| `/boards/<int:id>`                            | DELETE       | Delete a board.                                        |
| **Pins API**                                   |              |                                                        |
| `/pins/`                                      | GET          | Get all pins.                                          |
| `/pins/<string:username>/all`                 | GET          | Query all pins by username for the profile page.       |
| `/pins/newpin`                                | POST         | Create a new pin.                                      |
| `/pins/<int:id>/edit`                        | PUT          | Update a single pin.                                   |
| `/pins/<int:id>`                              | GET          | Get a single pin.                                      |
| `/pins/<int:id>/comment`                     | POST         | Add a comment to a pin.                                |
| `/pins/<int:id>/comment`                     | DELETE       | Delete a comment from a pin.                           |
| `/pins/<int:id>`                              | DELETE       | Delete a pin.                                          |

# Installation

1. `pipenv install` in the root
2.  `npm install` in the react-app folder
3. create a .env file at the root that matches the .env.example file
4. run the command `pipenv shell`
5. open two terminals: one at the root(A), and one in the react-app folder (B)
6. terminal A - run `flask run db migrate` followed by `flas run db upgrade` and finally `flask run seed all`
7. to begin the local server: on terminal A - run `flask run` and terminal B - run `npm start` this should automatically open a new tab in your browser running the live server on port 3000

# Screenshots
Splash
![image](https://github.com/darocket34/PinItUp/assets/130183749/37caa718-42b5-409d-8662-c9a985dfe470)

Login Modal
![image](https://github.com/darocket34/PinItUp/assets/130183749/58197608-6f83-43a7-9651-e60edead3aa5)

Signup Modal
![image](https://github.com/darocket34/PinItUp/assets/130183749/d18bcc7d-857b-47bf-b063-9d270d268a64)

Homepage
![image](https://github.com/darocket34/PinItUp/assets/130183749/420d5994-9df8-4d43-8dbc-58eb6ef3909b)

Pin Details Modal
![image](https://github.com/darocket34/PinItUp/assets/130183749/6927274f-8af5-40f5-9d29-cefbb9df9dd2)

Profile Page
![image](https://github.com/darocket34/PinItUp/assets/130183749/dc260fec-1d5e-418d-95fe-d0fbfffebc2e)

# Connect
[LinkedIn](https://www.linkedin.com/in/darian-brooks92/)

[Portfolio](https://darianbrooks.info)
