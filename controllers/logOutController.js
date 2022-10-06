const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const res = require('express/lib/response');
const path = require('path');

const handleLogout =  async (req,res) => {
    //on client, also delete the accesstoken

    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(204); //no content
    const refreshToken = cookies.jwt;

    // if refress token in DB ?
    const foundUser = usesrDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly : true} );
        return res.sendStatus(204); 
    }
    
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUsers, refreshToken: ' '};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname,'..','model','users.json'),
        JSON.stringify(usersDB.users)
    );
    res.clearCookie('jwt',{httpOnly: true, sameSite: 'None', secure:true }); //secure: ture - only serves on https
    res.sendStatus(204);
}


module.exports = { handleLogout }