
//some helpful constants
module.exports={
    databaseUri: 'mongodb+srv://admin:seenadmin@seencluster-j5fhu.gcp.mongodb.net/',
    database:{
        dbName: 'SeenDatabase/User'
    },
    //not sure we need this
    server:{
        port: 5000,
        //host: 'localhost',
        host: '167.99.200.101',
    },
    collections:{
        Users: 'Users',
        MembersChat: 'MembersChat',
        Venues: 'Venues'
    },
    //secret token used for hapi auth
    jwt:{
        secret: 'secret_key',
        expiresIn: '1d',
    }
}

