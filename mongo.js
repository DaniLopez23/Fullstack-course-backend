const mongoose = require("mongoose");

if (process.argv.length > 5 || process.argv.length < 3) {
  console.log(
    "use: node mongo.js <password> <name> <number>\nor: node mongo.js <password> to show all entries"
  );
  process.exit(1);
}

console.log(`${process.argv.length} pass: ${process.argv[2]} name: ${process.argv[3]} number: ${process.argv[4]}`);

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://danisport8:${password}@fullstack-course-db.peyksb0.mongodb.net/?retryWrites=true&w=majority&appName=Fullstack-course-db`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: name,
  number: number,
});

if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log("person saved!");
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
    Person.find({}).then((result) => {
      console.log("phonebook:");
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    });
} else  {
    console.log(
      "use: node mongo.js <password> <name> <number>\nor: node mongo.js <password> to show all entries"
    );
    mongoose.connection.close();
}
