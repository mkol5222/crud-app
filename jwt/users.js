
const ROLES = {
    USER: 1,
    ADMIN: 2
}

const users = [
    {
        id: 1,
        username: 'acko',
        pass: 'secret',
        role: ROLES.USER
    },
    {
        id: 2,
        username: 'becko',
        pass: 'vpn123',
        role: ROLES.USER
    },
    {
        id: 3,
        username: 'guru',
        pass: 'please',
        role: ROLES.ADMIN
    }
]

module.exports = { ROLES, users }