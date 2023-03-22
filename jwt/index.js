const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
// get config vars
dotenv.config();
// access config var
// console.log(process.env.TOKEN_SECRET)

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user
        console.log(user)
        next()
    })
}

const { users, ROLES } = require('./users')

const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/login', function (req, res, next) {
    // console.log(req)
    console.log(req.body.username, req.body.password);
    console.log(users)
    const userFound = users.find(u => ((u.username === req.body.username) && (u.pass === req.body.password)))
    if (!userFound) { res.send(401); } else {
        const token = generateAccessToken({ username: userFound.username, role: userFound.role })
        console.log(userFound)
        res.json({ 'welcome': req.body.username, token })
    }

})

app.get('/api/me', authenticateToken, (req, res) => {
    // executes after authenticateToken
    console.log(req.user)
    const isAdmin = req.user.role === ROLES.ADMIN
    console.log('searching for ', req.user.user)
    const userFound = users.find(u => (u.username === req.user.username))
    delete userFound.pass;
    const profile = {
        ...userFound,
        isAdmin
    }
    res.json(profile)
})

app.get('/api/protectedPosts', authenticateToken, (req, res) => {
    // executes after authenticateToken
    // ...
    console.log('reached protected content')

    res.json([
        {
            "title": "aaa bbb",
            "body": "dsdsd dsdsd dsds"
        },
        {
            "title": "aaccca bbb",
            "body": "cccc dsdsd dsdsd dsds"
        },
    ])
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})