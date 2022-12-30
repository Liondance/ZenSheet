exports.has = function(object,field){
  return object != null && (object.hasOwnProperty(field) || Object.getPrototypeOf(object).hasOwnProperty(field))
}