# paperStack

PaperStack is an option for businesses to create invoices on the go. With a simple interface and a few options of templates to choose from, businesses can create professional looking invoices with ease.

## Setup

Dependencies...

### Prerequisites

What you'll need:

* Stripe API key - In order to receive payments from subscribers, you'll need to set up a Stripe account at https://stripe.com to retrieve an API key

### Installing

First, clone the repository from your terminal.

```bash
git clone https://github.com/Lambda-School-Labs/paperStack.git
```

Navigate in the local repo to the `server` directory, then install dependencies with yarn.

```bash
cd paperStack/server
yarn
```

Run `yarn start` to start the server.  
Now move to the client directory and once again install dependencies.

```bash
cd ../client
yarn
```

Now run `yarn start` to begin the development server. Browse to http://localhost:3000 to see changes you make to the application in realtime.

### Running Automated Tests

Testing will be done using Jest. Run tests using `yarn tests` in your terminal from the root of the project directory.

```bash
# This is an explanation of the following test, including what we are testing for.
This is an example of a test.
```

## Deployment

Node.js project deployed using [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction). You could use the link or do the following in your command line:

1.  heroku login
2.  heroku create
3.  git push heroku master
4.  heroku open

**TODO:** Enter detailed instructions for deploying the app, including continuous integration techniques.

## TBD...

## Built With MERN

* [MongoDB](https://www.mongodb.com/) - Database
* [Express.js](https://expressjs.com/) - Web framework
* [React](https://reactjs.org/) - User interface
* [Node.js](https://nodejs.org/) - Server Framework

## Authors

The major contributors who brought this project to life:

* **Ronald Cho** - [Lambda School](https://github.com/ronaldcho)
* **Jason Nuhn** - [Lambda School](https://github.com/JasonNuhn)
* **Teresa Strout** - [Lambda School](https://github.com/qapla47)
* **Dan Volosnikov** - [Lambda School](https://github.com/lightofdavinci)

## License

This project's licensing has yet to be determined.

## Acknowledgements

We have some people to thank . . .
