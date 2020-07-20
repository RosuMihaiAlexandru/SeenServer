
//some helpful constants
module.exports={
    databaseUri: 'mongodb+srv://admin:seensecret@seencluster-j5fhu.gcp.mongodb.net/',
    database:{
        dbName: 'SeenDatabase/User'
    },
    //not sure we need this
    server:{
        port: 5000,
        // host: 'localhost',
        host: '167.99.200.101',
        //host: '192.168.0.171',
    },
    collections:{
        Users: 'Users',
        MembersChat: 'MembersChat',
        Venues: 'Venues',
        SettingsAndPreferences: 'SettingsAndPreferences',
        LogInfo: 'LogInfo',
        BigFive: 'BigFive'
    },
    //secret token used for hapi auth
    jwt:{
        secret: 'secret_key',
        expiresIn: '1d',
    }
}

