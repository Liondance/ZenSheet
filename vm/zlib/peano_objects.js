class PeanoObject {
    constructor(){ }
    isLazy()   {return false;}
    isStruct() {return false;}
    isTuple()  {return false;}
    isNominal(){return false;}
}

exports.PeanoObject = PeanoObject;