class IntRange {
  constructor(lexp,rexp){
    if (lexp > rexp)
      throw type.Invalid.constructor("#VALUE!","Range isn't a valid subslicing");

    this.fst = lexp;
    this.snd = rexp;
  }

  length(){
    return this.snd - this.fst + 1;
  }

  is_multiple(a_len){
    return this.length() % a_len === 0;
  }

  toString(){
    return `${this.fst}..${this.snd}`;
  }
}

exports.IntRange = IntRange