const express = require('express');
const { auth } = require('express-openid-connect');

// depends on .env - see .env-sample
require('dotenv').config();

const app = express();

app.use(auth({
    idpLogout: true,
    authorizationParams: {
        scope: 'openid',
        scope: 'openid profile email',
        response_type: 'id_token',
    }
}));

app.get('/', async (req, res) => {

    let userInfo = {};
    try {
        userInfo = await req.oidc.fetchUserInfo();
    } catch (err) {
        console.error(err);
    }
    console.log(userInfo);
    res.send(`hello ${req.oidc.user.name} <pre>${JSON.stringify(req.oidc.user, null, 2)}</pre> <a href="/logout">Logout</a>`); //${JSON.stringify(userInfo, null, 2)}`);



});

app.set('trust proxy', true);
app.listen(3000, '0.0.0.0', () => console.log('listening at http://localhost:3000'))
