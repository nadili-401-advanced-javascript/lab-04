const Model = require('../models/model.js');
// const Teams = require('../models/teams.js');
// const People = require('../models/people.js');

let mod = new Model(  
  {
    id: { required: true, type: 'uuid' },
    firstName: { required: true, type: 'string' },
    lastName: { required: true, type: 'string' },
    team: { type: 'uuid' },
  },
  null
);

let gObj =   {
  'firstName': 'Tim',
  'lastName': 'David',
};


// let badObj =   {
//   'team': 'cefeb171-adba-4604-9e8c-a00aefbb9053',
// };

describe('Model', () => {
  // How might we repeat this to check on types?
  it('sanitize() returns undefined with missing requirements', () => {
    
    expect(mod.sanitize(gObj)).toBeTruthy();
    // expect(mod.sanitize(badObj)).toBeFalsy();
  });

  it('can create', () => {   
    // expect(newPerson.firstName).toEqual('Tim');
    // expect(newPerson.lastName).toEqual('David');
    //expect(p.id).toBeTruthy();
  });

  it('can read', () => {});

  it('can update', () => {});

  it('can delete', () => {});
});
