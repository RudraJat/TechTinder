# TechTinder API's

## authRouter
- POST /signup
- POST /login
- POST /google-login - Login/signup with Google OAuth
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/passwordChange

## connectionRequestRouter
- POST /request/send/:status/:userId -(status: ignored/interested)
- POST /request/review/:status/:requestId -(status: accepted/rejected)

## userRouter
- GET user/requests/received
- GET user/connections - it'll tell you all connection user have
- GET user/feed - Gets the profiles of the user on the platform (like Tinder it'll have 20-30 profile grouped to be reviewed)

status: ignored, interested, accecpted, rejected