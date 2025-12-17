# TechTinder API's

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET user/connections - it'll tell you all connection user have
- GET user/requests
- GET user/feed - Gets the profiles of the user on the platform (like Tinder it'll have 20-30 profile grouped to be reviewed)
