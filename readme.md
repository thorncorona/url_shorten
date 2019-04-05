# URL Shortener Sample Project

### Overview

A simple URL simpler with a web and API interface. Accepts a fully formed long URL and will return a short-link. 

### Install Process

1. Install Yarn
2. `yarn install`
3. `node server.js`

### API Documentation

```
POST /api/shortLink
Accept: {
    "longUrl": accepts valid url
}

Returns: {
    "success": "OK" or "KO" depending on success/failure respectively
    "error": returns error message on failure
    "shortLink": returns shortlink if successful
}
```

### Website

1. Enter URL into form
2. Retrieve shortlink 

### Caveats

- Link shortener will only check if your link meets the URI requirements. It doesn't check whether the URL is live.
- Each shortened URL is unique, even if originating URLs may be the same. This means you can't easily guess shortened links. 
- Hardcoded to run on `http://localhost:3000`