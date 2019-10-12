'use strict';

const Teams = require('./models/teams.js');
const People = require('./models/people.js');
const validator = require('./lib/validator.js');
const uuidValidate = require('uuid-validate');

//.  0.    1.      2.     3
// node index.js.  ??    ??
let people = new People(process.argv.slice(2)[0]);
let teams = new Teams(process.argv.slice(3)[0]);

async function loadData() {
  let peopleData = await people.load();
  let teamData = await teams.load();
}

async function createPerson(person) {
  // In order to create a new person
  // check if their team exists
  // if not, create a new team
  // set this new person's team equal to the new
  // team id created
  // finaly, create this person

  let team = await findTeam(person.team);

  if (!team.id) {
    // should we first validate that:
    // person.team exists
    // person.team is NOT a uuid
    team = await teams.create({ name: person.team });

    // create the team
    // get that new id
    // create person
  }

  return await people.create({ ...person, team: team.id });
}

async function findTeam(val) {
  // val can be either id or a string
  // shouldn't matter, i should just try to find
  // if that team exists

  let result = {};

  if (validator.isString(val)) result = await teams.read('name', val);
  else if (validator.isUUID(val)) result = await teams.read('id', val);

  return result;
}

async function readPerson(person) {
  // search
  // go through and read the people database
  // find people that match whatever params this function
  // has
  return people.read("id", person.id);
}

async function updatePerson(id, newPersonData) {
  // call people.update
  // UNLESS
  // did this person change teams?
  // if they did
  // you need to verify the team they are now in exists
  // and you need to verify the team they left still has some people
  let person = people.read("id", id);
  if(person==={}){
    people.create(newPersonData);
  }else if(!('team' in person) || !('team' in newPersonData) ||  person.team===newPersonData.team) { 
    people.update(person.id, newPersonData);
  }else{
    let count = people.countElements("team", person.team);
    if(count === 1){
      teams.delete(person.team);
    }
    people.update(person.id, newPersonData);
  }

}

async function deletePerson(id) {
  // if you delete a person and their team
  // no longer has people
  // you should delete the team!
  let person = people.read("id", id);
  if (person==={}){
    console.log("person not found");
  } else if(!('team' in person)) { 
    people.delete(id);
  } else{
    let count = people.countElements("team", person.team);
    if (count === 1){
      teams.delete(person.team);
    }
    people.delete(person.id);
  }
}

async function printTeams() {
  // for each team
  // print the name
  // print the members of that team
  await teams.read();
  teams.forEach(team => {
    console.log("\n"+ team.name);
    people.forEach(person => {
      if ("team" in person && person.team === team.id){
        console.log("\t"+person.firstName+" "+person.lastName);
      }
    });  
  });
  console.log("\nPeople without team");
  people.forEach(person => {
    if (!("team" in person) || !person.team){
      console.log("\t"+person.firstName+" "+person.lastName);
    }
  });  
}

async function runOperations() {
  await loadData();
  await createPerson({
    firstName: 'Sarah',
    lastName: 'Smalls',
    team: 'Belka'
  });
  findTeam();
  readPerson({
    firstName: 'Sarah',
    lastName: 'Smalls'
  });
 // printTeams();

}


runOperations();
