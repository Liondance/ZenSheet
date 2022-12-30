exports.Representative = class Representative {
  constructor(id){
    this.id = id;
    this.invalid = false;
  }
  // Replace with the representative 
  replace(next){
    this.id = next;
  }
  get_value(){
    // console.log(`[${this.id}]`)
    return this.id;
  }
  toString(){
    return String(this.id);
  }
  remove(){
    this.invalid = true;
  }
  is_invalid(){
    // console.log(`Is invalid? ${this.invalid}`)
    return this.invalid;
  }
  
}