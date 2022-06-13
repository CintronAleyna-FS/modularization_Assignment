const connect = async() => {
    console.log('Mock Connecting');
}

const postUser = async (newUser) => {
    console.log('Mock Post User');
    return Promise.resolve({
        firstName: 'Aleyna',
        email: 'ACintron1@student.fullsail.edu',
        password: 'password123'
    })
    
}

const findUser = async (email) => {
    console.log('Mock Find User');
    return Promise.resolve({
        firstName: 'Aleyna',
        email: 'ACintron1@student.fullsail.edu',
        password: 'password123'
    })
};

const disconnect = async() => {
    console.log('Mock Disconnecting');
}

module.exports = { connect, postUser, findUser, disconnect}