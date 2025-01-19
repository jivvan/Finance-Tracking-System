### Running backend:
`cd backend`

`python -m venv venv`

`source venv/bin/activate`

`source .env`
> set env vars accordingly

`gunicorn wsgi:application`
> configure gunicorn if required

### Running frontend:
`cd frontend`

`npm install`

`npm run dev`

### Running test cases:
`cd backend`

`python -m unittest discover tests`
