'use strict';

const uuidValidate = require('uuid-validate');

let validator = module.exports = {};

/**
 * Based on a set of rules, is the input valid?
 * TODO: Define the rules ... how do we send them in? How do we identify?
 * @param input
 * @param rules
 * @returns {boolean}
 */


validator.isUUID = input => {
  return uuidValidate(input, 4);
};

const isTruthy = (input) => {
  return !!input;
};

const isCorrectType = (input, field) => {
  switch(field.type) {
  case 'string': return validator.isString(input);
  case 'number': return validator.isNumber(input);
  case 'array': return validator.isArray(input, field.valueType);
  case 'object': return validator.isObject(input);
  case 'boolean': return validator.isBoolean(input);
  default: return false;
  }
};

validator.isValid = (schema, data) => {

  for (let fieldName in schema) {

    let field = schema[fieldName];
    if(field.required && !(fieldName in data && isTruthy(data[fieldName])) ){
      return false;
    }

    if('type' in field && fieldName in data && !isCorrectType(data[fieldName], field)) {
      return false;
    }
  }

  return true;
};



/**
 * Is this a string?
 * @param input
 * @returns {boolean}
 */
validator.isString = (input) => {
  return typeof input === 'string';
};

/**
 * Is this a number?
 * @param input
 * @returns {boolean}
 */
validator.isNumber = (input) => {
  return typeof input === 'number';
};

/**
 * Is this an Array?
 * @param input
 * @returns {boolean}
 */
validator.isArray = (input) => {
  return Array.isArray(input);
};

/**
 * Is this an Object?
 * @param input
 * @returns {boolean}
 */
validator.isObject = (input) => {
  return typeof input === 'object'&&!Array.isArray(input);
};

/**
 * Is this a boolean?
 * @param input
 * @returns {boolean}
 */
validator.isBoolean = (input) => {
  return typeof input === 'boolean';
};

/**
 * Is this a function?
 * @param input
 * @returns {boolean}
 */
validator.isFunction = (input) => {
  return typeof input === 'function';
};

/////////// complex validations //////////////

/**
 * Does an Object have valid properties? Validates 
 * the presence of required object properties at any level.
 * @param input
 * @param prop
 * @returns {boolean}
 */

validator.isObjectHasProperty = (input, prop) => {
  for (let p in input) {
    if (p === prop ){
      return  true;
    }
    if (validator.isObject(input[p]) && validator.isObjectHasProperty (input[p], prop)){
      return  true;
    }
  } 
  return false;
};

/**
 * Does an Object have valid properties types? 
 * Validates the proper types of object properties.
 * @param input
 * @param prop
 * @param prop_type
 * @returns {boolean}
 */


validator.isObjectPropertyHasCorrectType = (input, prop, prop_type) => {
  for (let p in input) {   
    if (p === prop && typeof input[p] !== prop_type){
      return  false;
    }
    if (validator.isObject(input[p]) && !validator.isObjectPropertyHasCorrectType (input[p], prop, prop_type)){
      return  false;
    }
  } 
  return true; 
};

/**
 * Validates the proper types of object properties if given propery exists 
 * (combination of two previous recurcive functions).
 * @param input
 * @param prop
 * @param prop_type
 * @returns {boolean}
 */
validator.isObjectPropertyCorrect = (input, prop, prop_type) => {
  if (validator.isObjectHasProperty (input, prop)&&validator.isObjectPropertyHasCorrectType (input, prop, prop_type)){
    return true;
  }
};

/**
 * Does an Array's values have correct type? 
 * Validates the types of values contained in an array.
 * @param input
 * @param value_type
 * @returns {boolean}
 */

validator.isArrayValueHasCorrectType = (input, value_type) => {
  if(!validator.isArray (input)){
    return false;
  }
  for(let i=0; i < input.length; i++){
    if(typeof input[i] !== value_type){
      return false;
    } 
  }
  return true;
};


/**
 * Does an Array's values have approved type? 
 * Validates a value of an array against an approved list.
 * @param input
 * @param approved_list
 * @returns {boolean}
 */

validator.isArrayValueHasApprovedType = (input, approved_list) => {
  let flag = true;
  input.forEach(element => {
    if (!approved_list.includes(element)){
      flag = false;
    }
  });
  return flag;
};