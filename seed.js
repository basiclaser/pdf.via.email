const faker = require("faker");
const MongoClient = require("mongodb").MongoClient;

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
console.log("this file will create a bunch of fake data in your mongoDB using faker");

async function seedDB() {
    // Connection URL
    const uri = PUT_YOUR_MONGODB_URI_HERE;

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        // useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log("Connected correctly to server");

        const collection = client.db("seedtest").collection("aaa");

        // The drop() command destroys all data from a collection.
        // Make sure you run it against proper database and collection.
        collection.drop();

        // make a bunch of time series data
        let timeSeriesData = [];

        for (let i = 0; i < 5000; i++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            let newDay = {
                timestamp_day: faker.date.past(),
                cat: faker.random.word(),
                owner: {
                    email: faker.internet.email(firstName, lastName),
                    firstName,
                    lastName,
                },
                events: [],
            };

            for (let j = 0; j < randomIntFromInterval(1, 6); j++) {
                let newEvent = {
                    timestamp_event: faker.date.past(),
                    weight: randomIntFromInterval(14,16),
                }
                newDay.events.push(newEvent);
            }
            timeSeriesData.push(newDay);
        }
        await collection.insertMany(timeSeriesData);

        console.log("Database seeded! :)");
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

seedDB();