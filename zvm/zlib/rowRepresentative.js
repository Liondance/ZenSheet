const Representative = require('./representative.js').Representative;

class RowRepresentative extends Representative {
  static generator(initial){
    let index = initial ? initial : 0 ;
    return {
      next: function(){
        return {value: index++ ,done:false}
      }
    }
  }
  constructor(id){
    super(id);
  }
}

exports.RowRepresentative = RowRepresentative;