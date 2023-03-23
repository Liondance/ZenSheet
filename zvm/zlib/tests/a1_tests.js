const RepresentativePool = require('../a1.js').RepresentativePool;

an_example = new RepresentativePool(5,25,"testing");
a1 = an_example.get_accessor(3,24);
console.log(an_example.toString());
console.log(a1.toString())
an_example.update_insert("col",22,1);
console.log(an_example.toString());
console.log(a1.toString())
an_example.update_insert("col",18,2);
console.log(an_example.toString());
console.log(a1.toString())
an_example.update_insert("col",1,3);
console.log(an_example.toString());
console.log(a1.toString())

console.log("Starting row insertion")
an_example.update_insert("row",0,1);
console.log(an_example.toString());
console.log(a1.toString())
an_example.update_insert("row",3,2);
console.log(an_example.toString());
console.log(a1.toString())
an_example.update_insert("row",4,3);
console.log(an_example.toString());
console.log(a1.toString())

console.log(`Starting with deletions`)
an_example.update_delete("col",5,2);
console.log(an_example.toString());
console.log(a1.toString())
an_example.update_delete("col",0,2);
console.log(an_example.toString());
console.log(a1.toString())
an_example.update_delete("row",10,1);
console.log(an_example.toString());
console.log(a1.toString())
an_example.update_delete("row",0,5);
console.log(an_example.toString());
console.log(a1.toString())