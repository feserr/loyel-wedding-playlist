function isEmptyOrSpaces(str: string){
  return str === null || str.match(/^ *$/) !== null;
}

export {isEmptyOrSpaces};
