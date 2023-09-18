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

# Index

[Feature List](https://github.com/darocket34/PinItUp/wiki/Feature-List) | [Database Schema](https://github.com/darocket34/PinItUp/wiki/Database-Schema) | [User Stories](https://github.com/darocket34/PinItUp/wiki/User-Stories) | [Wireframes](https://github.com/darocket34/PinItUp/wiki/WireFrame)


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

# Feature List
1. Pins
2. Boards
3. Comments
4. Search
5. Follows

# Future Implementation Goals
1. Messaging
2. Stylistic Splash Page
3. Night Mode

# Connect
[LinkedIn](https://www.linkedin.com/in/darian-brooks92/)
