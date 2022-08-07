class LillyObject {
  constructor() {}
  isLazy() {
    return false;
  }
  isStruct() {
    return false;
  }
  isTuple() {
    return false;
  }
  isNominal() {
    return false;
  }
}

exports.LillyObject = LillyObject;
