const { connect, postUser, findUser, disconnect } = require('./db');
const User = require("../api/models/user");
const mongoose = require('mongoose');

jest.mock('./db')

describe("DB Functions", () => {
    test("As a user, I want to post a user to MongoDB", async ()=> {
        const newUser = User({
            _id: mongoose.Types.ObjectId(),
            firstName: 'Aleyna',
            email: 'ACintron1@student.fullsail.edu',
            password: 'password123'
        });

        await connect();
        const user = await postUser(newUser);
        expect(user.firstName).toEqual('Aleyna');
        expect(user.email).toEqual('ACintron1@student.fullsail.edu');
        expect(user.password).toEqual('password123')
        await disconnect();
    });
    test("As a user, I want login to the database", async ()=> {
        await connect();
        const user = await findUser('ACintron1@student.fullsail.edu');
        expect(user.firstName).toEqual('Aleyna');
        expect(user.email).toEqual('ACintron1@student.fullsail.edu');
        expect(user.password).toEqual('password123')
        await disconnect();
    });
});