var predef  = require('./predef.js');
var Complex = require('./node_modules/complex.js/complex');

///
/// Engineering functions
///

exports.BIN2DEC = function bin2dec(number){
	number = number.toString(), n = number.length;
	if (n > 10)	{
		throw predef.Error("#NUM!","The value introduced is not allowed");
	}
	var result = 0;
	for (var i=0;i<n;i++){
		var tmp = parseInt(number[n-(i+1)]);
		if ((tmp<0) || (tmp>1)){
			throw predef.Error("#NUM!","The value introduced is not allowed");
		}
		if (i==9){
			result += -tmp*Math.pow(2,i);
			break;
		}
		result += tmp*Math.pow(2,i);
	}
	return result;
}

exports.BIN2DEC_D = function bin2dec(number){
	number = number.toString(), n = number.length;
	if (n > 10)	{
		return predef.Error("#NUM!","The value introduced is not allowed");
	}
	var result = 0;
	for (var i=0;i<n;i++){
		var tmp = parseInt(number[n-(i+1)]);
		if ((tmp<0) || (tmp>1)){
			return predef.Error("#NUM!","The value introduced is not allowed");
		}
		if (i==9){
			result += -tmp*Math.pow(2,i);
			break;
		}
		result += tmp*Math.pow(2,i);
	}
	return result;
}

