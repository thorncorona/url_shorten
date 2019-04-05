const isUrl = require('valid-url').isWebUri;
const nanoid = require('nanoid');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const HOSTED_DOMAIN = "http://localhost:3000";


let app = express();
let urlencodedParser = bodyParser.urlencoded({
    extended: false
});
let jsonParser = bodyParser.json();

// init db.json if doesn't exist
db.defaults({
    shortLinks: {}
});

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// index
app.get('/', (req, res) => {
    res.render('index');
});

// shorten request from website
app.post('/shortLink', urlencodedParser, (req, res) => {
    let url = req.body.longUrl;

    if (isUrl(url)) {
        const shortLink = nanoid(7);
        db.set(`shortLinks.${shortLink}`, url)
            .write();
        res.render('shortened', {
            url,
            shortLink,
            HOSTED_DOMAIN
        });
    } else {
        res.send("invalid url!")
    }
});

// shorten request from api
app.post('/api/shortLink', jsonParser, (req, res) => {
    let url = req.body.longUrl;

    if (isUrl(url)) {
        const shortLink = nanoid(7);
        db.set(`shortLinks.${shortLink}`, url)
            .write();
        res.json({
            success: 'OK',
            shortLink: `${HOSTED_DOMAIN}/${shortLink}`,
        });
    } else {
        res.json({
            success: 'KO',
            error: 'Not a valid URL',
        })
    }
});

// at bottom so checks for other urls first. because shortUrls are exactly 7 letters
// and none of the other url links are, no collisions will occur
app.get('/:url(*)', (req, res) => {
    let url = db.get(`shortLinks.${req.params.url}`).value();
    if (isUrl(url)) {
        res.redirect(url);
    } else {
        res.send("invalid short link");
    }
});

app.listen(3000, () => {
    console.log('app running on port 3000');
});