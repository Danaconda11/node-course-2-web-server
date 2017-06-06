const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
var app = express();
const port = process.env.PORT || 3000;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

/* middlewear */
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now} : ${req.method} ${req.url}`;
	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to sever.log')
		}
	});
	next();
})

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear()
});

hbs.registerHelper('screamIt', input =>{
	return input.toUpperCase();
});

app.get('/', (req, res) => {
	res.render('home.hbs', {
		title : "Welcome",
		message : "Hello there!"
	})
})
.get('/about', (req, res) => {
	var dataset = {
		title : "About",
		someText : 'heyo'
	}
	res.render('about.hbs', dataset)
})
.get('/bad', (req, res) => {
	res.send({errorMessage : 'error handling request'})
})
.get('/maintenance', (req, res) => {
	maintentance()
})
.get('/projects', (req, res) => {
	res.render('projects.hbs', {
		title : 'Projects',
		message : 'Projects Page'
	})
})

/*
	heroku sets this environment variable for the port
*/
app.listen(port, () => {
	console.log(`Server is up on port ${port}`)
});