exports.BIN2HEX = function bin2hex(number,places){
	var objects = {0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",10:"A",11:"B",12:"C",13:"D",14:"E",15:"F"};
	var decimal = BIN2DEC(number), result = "", dividend = decimal, tmp = 0;
	while (dividend>=16){
		tmp = dividend%16;
		result+=objects[tmp].toString();
		dividend=Math.floor(dividend/16);
	}
	result+=objects[dividend].toString();
	if (places == undefined) {
		places = result.length;
	}
	if (typeof places != "number") {
		throw predef.Error("#VALUE!","The places value must be a number")
	}
	if ((places<0) || (places>10) || (places<result.length)) {
		throw predef.Error("#NUM!","The places value is not allowed");
	}
	for (var i=result.length;i<places;i++){
		result+="0";
	}
	return result.split('').reverse().join('');
}

exports.BIN2HEX_D = function bin2hex(number,places){
	var objects = {0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",10:"A",11:"B",12:"C",13:"D",14:"E",15:"F"};
	var decimal = exports.BIN2DEC_D(number), result = "", dividend = decimal, tmp = 0;
	while (dividend>=16){
		tmp = dividend%16;
		result+=objects[tmp].toString();
		dividend=Math.floor(dividend/16);
	}
	result+=objects[dividend].toString();
	if (places == undefined) {
		places = result.length;
	}
	if (typeof places != "number") {
		return predef.Error("#VALUE!","The places value must be a number")
	}
	if ((places<0) || (places>10) || (places<result.length)) {
		return predef.Error("#NUM!","The places value is not allowed");
	}
	for (var i=result.length;i<places;i++){
		result+="0";
	}
	return result.split('').reverse().join('');
}

exports.BIN2OCT = function bin2oct(number,places){
	var objects = {0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7"};
	var decimal = BIN2DEC(number), result = "", dividend = decimal, tmp = 0;
	while (dividend>=8){
		tmp = dividend%8;
		result+=objects[tmp].toString();
		dividend=Math.floor(dividend/8);
	}
	result+=objects[dividend].toString();
	if (places == undefined) {
		places = result.length;
	}
	if (typeof places != "number") {
		throw predef.Error("#VALUE!","The places value must be a number")
	}
	if ((places<0) || (places>10) || (places<result.length)) {
		throw predef.Error("#NUM!","The places value is not allowed");
	}
	for (var i=result.length;i<places;i++){
		result+="0";
	}
	return result.split('').reverse().join('');
}

exports.BIN2OCT_D = function bin2oct(number,places){
	var objects = {0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7"};
	var decimal = exports.BIN2DEC_D(number), result = "", dividend = decimal, tmp = 0;
	while (dividend>=8){
		tmp = dividend%8;
		result+=objects[tmp].toString();
		dividend=Math.floor(dividend/8);
	}
	result+=objects[dividend].toString();
	if (places == undefined) {
		places = result.length;
	}
	if (typeof places != "number") {
		return predef.Error("#VALUE!","The places value must be a number")
	}
	if ((places<0) || (places>10) || (places<result.length)) {
		return predef.Error("#NUM!","The places value is not allowed");
	}
	for (var i=result.length;i<places;i++){
		result+="0";
	}
	return result.split('').reverse().join('');
}

exports.BIT_VERIF = function bit_verif(number1,number2){
	if ((typeof number1 != "number") || (typeof number2 != "number")) {
		throw predef.Error("#VALUE!","The value of both arguments must be numeric");		
	}
	if ((Math.floor(number1)!=number1) || (Math.floor(number2)!=number2)) {
		throw predef.Error("#NUM!","Both numbers must be integers");
	}
	if ((number1<0) || (number1>(Math.pow(2,48)-1)) || (number2<0) || (number2>(Math.pow(2,48)-1))) {
		throw predef.Error("#NUM!","Both numbers must be between 0 and 2^48 -1");
	}
}

exports.BIT_VERIF_D = function bit_verif(number1,number2,op){
	if ((typeof number1 != "number") || (typeof number2 != "number")) {
		return predef.Error("#VALUE!","The value of both arguments must be numeric");		
	}
	if ((Math.floor(number1)!=number1) || (Math.floor(number2)!=number2)) {
		return predef.Error("#NUM!","Both numbers must be integers");
	}
	if ((number1<0) || (number1>(Math.pow(2,48)-1)) || (number2<0) || (number2>(Math.pow(2,48)-1))) {
		return predef.Error("#NUM!","Both numbers must be between 0 and 2^48 -1");
	}
	return eval(number1+op+number2);
}

exports.BITAND = function bitand(number1,number2) {
	exports.BIT_VERIF(number1,number2);
	return number1 & number2;
}

exports.BITAND_D = function bitand(number1,number2) {
	return exports.BIT_VERIF_D(number1,number2,"&");
}

exports.BITLSHIFT = function bitlshift(number,shift) {
	exports.BIT_VERIF(number,shift);
	return number << shift;	
}

exports.BITLSHIFT_D = function bitlshift(number,shift) {
	return exports.BIT_VERIF_D(number,shift,"<<");
}

exports.BITOR = function bitor(number1,number2) {
	exports.BIT_VERIF(number1,number2);
	return number1 | number2;
}

exports.BITOR_D = function bitor(number1,number2) {
	return exports.BIT_VERIF_D(number1,number2,"|");
}

exports.BITRSHIFT = function bitrshift(number,shift) {
	exports.BIT_VERIF(number,shift)
	return number >> shift;	
}

exports.BITRSHIFT_D = function bitrshift(number,shift) {
	return exports.BIT_VERIF_D(number,shift,">>");
}

exports.COMPLEX = function complex(real,imaginary,suffix) {
	if (suffix == undefined){
		suffix="i";
	}
	if ((typeof real != "number") || (typeof imaginary != "number")) {
		throw predef.Error("#VALUE!","The real and imaginary part must be numbers");
	}
	if ((suffix != "i") && (suffix != "j")) {
		throw predef.Error("#VALUE!","The suffix must be i or j");
	}
	var sign="";
	if (imaginary>=0) {
		sign="+";
	}
	if (real==0) {
		real="";
		sign="";
	}
	if (imaginary==0){
		imaginary="";
		suffix="";
	}
	if (imaginary==1) { 
		imaginary="";
	}
	return ""+real+sign+imaginary+suffix;
}

exports.COMPLEX_D = function complex(real,imaginary,suffix) {
	if (suffix == undefined){
		suffix="i";
	}
	if ((typeof real != "number") || (typeof imaginary != "number")) {
		return predef.Error("#VALUE!","The real and imaginary part must be numbers");
	}
	if ((suffix != "i") && (suffix != "j")) {
		return predef.Error("#VALUE!","The suffix must be i or j");
	}
	var sign="";
	if (imaginary>0) {
		sign="+";
	}
	if (real==0) {
		real="";
		sign="";
	}
	if (imaginary==0) {
		imaginary="";
		suffix="";
	}
	if (imaginary==1) { 
		imaginary="";
	}
	return ""+real+sign+imaginary+suffix;
}

exports.DEC2BIN = function dec2bin(number,places) {
	if (typeof number != "number") {
		throw predef.Error("#VALUE!","The number value must be numeric");
	}
	if ((number>511) || (number<-512)) {
		throw predef.Error("#NUM!","The number value must be between -512 and 511");
	}
	var objects = {0:"0",1:"1"};
	var result = "", dividend = number, tmp = 0;
	while (dividend>=2){
		tmp = dividend%2;
		result+=objects[tmp].toString();
		dividend=Math.floor(dividend/2);
	}
	result+=objects[dividend].toString();
	if (places == undefined) {
		places = result.length;
	}
	if (typeof places != "number") {
		throw predef.Error("#VALUE!","The places value must be a number")
	}
	if ((places<0) || (places>10) || (places<result.length)) {
		throw predef.Error("#NUM!","The places value is not allowed");
	}
	for (var i=result.length;i<places;i++){
		result+="0";
	}
	return result.split('').reverse().join('');
}

exports.DEC2BIN_D = function dec2bin(number,places) {
	if (typeof number != "number") {
		return predef.Error("#VALUE!","The number value must be numeric");
	}
	if ((number>511) || (number<-512)) {
		return predef.Error("#NUM!","The number value must be between -512 and 511");
	}
	number = parseInt(number);
	var objects = {0:"0",1:"1"};
	var result = "", dividend = number, tmp = 0;
	while (dividend>=2){
		tmp = dividend%2;
		result+=objects[tmp].toString();
		dividend=Math.floor(dividend/2);
	}
	result+=objects[dividend].toString();
	if (places == undefined) {
		places = result.length;
	}
	if (typeof places != "number") {
		return predef.Error("#VALUE!","The places value must be a number")
	}
	if ((places<0) || (places>10) || (places<result.length)) {
		return predef.Error("#NUM!","The places value is not allowed");
	}
	for (var i=result.length;i<places;i++){
		result+="0";
	}
	return result.split('').reverse().join('');
}

exports.DEC2HEX = function dec2hex(number,places) {
	if (typeof number != "number") {
		throw predef.Error("#VALUE!","The number value must be numeric");
	}
	if ((number>549755813887) || (number<-549755813888)) {
		throw predef.Error("#NUM!","The number value must be between -549755813888 and 549755813887");
	}
	var objects = {0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",10:"A",11:"B",12:"C",13:"D",14:"E",15:"F"};
	var result = "", dividend = number, tmp = 0;
	while (dividend>=16){
		tmp = dividend%16;
		result+=objects[tmp].toString();
		dividend=Math.floor(dividend/16);
	}
	result+=objects[dividend].toString();
	if (places == undefined) {
		places = result.length;
	}
	if (typeof places != "number") {
		throw predef.Error("#VALUE!","The places value must be a number")
	}
	if ((places<0) || (places>10) || (places<result.length)) {
		throw predef.Error("#NUM!","The places value is not allowed");
	}
	for (var i=result.length;i<places;i++){
		result+="0";
	}
	return result.split('').reverse().join('');
}

exports.DEC2HEX_D = function dec2hex(number,places) {
	if (typeof number != "number") {
		return predef.Error("#VALUE!","The number value must be numeric");
	}
	if ((number>549755813887) || (number<-549755813888)) {
		return predef.Error("#NUM!","The number value must be between -549755813888 and 549755813887");
	}
	number = parseInt(number);
	var objects = {0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",10:"A",11:"B",12:"C",13:"D",14:"E",15:"F"};
	var result = "", dividend = number, tmp = 0;
	while (dividend>=16){
		tmp = dividend%16;
		result+=objects[tmp].toString();
		dividend=Math.floor(dividend/16);
	}
	result+=objects[dividend].toString();
	if (places == undefined) {
		places = result.length;
	}
	if (typeof places != "number") {
		return predef.Error("#VALUE!","The places value must be a number")
	}
	if ((places<0) || (places>10) || (places<result.length)) {
		return predef.Error("#NUM!","The places value is not allowed");
	}
	for (var i=result.length;i<places;i++){
		result+="0";
	}
	return result.split('').reverse().join('');
}

exports.DEC2OCT = function dec2oct(number,places) {
	if (typeof number != "number") {
		throw predef.Error("#VALUE!","The number value must be numeric");
	}
	if ((number>549755813887) || (number<-549755813888)) {
		throw predef.Error("#NUM!","The number value must be between -549755813888 and 549755813887");
	}
	var objects = {0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7"};
	var result = "", dividend = number, tmp = 0;
	while (dividend>=8){
		tmp = dividend%8;
		result+=objects[tmp].toString();
		dividend=Math.floor(dividend/8);
	}
	result+=objects[dividend].toString();
	if (places == undefined) {
		places = result.length;
	}
	if (typeof places != "number") {
		throw predef.Error("#VALUE!","The places value must be a number")
	}
	if ((places<0) || (places>10) || (places<result.length)) {
		throw predef.Error("#NUM!","The places value is not allowed");
	}
	for (var i=result.length;i<places;i++){
		result+="0";
	}
	return result.split('').reverse().join('');
}

exports.DEC2OCT_D = function dec2oct(number,places) {
	if (typeof number != "number") {
		return predef.Error("#VALUE!","The number value must be numeric");
	}
	if ((number>536870911) || (number<-536870912)) {
		return predef.Error("#NUM!","The number value must be between -536870912 and 536870911");
	}
	var objects = {0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7"};
	var result = "", dividend = number, tmp = 0;
	while (dividend>=8){
		tmp = dividend%8;
		result+=objects[tmp].toString();
		dividend=Math.floor(dividend/8);
	}
	result+=objects[dividend].toString();
	if (places == undefined) {
		places = result.length;
	}
	if (typeof places != "number") {
		return predef.Error("#VALUE!","The places value must be a number")
	}
	if ((places<0) || (places>10) || (places<result.length)) {
		return predef.Error("#NUM!","The places value is not allowed");
	}
	for (var i=result.length;i<places;i++){
		result+="0";
	}
	return result.split('').reverse().join('');
}

exports.DELTA = function delta(number1,number2) {
	if (number2 == undefined) {
		number2 = 0;
	}
	if ((typeof number1 != "number") || (typeof number2 != "number")) {
		throw predef.Error("#VALUE!","The numbers value must be numeric");
	}
	var returns = {true:1,false:0}
	return (returns[number1===number2]);
}

exports.DELTA_D = function delta(number1,number2) {
	if (number2 == undefined) {
		number2 = 0;
	}
	if ((typeof number1 != "number") || (typeof number2 != "number")) {
		return predef.Error("#VALUE!","The numbers value must be numeric");
	}
	var returns = {true:1,false:0}
	return (returns[number1===number2]);
}

exports.HEX2BIN = function hex2bin(number,places) {
	var tmpDec = exports.HEX2DEC(number);
	return exports.DEC2BIN(parseInt(tmpDec),places);
}

exports.HEX2BIN_D = function hex2bin(number,places) {
	var tmpDec = exports.HEX2DEC_D(number);
	return tmpDec.hasOwnProperty('code') ? tmpDec :
		   exports.DEC2BIN_D(parseInt(tmpDec),places);
}

exports.HEX2DEC = function hex2dec(number){
	number = number.toString(), n = number.length;
	if (n > 10)	{
		throw predef.Error("#NUM!","The value introduced is not allowed");
	}
	var result = 0;
	var hex = {"0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"A":10,"B":11,"C":12,"D":13,"E":14,"F":15};
	for (var i=0;i<n;i++){
		if (hex[number[n-(i+1)]]==undefined){
			throw predef.Error("#NUM!","The value introduced is not allowed");
		}
		var tmp = parseInt(number[n-(i+1)],16);
		if (i==9){
			result += -tmp*Math.pow(16,i);
			break;
		}
		result += tmp*Math.pow(16,i);
	}
	return result;
}

exports.HEX2DEC_D = function hex2dec(number){
	number = number.toString(), n = number.length;
	if (n > 10)	{
		return predef.Error("#NUM!","The value introduced is not allowed");
	}
	var result = 0;
	var hex = {"0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"A":10,"B":11,"C":12,"D":13,"E":14,"F":15};
	for (var i=0;i<n;i++){
		if (hex[number[n-(i+1)]]==undefined){
			return predef.Error("#NUM!","The value introduced is not allowed");
		}
		var tmp = parseInt(number[n-(i+1)],16);
		result += tmp*Math.pow(16,i);
	}
	return result;
}

exports.HEX2OCT = function hex2oct(number,places) {
	var tmpDec = exports.HEX2DEC(number);
	return exports.DEC2OCT(parseInt(tmpDec),places);
}

exports.HEX2OCT_D = function hex2oct(number,places) {
	var tmpDec = exports.HEX2DEC_D(number);
	return tmpDec.hasOwnProperty('code') ? tmpDec : 
					exports.DEC2OCT_D(parseInt(tmpDec),places);
}

exports.IMABS = function imabs(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		return Math.sqrt(Math.pow(complex.re,2) + Math.pow(complex.im,2));
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMABS_D = function imabs(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		return Math.sqrt(Math.pow(complex.re,2) + Math.pow(complex.im,2));
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMAGINARY = function imaginary(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		return complex.im;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMAGINARY_D = function imaginary(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		return complex.im;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMARGUMENT = function imargument(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		return Math.atan(complex.im/complex.re);
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMARGUMENT_D = function imargument(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		return Math.atan(complex.im/complex.re);
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMCONJUGATE = function imconjugate(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		tmp=(-complex.im)
		if ((complex.im == 1) || ((-complex.im == 1))) {
			tmp="";
		}
		if ((-complex.im) == -1) {
			tmp="-";
		}
		repart = (complex.re == 0) 		? "" 	: complex.re;
		impart = ((-complex.im) == 0) 	? "" 	: ((-complex.im)>0) 	? "+" + tmp + "i" 
																		: "" + tmp + "i";
		return "" + repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMCONJUGATE_D = function imconjugate(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		tmp=(-complex.im)
		if ((complex.im == 1) || ((-complex.im == 1))) {
			tmp="";
		}
		if ((-complex.im) == -1) {
			tmp="-";
		}
		repart = (complex.re == 0) 		? "" 	: complex.re;
		impart = ((-complex.im) == 0) 	? "" 	: ((-complex.im)>0) 	? "+" + tmp + "i" 
																		: "" + tmp + "i";
		return "" + repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMCOS = function imcos(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = Math.cos(complex.re)*Math.cosh(complex.im);
		impart = (-Math.sin(complex.re)*Math.sinh(complex.im));
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMCOS_D = function imcos(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = Math.cos(complex.re)*Math.cosh(complex.im);
		impart = (-Math.sin(complex.re)*Math.sinh(complex.im));
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMCOSH = function imcosh(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = Math.cosh(complex.re)*Math.cos(complex.im);
		impart = (-Math.sinh(complex.re)*Math.sin(complex.im));
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMCOSH_D = function imcosh(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = Math.cosh(complex.re)*Math.cos(complex.im);
		impart = (-Math.sinh(complex.re)*Math.sin(complex.im));
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMDIV = function imdiv(inumber1,inumber2) {
	if (inumber2 == 0){
		throw predef.Error("#NUM!","The second value must be different of zero");
	}
	inumber1 = inumber1.toString().replace("j","i");
	inumber2 = inumber2.toString().replace("j","i");
	try{
		complex1=Complex(inumber1);
		complex2=Complex(inumber2);
		repart = (complex1.re*complex2.re + complex1.im*complex2.im) / (Math.pow(complex2.re,2)+Math.pow(complex2.im,2));
		impart = (complex1.im*complex2.re - complex1.re*complex2.im) / (Math.pow(complex2.re,2)+Math.pow(complex2.im,2));
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMDIV_D = function imdiv(inumber1,inumber2) {
	if (inumber2 == 0){
		return predef.Error("#NUM!","The second value must be different of zero");
	}
	inumber1 = inumber1.toString().replace("j","i");
	inumber2 = inumber2.toString().replace("j","i");
	try{
		complex1=Complex(inumber1);
		complex2=Complex(inumber2);
		repart = (complex1.re*complex2.re + complex1.im*complex2.im) / (Math.pow(complex2.re,2)+Math.pow(complex2.im,2));
		impart = (complex1.im*complex2.re - complex1.re*complex2.im) / (Math.pow(complex2.re,2)+Math.pow(complex2.im,2));
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMEXP = function imexp(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = Math.pow(Math.E,complex.re)*Math.cos(complex.im);
		impart = Math.pow(Math.E,complex.re)*Math.sin(complex.im);
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMEXP_D = function imexp(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = Math.pow(Math.E,complex.re)*Math.cos(complex.im);
		impart = Math.pow(Math.E,complex.re)*Math.sin(complex.im);
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMLN = function imln(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = Math.log(Math.sqrt(Math.pow(complex.re,2)+Math.pow(complex.im,2)));
		impart = Math.atan(complex.im/complex.re);
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMLN_D = function imln(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = Math.log(Math.sqrt(Math.pow(complex.re,2)+Math.pow(complex.im,2)));
		impart = Math.atan(complex.im/complex.re);
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMLOG10 = function imlog10(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = (Math.log(Math.E)/Math.log(10))*Math.log(Math.sqrt(Math.pow(complex.re,2)+Math.pow(complex.im,2)));
		impart = (Math.log(Math.E)/Math.log(10))*Math.atan(complex.im/complex.re);
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMLOG10_D = function imlog10(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = (Math.log(Math.E)/Math.log(10))*Math.log(Math.sqrt(Math.pow(complex.re,2)+Math.pow(complex.im,2)));
		impart = (Math.log(Math.E)/Math.log(10))*Math.atan(complex.im/complex.re);
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMLOG2 = function imlog2(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = (Math.log(Math.E)/Math.log(2))*Math.log(Math.sqrt(Math.pow(complex.re,2)+Math.pow(complex.im,2)));
		impart = (Math.log(Math.E)/Math.log(2))*Math.atan(complex.im/complex.re);
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMLOG2_D = function imlog2(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = (Math.log(Math.E)/Math.log(2))*Math.log(Math.sqrt(Math.pow(complex.re,2)+Math.pow(complex.im,2)));
		impart = (Math.log(Math.E)/Math.log(2))*Math.atan(complex.im/complex.re);
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMPOWER = function impower(inumber,number) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		rn = Math.pow((Math.pow(complex.re,2)+Math.pow(complex.im,2)),(number/2));
		repart = rn*Math.cos(number*Math.atan(complex.im/complex.re));
		impart = rn*Math.sin(number*Math.atan(complex.im/complex.re));
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMPOWER_D = function impower(inumber,number) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		rn = Math.pow((Math.pow(complex.re,2)+Math.pow(complex.im,2)),(number/2));
		repart = rn*Math.cos(number*Math.atan(complex.im/complex.re));
		impart = rn*Math.sin(number*Math.atan(complex.im/complex.re));
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMPRODUCT = function improduct(inumber1) {
	inumber1 = inumber1.toString().replace("j","i");
	try{
		complextmp = Complex(inumber1);
		i=1;
		while (arguments[i]!=undefined) {
			inumber2 = arguments[i].toString().replace("j","i");
			complex2 = Complex(arguments[i]);
			complextmp = Complex((complextmp.re*complex2.re-complextmp.im*complex2.im),(complextmp.re*complex2.im+complextmp.im*complex2.re));
			i++;
		}
		repart = complextmp.re;
		impart = complextmp.im;
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMPRODUCT_D = function improduct(inumber1) {
	inumber1 = inumber1.toString().replace("j","i");
	try{
		complextmp = Complex(inumber1);
		i=1;
		while (arguments[i]!=undefined) {
			inumber2 = arguments[i].toString().replace("j","i");
			complex2 = Complex(arguments[i]);
			complextmp = Complex((complextmp.re*complex2.re-complextmp.im*complex2.im),(complextmp.re*complex2.im+complextmp.im*complex2.re));
			i++;
		}
		repart = complextmp.re;
		impart = complextmp.im;
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMREAL = function imreal(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		return complex.re;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMREAL_D = function imreal(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		return complex.re;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMSIN = function imsin(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = Math.sin(complex.re)*Math.cosh(complex.im);
		impart = (-Math.cos(complex.re)*Math.sinh(complex.im));
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMSIN_D = function imsin(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = Math.sin(complex.re)*Math.cosh(complex.im);
		impart = (-Math.cos(complex.re)*Math.sinh(complex.im));
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMSINH = function imsinh(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = Math.sinh(complex.re)*Math.cos(complex.im);
		impart = (-Math.cosh(complex.re)*Math.sin(complex.im));
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMSINH_D = function imsinh(inumber) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		repart = Math.sinh(complex.re)*Math.cos(complex.im);
		impart = (Math.cosh(complex.re)*Math.sin(complex.im));
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMSQRT = function imsqrt(inumber,number) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		rn = Math.pow((Math.pow(complex.re,2)+Math.pow(complex.im,2)),(1/2));
		repart = Math.pow(rn,1/2)*Math.cos(Math.atan(complex.im/complex.re)/2);
		impart = Math.pow(rn,1/2)*Math.sin(Math.atan(complex.im/complex.re)/2);
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMSQRT_D = function imsqrt(inumber,number) {
	inumber = inumber.toString().replace("j","i");
	try{
		complex = Complex(inumber);
		rn = Math.pow((Math.pow(complex.re,2)+Math.pow(complex.im,2)),(1/2));
		repart = Math.pow(rn,1/2)*Math.cos(Math.atan(complex.im/complex.re)/2);
		impart = Math.pow(rn,1/2)*Math.sin(Math.atan(complex.im/complex.re)/2);
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + impart + "i" 
														: "" + impart + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMSUB = function imsub(inumber1,inumber2) {
	inumber1 = inumber1.toString().replace("j","i");
	inumber2 = inumber2.toString().replace("j","i");
	try{
		complex1 = Complex(inumber1);
		complex2 = Complex(inumber2);
		repart = complex1.re-complex2.re;
		tmp = impart = complex1.im-complex2.im;
		if (impart == 1) {
			tmp = "";
		}
		else if (impart == -1) {
			tmp = "-";
		}
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + tmp + "i" 
														: "" + tmp + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMSUB_D = function imsub(inumber1,inumber2) {
	inumber1 = inumber1.toString().replace("j","i");
	inumber2 = inumber2.toString().replace("j","i");
	try{
		complex1 = Complex(inumber1);
		complex2 = Complex(inumber2);
		repart = complex1.re-complex2.re;
		tmp = impart = complex1.im-complex2.im;
		if (impart == 1) {
			tmp = "";
		}
		else if (impart == -1) {
			tmp = "-";
		}
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + tmp + "i" 
														: "" + tmp + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMSUM = function imsum(inumber1) {
	inumber1 = inumber1.toString().replace("j","i");
	try{
		complextmp = Complex(inumber1);
		i=1;
		while (arguments[i]!=undefined) {
			inumber2 = arguments[i].toString().replace("j","i");
			complex2 = Complex(arguments[i]);
			complextmp = Complex((complextmp.re+complex2.re),(complextmp.re+complex2.im));
			i++;
		}
		repart = complextmp.re;
		tmp = impart = complextmp.im;
		if (impart == 1) {
			tmp = "";
		}
		else if (impart == -1) {
			tmp = "-";
		}
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + tmp + "i" 
														: "" + tmp + "i";
		return ""+repart + impart;
	}	
	catch (e){
		throw predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}

exports.IMSUM_D = function imsum(inumber1) {
	inumber1 = inumber1.toString().replace("j","i");
	try{
		complextmp = Complex(inumber1);
		i=1;
		while (arguments[i]!=undefined) {
			inumber2 = arguments[i].toString().replace("j","i");
			complex2 = Complex(arguments[i]);
			complextmp = Complex((complextmp.re+complex2.re),(complextmp.im+complex2.im));
			i++;
		}
		repart = complextmp.re;
		tmp = impart = complextmp.im;
		if (impart == 1) {
			tmp = "";
		}
		else if (impart == -1) {
			tmp = "-";
		}
		repart = (repart == 0) 	? "" 	: repart;
		impart = (impart == 0) 	? "" 	: (impart>0) 	? "+" + tmp + "i" 
														: "" + tmp + "i";
		return ""+repart + impart;
	}	
	catch (e){
		return predef.Error("#NUM!","The value introduced must be a valid complex number")
	}
}
