var predef = require('./predef.js');
function verify(assertion) {
	var ok = eval(assertion);
	console.log((ok ? "PASSED: " : "FAILED: ") + assertion);
	if (!ok)
		process.exit()

}

var logical   = require('./logical.js');
var date      = require('./date.js');
var financial = require('./financial.js');
var eng       = require('./engineering.js');
var math      = require('./math.js');
var stat      = require('./stat.js');
var text      = require('./text.js');
var type      = require('./type.js');

///
/// TESTING
///

/// AND
verify('logical.AND_D(true) == true');
verify('logical.AND_D(0,true) == false');
verify('logical.AND_D(true,1) == true');
verify('logical.AND_D(5>0,5<10) == true');
verify('logical.AND_D(5>0,5<10,10>12) == false');
verify('logical.AND_D(5<0,5<10,10<12) == false');
verify('type.equals(logical.AND_D("w",true),predef.Error("#VALUE!","The values introduced must be non-text"))');
verify('type.equals(logical.AND_D("w"),predef.Error("#VALUE!","The values introduced must be non-text"))');
/// IF
verify('logical.IF_D(4==0,"Div by zero",5/4) == 1.25');
verify('logical.IF_D(0==0,"Div by zero",5/0) == "Div by zero"');
verify('logical.IF_D(true,"Hello","Bye") == "Hello"');
var X = 5;
verify('logical.IF_D(X>=0,X,-X) == 5');
X = -5;
verify('logical.IF_D(X>=0,X,-X) == 5');
verify('type.equals(logical.IF_D(5,4,3),predef.Error("#VALUE!","The value introduced for test must be boolean"))')
verify('type.equals(logical.IF_D("true",4,3),predef.Error("#VALUE!","The value introduced for test must be boolean"))')
/// NOT
verify('logical.NOT_D(true) == false');
verify('logical.NOT_D(1+1==2) == false');
verify('logical.NOT_D(2+2==5) == true');
verify('type.equals(logical.NOT_D(5),predef.Error("#VALUE!","The value introduced must be boolean"))');
/// OR
verify('logical.OR_D(true) == true');
verify('logical.OR_D(0,true) == true');
verify('logical.OR_D(false,0) == false');
verify('logical.OR_D(5>0,5<10) == true');
verify('logical.OR_D(5>0,5<10,10>12) == true');
verify('logical.OR_D(5<0,5>10,10>12) == false');
verify('type.equals(logical.OR_D("w",true),predef.Error("#VALUE!","The values introduced must be non-text"))');
verify('type.equals(logical.OR_D("w"),predef.Error("#VALUE!","The values introduced must be non-text"))');
/// XOR
verify('logical.XOR_D(1>0,2>0) == false');
verify('logical.XOR_D(1>0,-1>0) == true');
verify('logical.XOR_D(0>1,2>0) == true');
verify('logical.XOR_D(0>1,0>2) == false');
verify('logical.XOR_D(1>0,2>0,0>1,0>2) == false');
verify('logical.XOR_D(1>0,2>0,3>1,0>2) == true');
verify('type.equals(logical.XOR_D("w",true),predef.Error("#VALUE!","The values introduced must be non-text"))');
verify('type.equals(logical.XOR_D("w"),predef.Error("#VALUE!","The values introduced must be non-text"))');

//
// date.js verify
// 
// console.log(date.DATE(2012,1,1));
// verify('type.equals(date.DATE(2012,1,1),"2012-01-01")');
// verify('type.equals(date.DATE(2012,0,1),"2011-12-01")');
// verify('type.equals(date.DATE(2012,2,1),"2012-02-01")');
// verify('type.equals(date.DATE(2012,12,1),"2012-12-01")');
// verify('type.equals(date.DATE(2012,13,1),"2013-01-01")');
// verify('type.equals(date.DATE(2012,14,1),"2013-02-01")');
// verify('type.equals(date.DATE(2012,-1,1),"2011-11-01")');
// verify('type.equals(date.DATE(112,1,1),"2012-01-01")');
// verify('type.equals(date.DATE(2012,6,-1),"2012-05-30")');
// verify('type.equals(date.DATE(2012,6,0),"2012-05-31")');
// verify('type.equals(date.DATE(2012,6,1),"2012-06-01")');
// verify('type.equals(date.DATE(2012,6,31),"2012-07-01")');
// verify('type.equals(date.DATE(2012,6,32),"2012-07-02")');
verify('date.DAY("2011-4-15") == 15');
verify('date.DAY("2015-5-31") == 31');
verify('date.DAY("1984-3-21") == 21');
verify('date.DAY("2016-1-1") == 1');
verify('date.DAYS("3-15-11","2-1-11") == 42');
verify('date.DAYS("12-31-17","1-1-17") == 364');
verify('date.DAYS("1-1-15","2-2-15") == 32');
verify('date.HOUR("13:00:55") == 13');
verify('date.HOUR("1:00 PM") == 13');
verify('date.HOUR("8:32:55") == 8');
verify('date.MINUTE("13:35:55") == 35');
verify('date.MINUTE("8:17:55") == 17');
verify('date.MINUTE("10:55 PM") == 55');
verify('date.MONTH("05-29-2016") == 5');
verify('date.MONTH("1984-03-05") == 3');
verify('date.MONTH("2015-7-1") == 7');
verify('date.SECOND("13:35:35") == 35');
verify('date.SECOND("8:17:55") == 55');
verify('date.SECOND("10:27:27 PM") == 27');
verify('date.WEEKDAY("31-Dec-2012") == 2');
verify('date.WEEKDAY("01-Jan-2013") == 3');
verify('date.WEEKDAY("03-Jan-2013") == 5');
verify('date.WEEKDAY("04-Jan-2013") == 6');
verify('date.WEEKDAY("08-Jan-2013") == 3');
verify('date.WEEKDAY("03-Feb-2013") == 1');
verify('date.WEEKDAY("05-Feb-2013") == 3');
verify('date.WEEKNUM("31-Dec-2013") == 53');
verify('date.YEAR("05-29-2015") == 2015');
verify('date.YEAR("03-09-1984") == 1984');
verify('date.YEAR("01-01-2022") == 2022');

//
// engineering.js verify
// 

/// BIN2DEC
verify('eng.BIN2DEC_D("10") == 2');
verify('eng.BIN2DEC_D("11") == 3');
verify('eng.BIN2DEC_D("0000000010") == 2');
verify('eng.BIN2DEC_D("1111111110") == -2');
verify('eng.BIN2DEC_D("110") == 6');
verify('type.equals(eng.BIN2DEC_D("123"),predef.Error("#NUM!","The value introduced is not allowed"))');
verify('type.equals(eng.BIN2DEC_D("11101010101010101"),predef.Error("#NUM!","The value introduced is not allowed"))');
verify('eng.BIN2DEC_D(0) == 0');
/// BIN2HEX
verify('eng.BIN2HEX_D("1110") == "E"');
verify('eng.BIN2HEX_D(111011) == "3B"');
verify('eng.BIN2HEX_D( "10", 10 ) == "0000000002"');
verify('eng.BIN2HEX_D( "11101" ) == "1D"');
verify('type.equals(eng.BIN2HEX_D("1110110","a"),predef.Error("#VALUE!","The places value must be a number"))');
verify('type.equals(eng.BIN2HEX_D("1110110",-1),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.BIN2HEX_D("11101",1),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.BIN2HEX_D("11101",11),predef.Error("#NUM!","The places value is not allowed"))');
/// BIN2OCT
verify('eng.BIN2OCT_D("1110") == "16"');
verify('eng.BIN2OCT_D("101") == "5"');
verify('eng.BIN2OCT_D("0000000001") == "1"');
verify('eng.BIN2OCT_D( "10", 10 ) == "0000000002"');
verify('type.equals(eng.BIN2OCT_D("1110110","a"),predef.Error("#VALUE!","The places value must be a number"))');
verify('type.equals(eng.BIN2OCT_D("1110110",-1),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.BIN2OCT_D("11101",1),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.BIN2OCT_D("11101",11),predef.Error("#NUM!","The places value is not allowed"))');
/// BITAND
verify('eng.BITAND_D(5,7) == 5');
verify('eng.BITAND_D(13,14) == 12');
verify('type.equals(eng.BITAND_D("11101",1),predef.Error("#VALUE!","The value of both arguments must be numeric"))');
verify('type.equals(eng.BITAND_D(11101,"1"),predef.Error("#VALUE!","The value of both arguments must be numeric"))');
verify('type.equals(eng.BITAND_D(11101,4.5),predef.Error("#NUM!","Both numbers must be integers"))');
verify('type.equals(eng.BITAND_D(1.1,4),predef.Error("#NUM!","Both numbers must be integers"))');
verify('type.equals(eng.BITAND_D(-1,4),predef.Error("#NUM!","Both numbers must be between 0 and 2^48 -1"))');
verify('type.equals(eng.BITAND_D(1,-4),predef.Error("#NUM!","Both numbers must be between 0 and 2^48 -1"))');
/// BITLSHIFT
verify('eng.BITLSHIFT_D(5,2) == 20');
verify('eng.BITLSHIFT_D(3,5) == 96');
verify('type.equals(eng.BITLSHIFT_D("11101",1),predef.Error("#VALUE!","The value of both arguments must be numeric"))');
verify('type.equals(eng.BITLSHIFT_D(11101,"1"),predef.Error("#VALUE!","The value of both arguments must be numeric"))');
verify('type.equals(eng.BITLSHIFT_D(11101,4.5),predef.Error("#NUM!","Both numbers must be integers"))');
verify('type.equals(eng.BITLSHIFT_D(1.1,4),predef.Error("#NUM!","Both numbers must be integers"))');
verify('type.equals(eng.BITLSHIFT_D(-1,4),predef.Error("#NUM!","Both numbers must be between 0 and 2^48 -1"))');
verify('type.equals(eng.BITLSHIFT_D(1,-4),predef.Error("#NUM!","Both numbers must be between 0 and 2^48 -1"))');
/// BITOR
verify('eng.BITOR_D(5,6) == 7');
verify('eng.BITOR_D(9,12) == 13');
verify('type.equals(eng.BITOR_D("11101",1),predef.Error("#VALUE!","The value of both arguments must be numeric"))');
verify('type.equals(eng.BITOR_D(11101,"1"),predef.Error("#VALUE!","The value of both arguments must be numeric"))');
verify('type.equals(eng.BITOR_D(11101,4.5),predef.Error("#NUM!","Both numbers must be integers"))');
verify('type.equals(eng.BITOR_D(1.1,4),predef.Error("#NUM!","Both numbers must be integers"))');
verify('type.equals(eng.BITOR_D(-1,4),predef.Error("#NUM!","Both numbers must be between 0 and 2^48 -1"))');
verify('type.equals(eng.BITOR_D(1,-4),predef.Error("#NUM!","Both numbers must be between 0 and 2^48 -1"))');
/// BITRSHIFT
verify('eng.BITRSHIFT_D(20,2) == 5');
verify('eng.BITRSHIFT_D(52,4) == 3');
verify('type.equals(eng.BITRSHIFT_D("11101",1),predef.Error("#VALUE!","The value of both arguments must be numeric"))');
verify('type.equals(eng.BITRSHIFT_D(11101,"1"),predef.Error("#VALUE!","The value of both arguments must be numeric"))');
verify('type.equals(eng.BITRSHIFT_D(11101,4.5),predef.Error("#NUM!","Both numbers must be integers"))');
verify('type.equals(eng.BITRSHIFT_D(1.1,4),predef.Error("#NUM!","Both numbers must be integers"))');
verify('type.equals(eng.BITRSHIFT_D(-1,4),predef.Error("#NUM!","Both numbers must be between 0 and 2^48 -1"))');
verify('type.equals(eng.BITRSHIFT_D(1,-4),predef.Error("#NUM!","Both numbers must be between 0 and 2^48 -1"))');
/// COMPLEX
verify('eng.COMPLEX_D(5,2) == "5+2i"');
verify('eng.COMPLEX_D(5,-9) == "5-9i"');
verify('eng.COMPLEX_D(-1,2,"j") == "-1+2j"');
verify('eng.COMPLEX_D(10,-5,"i") == "10-5i"');
verify('eng.COMPLEX_D(0,5) == "5i"');
verify('eng.COMPLEX_D(3,0) == "3"'); 
verify('type.equals(eng.COMPLEX_D("a",1),predef.Error("#VALUE!","The real and imaginary part must be numbers"))');
verify('type.equals(eng.COMPLEX_D(1,"b"),predef.Error("#VALUE!","The real and imaginary part must be numbers"))');
verify('type.equals(eng.COMPLEX_D(3,2,5),predef.Error("#VALUE!","The suffix must be i or j"))');
verify('type.equals(eng.COMPLEX_D(3,2,"a"),predef.Error("#VALUE!","The suffix must be i or j"))');
/// DEC2BIN
verify('eng.DEC2BIN_D(2) == "10"');
verify('eng.DEC2BIN_D(3) == "11"');
verify('eng.DEC2BIN_D(2, 10 ) == "0000000010"');
verify('eng.DEC2BIN_D(6) == "110"');
verify('type.equals(eng.DEC2BIN_D(112,"a"),predef.Error("#VALUE!","The places value must be a number"))');
verify('type.equals(eng.DEC2BIN_D(110,-1),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.DEC2BIN_D(78,1),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.DEC2BIN_D(1,11),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.DEC2BIN_D(1,11),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.DEC2BIN_D("1",11),predef.Error("#VALUE!","The number value must be numeric"))');
verify('type.equals(eng.DEC2BIN_D(512,9),predef.Error("#NUM!","The number value must be between -512 and 511"))');
/// DEC2HEX
verify('eng.DEC2HEX_D(10) == "A"');
verify('eng.DEC2HEX_D(31) == "1F"');
verify('eng.DEC2HEX_D(16,10) == "0000000010"');
verify('eng.DEC2HEX_D(273) == "111"');
verify('type.equals(eng.DEC2HEX_D(112,"a"),predef.Error("#VALUE!","The places value must be a number"))');
verify('type.equals(eng.DEC2HEX_D(110,-1),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.DEC2HEX_D(78,1),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.DEC2HEX_D(1,11),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.DEC2HEX_D(1,11),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.DEC2HEX_D("1",11),predef.Error("#VALUE!","The number value must be numeric"))');
verify('type.equals(eng.DEC2HEX_D(549755813888,9),predef.Error("#NUM!","The number value must be between -549755813888 and 549755813887"))');
/// DEC2OCT
verify('eng.DEC2OCT_D(8) == "10"');
verify('eng.DEC2OCT_D(18) == "22"');
verify('eng.DEC2OCT_D(8,10) == "0000000010"');
verify('eng.DEC2OCT_D(237) == "355"');
verify('type.equals(eng.DEC2OCT_D(112,"a"),predef.Error("#VALUE!","The places value must be a number"))');
verify('type.equals(eng.DEC2OCT_D(110,-1),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.DEC2OCT_D(78,1),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.DEC2OCT_D(1,11),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.DEC2OCT_D(1,11),predef.Error("#NUM!","The places value is not allowed"))');
verify('type.equals(eng.DEC2OCT_D("1",11),predef.Error("#VALUE!","The number value must be numeric"))');
verify('type.equals(eng.DEC2OCT_D(549755813888,9),predef.Error("#NUM!","The number value must be between -536870912 and 536870911"))');
/// DELTA
verify('eng.DELTA_D(5,4) == 0');
verify('eng.DELTA_D(1.000001,1) == 0');
verify('eng.DELTA_D(1.23,1.23) == 1');
verify('eng.DELTA_D(1) == 0');
verify('eng.DELTA_D(0) == 1');
verify('type.equals(eng.DELTA_D("a"),predef.Error("#VALUE!","The numbers value must be numeric"))');
verify('type.equals(eng.DELTA_D(2,"b"),predef.Error("#VALUE!","The numbers value must be numeric"))');
/// HEX2DEC
verify('eng.HEX2DEC_D("A") == 10');
verify('eng.HEX2DEC_D("1F") == 31');
verify('eng.HEX2DEC_D("0000000010") == 16');
verify('eng.HEX2DEC_D("111") == 273');
verify('type.equals(eng.HEX2DEC_D("12G"),predef.Error("#NUM!","The value introduced is not allowed"))');
verify('type.equals(eng.HEX2DEC_D("11101010101010101"),predef.Error("#NUM!","The value introduced is not allowed"))');
verify('eng.HEX2DEC_D(0) == 0');
/// HEX2BIN
//verify('eng.HEX2DEC_D("FFFFFFFFF0") == -16');
//verify('eng.HEX2BIN_D("2",10) == 0000000010');
verify('eng.HEX2BIN_D("2") == 10');
verify('eng.HEX2BIN_D("0000000001") == 1');
verify('eng.HEX2BIN_D("F0") == 11110000');
verify('eng.HEX2BIN_D("1D") == 11101');
verify('type.equals(eng.HEX2BIN_D("12G"),predef.Error("#NUM!","The value introduced is not allowed"))');
verify('type.equals(eng.HEX2BIN_D("11101010101010101"),predef.Error("#NUM!","The value introduced is not allowed"))');
verify('eng.HEX2BIN_D(0) == 0');
/// HEX2OCT
verify('eng.HEX2OCT_D("A") == 12');
verify('eng.HEX2OCT_D("000000000F") == 17');
verify('eng.HEX2OCT_D("1F3") == 763');
verify('type.equals(eng.HEX2OCT_D("12G"),predef.Error("#NUM!","The value introduced is not allowed"))');
verify('type.equals(eng.HEX2OCT_D("11101010101010101"),predef.Error("#NUM!","The value introduced is not allowed"))');
verify('eng.HEX2OCT_D(0) == 0');
/// IMABS
var eps = 0.01
var exp = 5.385164807
verify('eng.IMABS_D("5+2i")/exp < (1+eps) && eng.IMABS_D("5+2i")/exp > (1-eps)')
exp = 2.828427125
verify('eng.IMABS_D("2+2j")/exp < (1+eps) && eng.IMABS_D("2+2j")/exp > (1-eps)')
verify('eng.IMABS_D("6") == 6')
verify('eng.IMABS_D("4i") == 4')
exp = 4.123105626;
verify('eng.IMABS_D( eng.COMPLEX( 4, 1 ) ) / exp < (1+eps) && eng.IMABS_D( eng.COMPLEX( 4, 1 ) ) / exp > (1-eps)');
verify('type.equals(eng.IMABS_D("12+20k"),predef.Error("#NUM!","The value introduced must be a valid complex number"))');
verify('type.equals(eng.IMABS_D(false),predef.Error("#NUM!","The value introduced must be a valid complex number"))');
/// IMAGINARY
verify('eng.IMAGINARY_D("5+32i") == 32');
verify('eng.IMAGINARY_D("2-i") == -1');
verify('eng.IMAGINARY_D("6") == 0');
verify('eng.IMAGINARY_D("2i") == 2');
verify('eng.IMAGINARY_D(eng.COMPLEX(4,1)) == 1');
verify('type.equals(eng.IMAGINARY_D("12+20k"),predef.Error("#NUM!","The value introduced must be a valid complex number"))');
verify('type.equals(eng.IMAGINARY_D(false),predef.Error("#NUM!","The value introduced must be a valid complex number"))');
/// IMARGUMENT
exp = 0.380506377
verify('eng.IMARGUMENT_D("5+2i")/exp < (1+eps) && eng.IMARGUMENT_D("5+2i")/exp > (1-eps)')
exp = -0.463647609
verify('eng.IMARGUMENT_D("2-i")/exp < (1+eps) && eng.IMARGUMENT_D("2-i")/exp > (1-eps)')
verify('eng.IMARGUMENT_D("6") == 0')
exp = 1.570796327
verify('eng.IMARGUMENT_D("3i")/exp < (1+eps) && eng.IMARGUMENT_D("3i")/exp > (1-eps)')
exp = 0.244978663
verify('eng.IMARGUMENT_D(eng.COMPLEX(4,1))/exp < (1+eps) && eng.IMARGUMENT_D(eng.COMPLEX(4,1))/exp > (1-eps)')
/// IMCONJUGATE
verify('eng.IMCONJUGATE_D("5+32i") == "5-32i"');
verify('eng.IMCONJUGATE_D("5+32i") == "5-32i"');
verify('eng.IMCONJUGATE_D("2-i") == "2+i"');
verify('eng.IMCONJUGATE_D("6") == "6"');
verify('eng.IMCONJUGATE_D("3i") == "-3i"');
verify('eng.IMCONJUGATE_D("4+i") == "4-i"');
/// IMDIV
verify('eng.IMDIV_D("5+2i","1+i") == "3.5-1.5i"')
verify('eng.IMDIV_D("2+2i","2+i") == "1.2+0.4i"')
verify('eng.IMDIV_D("9+3i",6) == "1.5+0.5i"')
verify('eng.IMDIV_D(eng.COMPLEX(5,2),eng.COMPLEX(0,1)) == "2-5i"')
verify('type.equals(eng.IMDIV_D("3",0),predef.Error("#NUM!","The second value must be different of zero"))');
/// IMPRODUCT
verify('eng.IMPRODUCT("1-i","5+10i") == "15+5i"')
verify('eng.IMPRODUCT("1-i","5+10i","2") == "30+10i"')
verify('eng.IMPRODUCT(eng.COMPLEX(5,2),eng.COMPLEX(0,1)) == "-2+5i"')
/// IMREAL
verify('eng.IMREAL_D("5+2i") == 5');
verify('eng.IMREAL_D("2+2i") == 2');
verify('eng.IMREAL_D(6) == 6');
verify('eng.IMREAL_D("3i") == 0');
verify('eng.IMREAL_D(eng.COMPLEX(4,1)) == 4');
/// IMSUB
verify('eng.IMSUB_D("5+i","1+4i") == "4-3i"')
verify('eng.IMSUB_D("9+2i",6) == "3+2i"')
verify('eng.IMSUB_D(eng.COMPLEX(5,2),eng.COMPLEX(0,1)) == "5+i"')
/// IMSUM
verify('eng.IMSUM_D("1-i","5+10i") == "6+9i"')
verify('eng.IMSUM_D("1-i","5+10i",2) == "8+9i"')
verify('eng.IMSUM_D(eng.COMPLEX(5,2),eng.COMPLEX(0,-1)) == "5+i"')

//
// financial.js verify
//

/// FV
var eps = 0.001;
exp = 2581.4
verify('financial.FV_D(0.06/12,10,200,500,1)/exp < (1+eps) && financial.FV_D(0.06/12,10,200,500,1)/exp > (1-eps)');
exp = 68006.08;
verify('financial.FV_D(0.05/12,60,1000)/exp < (1+eps) && financial.FV_D(0.05/12,60,1000)/exp > (1-eps)');
exp = 39729.46;
verify('financial.FV_D(0.1/4,16,2000,0,1)/exp < (1+eps) && financial.FV_D(0.1/4,16,2000,0,1)/exp > (1-eps)');
/// PMT
exp = 943.56;
verify('financial.PMT_D(0.05/12,60,50000)/exp < (1+eps) && financial.PMT_D(0.05/12,60,50000)/exp > (1-eps)');
exp = 600.85;
verify('financial.PMT_D(0.035/4, 8, 0, 5000, 1)/exp < (1+eps) && financial.PMT_D(0.035/4, 8, 0, 5000, 1)/exp > (1-eps)');
/// PV
exp = 52990.71
verify('financial.PV_D(0.05/12,60,1000)/exp < (1+eps) && financial.PV_D(0.05/12,60,1000)/exp > (1-eps)');
exp = 26762.76
verify('financial.PV_D(0.1/4,16,2000,0,1)/exp < (1+eps) && financial.PV_D(0.1/4,16,2000,0,1)/exp > (1-eps)');
exp = 1295413.61 
verify('financial.PV_D(0.016666667,12,120000)/exp < (1+eps) && financial.PV_D(0.016666667,12,120000)/exp > (1-eps)');
exp = 1186440.68 
verify('financial.PV(0.18,1,0,1400000)/exp < (1+eps) && financial.PV(0.18,1,0,1400000)/exp > (1-eps)');
X = [-5000,800,950,1080,1220,1500];
exp = 196.88;
verify('financial.NPV_D(0.02,X)/exp < (1+eps) && financial.NPV_D(0.02,X)/exp > (1-eps)');
exp = 1188.44
verify('financial.NPV_D(0.1,-10000,3000,[4200,6800])/exp < (1+eps) && financial.NPV_D(0.1,-10000,3000,[4200,6800])/exp > (1-eps)');
X = [8000,9200,10000,12000,14500]
exp = 1922.06
verify('(financial.NPV_D(0.08,X)-40000)/exp < (1+eps) && (financial.NPV_D(0.08,X)-40000)/exp > (1-eps)');
X = [-1000,-4000,5000,2000]
exp = 0.1791
verify('financial.MIRR(X,0.1,0.12)/exp < (1+eps) && financial.MIRR(X,0.1,0.12)/exp > (1-eps)');
X = [-100,18,22.5,28,35.5];
exp = 0.0254;
verify('financial.MIRR(X,0.055,0.05)/exp < (1+eps) && financial.MIRR(X,0.055,0.05)/exp > (1-eps)');
X = [-100,18,22.5,28,35.5,45];
exp = 0.1;
verify('financial.MIRR(X,0.055,0.05)/exp < (1+eps) && financial.MIRR(X,0.055,0.05)/exp > (1-eps)');
X = [-12000000,6000000,8000000,4000000];
exp = 0.1784;
verify('financial.MIRR(X,0.1,0.08)/exp < (1+eps) && financial.MIRR(X,0.1,0.08)/exp > (1-eps)');
X = [-18000000,8000000,10000000,10000000];
exp = 0.1874;
verify('financial.MIRR(X,0.1,0.08)/exp < (1+eps) && financial.MIRR(X,0.1,0.08)/exp > (1-eps)');
X = [-100000,18000,18000,18000,18000,118000];
exp = 0.1598;
verify('financial.MIRR(X,0.1,0.1)/exp < (1+eps) && financial.MIRR(X,0.1,0.1)/exp > (1-eps)');
X = [-100000,18000,-50000,25000,25000,225000];
exp = 0.1629;
/*
verify('MIRR(X,0.05,0.1)/exp < (1+eps) && MIRR(X,0.05,0.1)/exp > (1-eps)');
console.log(MIRR(X,0.05,0.1))
*/

///
/// math.js verify
///

var eps = 0.001;
/// ACOS
verify('math.ACOS_D(-1) == 3.141592653589793');
verify('math.ACOS_D(0) == 1.5707963267948966');
verify('type.equals(math.ACOS_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.ACOS_D(2),predef.Error("#NUM!","The number must be between -1 and 1"))');
/// ACOSH
verify('math.ACOSH_D(1) == 0');
verify('math.ACOSH_D(5) == 2.2924316695611777');
verify('type.equals(math.ACOSH_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.ACOSH_D(0),predef.Error("#NUM!","The number must be less than 1"))');
/// ACOT
verify('math.ACOT_D(1) == 0.7853981633974483');
verify('math.ACOT_D(0) == 1.5707963267948966');
verify('type.equals(math.ACOT_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
/// ACOTH
verify('Math.abs(math.ACOTH_D(2)  -  0.5493061443340549 ) < eps');
verify('Math.abs(math.ACOTH_D(-5) - -0.20273255405408222) < eps');
verify('type.equals(math.ACOTH_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.ACOTH_D(0),predef.Error("#NUM!","The number should not be between -1 and 1 (inclusive)"))');
/// ARABIC
verify('math.ARABIC_D("MCXX") == 1120');
verify('math.ARABIC_D("IV") == 4');
verify('math.ARABIC_D("") == 0');
verify('type.equals(math.ARABIC_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
/// ASIN
verify('math.ASIN_D(0)==0')
verify('math.ASIN_D(-1) == -1.5707963267948966');
verify('type.equals(math.ASIN_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.ASIN_D(2),predef.Error("#NUM!","The number must be between -1 and 1"))');
/// ASINH
verify('math.ASINH_D(0) == 0');
verify('math.ASINH_D(-0.5) == -0.48121182505960347');
verify('type.equals(math.ASINH_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
/// ATAN
verify('math.ATAN_D(0)==0');
verify('Math.abs(math.ATAN_D(1)- 0.7853981633974483) < eps');
verify('type.equals(math.ATAN_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
/// ATAN2
verify('math.ATAN2_D(4,0) == 0');
verify('Math.abs(math.ATAN2_D(1,1)- 0.7853981633974483) < eps');
verify('type.equals(math.ATAN2_D("hola",5),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.ATAN2_D(5,"hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.ATAN2_D("hola","vale"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.ATAN2_D(0,0),predef.Error("#DIV/0!","One of the args must be different to zero"))');
/// ATANH
verify('math.ATANH_D(0) == 0');
verify('Math.abs(math.ATANH_D(0.5) - 0.5493061443340549) < eps');
verify('type.equals(math.ATANH_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.ATANH_D(1),predef.Error("#NUM!","The number must be between -1 and 1 (exclusive)"))');
/// BASE
verify('math.BASE_D(12,2) == "1100"');
verify('math.BASE_D(12,2,8) == "00001100"');
verify('math.BASE_D(100000,16) == "186A0"');
verify('type.equals(math.BASE_D("Hola",2),predef.Error("#VALUE!","The type of values introduced is not allowed"))');
verify('type.equals(math.BASE_D(12,"2"),predef.Error("#VALUE!","The type of values introduced is not allowed"))');
verify('type.equals(math.BASE_D(12,2,"r"),predef.Error("#VALUE!","The type of values introduced is not allowed"))');
verify('type.equals(math.BASE_D(-1,2),predef.Error("#NUM!","The number is not allowed"))');
verify('type.equals(math.BASE_D(-1,2),predef.Error("#NUM!","The number is not allowed"))');
verify('type.equals(math.BASE_D(Math.pow(2,53)+1,2),predef.Error("#NUM!","The number is not allowed"))');
verify('type.equals(math.BASE_D(2,1),predef.Error("#NUM!","The radix is not allowed"))');
verify('type.equals(math.BASE_D(2,37),predef.Error("#NUM!","The radix is not allowed"))');
verify('type.equals(math.BASE_D(2,2,-1),predef.Error("#NUM!","The number\'s length is not allowed"))');
verify('type.equals(math.BASE_D(2,2,257),predef.Error("#NUM!","The number\'s length is not allowed"))');
/// COMBIN
verify('math.COMBIN_D(6,1) == 6');
verify('math.COMBIN_D(6,2) == 15');
verify('math.COMBIN_D(6,3) == 20');
verify('math.COMBIN_D(6,4) == 15');
verify('math.COMBIN_D(6,5) == 6');
verify('math.COMBIN_D(6,6) == 1');
verify('type.equals(math.COMBIN_D(6,"n"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.COMBIN_D("n",1),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.COMBIN_D(6,-2),predef.Error("#NUM!","The numbers must be in a valid range"))');
verify('type.equals(math.COMBIN_D(-1,-2),predef.Error("#NUM!","The numbers must be in a valid range"))');
verify('type.equals(math.COMBIN_D(6,8),predef.Error("#NUM!","The numbers must be in a valid range"))');
/// COMBINA
verify('math.COMBINA_D(6,1) == 6');
verify('math.COMBINA_D(6,2) == 21');
verify('math.COMBINA_D(6,3) == 56');
verify('math.COMBINA_D(6,4) == 126');
verify('math.COMBINA_D(6,5) == 252');
verify('math.COMBINA_D(6,6) == 462');
verify('type.equals(math.COMBINA_D(6,"n"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.COMBINA_D("n",1),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.COMBINA_D(6,-2),predef.Error("#NUM!","The numbers must be in a valid range"))');
verify('type.equals(math.COMBINA_D(-1,-2),predef.Error("#NUM!","The numbers must be in a valid range"))');
/// COSH
verify('math.COSH_D(0) == 1');
verify('math.COSH_D(0.5) == 1.1276259652063807');
verify('type.equals(math.COSH_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
/// COT
verify('math.COT_D(1) == 0.6420926159343308');
verify('type.equals(math.COT_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.COT_D(0),predef.Error("DIV/0!","The number must be different to zero"))');
verify('type.equals(math.COT_D(-Math.pow(2,27)-1),predef.Error("#NUM!","The number must be in a valid range"))');
verify('type.equals(math.COT_D(Math.pow(2,27+1)),predef.Error("#NUM!","The number must be in a valid range"))');
/// COTH
verify('type.equals(math.COTH_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.COTH_D(0),predef.Error("DIV/0!","The number must be different to zero"))');
verify('type.equals(math.COTH_D(-Math.pow(2,27)-1),predef.Error("#NUM!","The number must be in a valid range"))');
verify('type.equals(math.COTH_D(Math.pow(2,27+1)),predef.Error("#NUM!","The number must be in a valid range"))');
/// CSC
verify('type.equals(math.CSC_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.CSC_D(0),predef.Error("DIV/0!","The number must be different to zero"))');
verify('type.equals(math.CSC_D(-Math.pow(2,27)-1),predef.Error("#NUM!","The number must be in a valid range"))');
verify('type.equals(math.CSC_D(Math.pow(2,27+1)),predef.Error("#NUM!","The number must be in a valid range"))');
/// CSCH
verify('type.equals(math.CSCH_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.CSCH_D(0),predef.Error("DIV/0!","The number must be different to zero"))');
verify('type.equals(math.CSCH_D(-Math.pow(2,27)-1),predef.Error("#NUM!","The number must be in a valid range"))');
verify('type.equals(math.CSCH_D(Math.pow(2,27+1)),predef.Error("#NUM!","The number must be in a valid range"))');
/// DECIMAL
verify('math.DECIMAL("1100",2) == 12');
verify('math.DECIMAL_D("186A0",16) == 100000');
verify('math.DECIMAL_D("31L0",32) == 100000');
verify('math.DECIMAL_D("70122",8) == 28754');
verify('type.equals(math.DECIMAL_D("1100",1),predef.Error("#NUM!","The radix must be in a valid range"))');
verify('type.equals(math.DECIMAL_D("1100",37),predef.Error("#NUM!","The radix must be in a valid range"))');
verify('type.equals(math.DECIMAL_D("1100","nada"),predef.Error("#VALUE!","The value introduced is not allowed"))');
/// DEGREEES
verify('math.DEGREES_D(1)==57.29577951308232');
verify('math.DEGREES_D(Math.PI) == 180');
verify('math.DEGREES_D(Math.PI*2) == 360');
verify('type.equals(math.DEGREES_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
/// FACT
verify('math.FACT_D(3) == 6');
verify('math.FACT_D(6) == 720');
verify('math.FACT_D(10) == 3628800');
verify('type.equals(math.FACT_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.FACT_D(-2),predef.Error("#NUM!","The number must be less than 0"))');
/// FACTDOUBLE
verify('math.FACTDOUBLE_D(5) == 15');
verify('math.FACTDOUBLE_D(8) == 384');
verify('math.FACTDOUBLE_D(13) == 135135');
verify('type.equals(math.FACTDOUBLE_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.FACTDOUBLE_D(-2),predef.Error("#NUM!","The number must be less than 0"))');
/// GCD
verify('math.GCD_D(1,5) == 1');
verify('math.GCD_D(15,10,25) == 5');
verify('math.GCD_D(0,8,12) == 4');
verify('math.GCD_D(7,2) == 1');
verify('type.equals(math.GCD_D("a",10,25),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(math.GCD_D(5,10,"b"),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(math.GCD_D(-1,10,25),predef.Error("#NUM!","The numbers must be less than 0"))');
verify('type.equals(math.GCD_D(5,-10,25),predef.Error("#NUM!","The numbers must be less than 0"))');
/// LOG
console.log(math.LOG_BD(64,2));
verify('math.LOG_BD(64,2) == 6');
verify('math.LOG_BD(100) == 2');
verify('math.LOG_BD(4,0.5) == -2');
verify('type.equals(math.LOG_BD(0,8),predef.Error("#NUM!","The number must be positive"))');
verify('type.equals(math.LOG_BD(3,1),predef.Error("#DIV/0!","The base must not be 1"))');
verify('type.equals(math.LOG_BD("r",2),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(math.LOG_BD(2,"c"),predef.Error("#VALUE!","The values introduced are not allowed"))');
/// LCM
verify('math.LCM_D(1,5) == 5');
verify('math.LCM_D(15,10,25) == 150');
verify('math.LCM_D(1,8,12) == 24');
verify('math.LCM_D(7,2) == 14');
verify('type.equals(math.LCM_D("a",10,25),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(math.LCM_D(5,10,"b"),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(math.LCM_D(-1,10,25),predef.Error("#NUM!","The numbers must be greater than 0"))');
verify('type.equals(math.LCM_D(5,-10,25),predef.Error("#NUM!","The numbers must be greater than 0"))');
/// LOG10
verify('math.LOG10_D(100) == 2');
verify('math.LOG10_D(10) == 1');
verify('type.equals(math.LOG10_D(-2),predef.Error("#NUM!","The number must be positive"))');
verify('type.equals(math.LOG10_D("r"),predef.Error("#VALUE!","The value introduced is not allowed"))');
/// MOD
verify('math.MOD_D(6,4) == 2');
verify('math.MOD_D(6,3) == 0');
verify('math.MOD_D(6,2.5) == 1');
verify('type.equals(math.MOD_D(6,0),predef.Error("#DIV/0!","The divisor must be different to zero"))');
verify('type.equals(math.MOD_D(6,"h"),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(math.MOD_D("e","h"),predef.Error("#VALUE!","The values introduced are not allowed"))');
/// POWER
verify('math.POWER_D(2,3) == 8');
verify('math.POWER_D(5.5,3) == 166.375');
verify('type.equals(math.POWER_D(5,"h"),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(math.POWER_D("e","h"),predef.Error("#VALUE!","The values introduced are not allowed"))');
/// QUOTIENT
verify('math.QUOTIENT_D(5,2) == 2');
verify('math.QUOTIENT_D(10,2.2) == 4');
verify('math.QUOTIENT_D(5.5,2.667) == 2');
verify('math.QUOTIENT_D(-7,2) == -4');
verify('type.equals(math.QUOTIENT_D(6,0),predef.Error("#DIV/0!","The divisor must be different to zero"))');
verify('type.equals(math.QUOTIENT_D(6,"h"),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(math.QUOTIENT_D("e","h"),predef.Error("#VALUE!","The values introduced are not allowed"))');
/// RADIANS
verify('math.RADIANS_D(50) == 0.8726646259971648');
verify('math.RADIANS_D(-180) == -3.141592653589793');
verify('type.equals(math.RADIANS_D("a"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(math.RADIANS_D("a"),predef.Error("#VALUE!","The value introduced is not allowed"))');
/// RANDBETWEEN
verify('type.equals(math.RANDBETWEEN_D(6,"h"),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(math.RANDBETWEEN_D("e","h"),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(math.RANDBETWEEN_D(5,2),predef.Error("NUM!","The bottom must be less than top"))');
/// ROUND
verify('math.ROUND_D(100.319,1) == 100.3');
verify('math.ROUND_D(5.28,1) == 5.3');
verify('math.ROUND_D(991,-1) == 990');
verify('math.ROUND_D(999,-1) == 1000');
verify('math.ROUND_D(-22.45,1) == -22.4');
verify('type.equals(math.ROUND_D(6,"h"),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(math.ROUND_D("w","h"),predef.Error("#VALUE!","The values introduced are not allowed"))');
/// ROUNDDOWN
verify('math.ROUNDDOWN_D(99.999,1) == 99.9');
verify('math.ROUNDDOWN_D(99.999,2) == 99.99');
verify('math.ROUNDDOWN_D(99.999,0) == 99');
verify('math.ROUNDDOWN_D(99.999,-1) == 90');
verify('type.equals(math.ROUNDDOWN_D(6,"h"),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(math.ROUNDDOWN_D("w","h"),predef.Error("#VALUE!","The values introduced are not allowed"))');
/// MDETERM
verify('math.MDETERM([[5,2],[7,1]]) == -9');
verify('math.MDETERM([[6,4,2],[3,5,3],[2,3,4]]) == 40');
verify('math.MDETERM([[1,3,8,5],[1,3,6,1],[1,1,1,0],[7,3,10,2]]) == 88');
verify('type.equals(math.MDETERM_D([[1,2],[3,"a"]]),predef.Error("#VALUE!","The values must be numbers"))');
verify('type.equals(math.MDETERM_D([[1,2],[3]]),predef.Error("#VALUE!","The matrix must be square"))');
/// MINVERSE
verify('type.equals(math.MINVERSE([[4,-1],[2,0]]),[[0,0.5],[-1,2]])');
verify('type.equals(math.MINVERSE([[1,2,1],[3,4,-1],[0,2,0]]),[[0.25,0.25,-0.75],[0,0,0.5],[0.75,-0.25,-0.25]])');
verify('type.equals(math.MINVERSE([[1,4,1,1],[1,4,0,1],[2,3,1,2],[3,2,6,4]]),[[3.2,-4.8,2.8,-1],[0.2,0.2,-0.2,0],[1,-1,0,0],[-4,5,-2,1]])');
verify('type.equals(math.MINVERSE_D([[1,2],[3,"a"]]),predef.Error("#VALUE!","The values must be numbers"))');
verify('type.equals(math.MINVERSE_D([[1,2],[3]]),predef.Error("#VALUE!","The matrix must be square"))');
/// MMULT
verify('type.equals(math.MMULT([[1,4,1,0],[3,6,2,5],[4,2,1,8]],[[1,5],[5,0],[7,2],[4,5]]),[[28,7],[67,44],[53,62]])');
verify('type.equals(math.MMULT([[1,3],[7,2]],[[2,0],[0,2]]),[[2,6],[14,4]])');
verify('type.equals(math.MMULT_D([[1]],[[1,2],[3,4]]),predef.Error("#VALUE!","The number of columns in matrix 1 must be equal to the number of rows in matrix 2"))');
verify('type.equals(math.MMULT_D([[1,2],[3,4]],[[1]]),predef.Error("#VALUE!","The number of columns in matrix 1 must be equal to the number of rows in matrix 2"))');
/// MUNIT
verify('type.equals(math.MUNIT(1),[[1]])');
verify('type.equals(math.MUNIT(2),[[1,0],[0,1]])');
verify('type.equals(math.MUNIT(3),[[1,0,0],[0,1,0],[0,0,1]])');
verify('type.equals(math.MUNIT(4),[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]])');
/// MULTINOMIAL
verify('math.MULTINOMIAL(3,1,2,5) == 27720');
verify('math.MULTINOMIAL(3,2,4) == 1260');
verify('type.equals(math.MULTINOMIAL_D(2,3,0),predef.Error("#NUM!","The number must be greater than 0"))');
verify('type.equals(math.MULTINOMIAL_D(2,3,"a"),predef.Error("#VALUE!","The value must be a number"))');
/// SUM_D
verify('math.SUM_D([0, 1, 2, 3]) == 6');
verify('math.SUM_D(3,2) == 5');
verify('math.SUM_D([1,2,3],1,[-5][0],[15][0]) == 17');


///
/// stats.js
///

var eps = 0.001;
/// AVEDEV
var exp = 1.08642;
verify('stat.AVEDEV_D([3, 8, 8, 8, 8, 9, 9, 9],9)/1.08642 < (1+eps) && stat.AVEDEV([3, 8, 8, 8, 8, 9, 9, 9],9)/1.08642 > (1-eps)');
verify('stat.AVEDEV_D(3, 8, 8, 8, 8, 9, 9, 9, 9)/1.08642 < (1+eps) && stat.AVEDEV([3, 8, 8, 8, 8, 9, 9, 9],9)/1.08642 > (1-eps)');
verify('stat.AVEDEV_D([3, 8, 8, 8, 8, 9, 9, 9, 9])/1.08642 < (1+eps) && stat.AVEDEV([3, 8, 8, 8, 8, 9, 9, 9],9)/1.08642 > (1-eps)');
verify('type.equals(stat.AVEDEV_D("w","h"),predef.Error("#VALUE!","The values introduced are not allowed"))')
/// AVERAGEIF
X=[true,true,false];
Y=[200,250,50];
exp=225;
verify('stat.AVERAGEIF_D(Y,">100")/exp < (1+eps) && stat.AVERAGEIF_D(Y,">100")/exp > (1-eps)');
verify('stat.AVERAGEIF_D(X,"==true",Y)/exp < (1+eps) && stat.AVERAGEIF_D(X,"==true",Y)/exp > (1-eps)');
X=['"Monday"','"Tuesday"','"Thursday"','"Friday"','"Thursday"',5,2,3,4,5,1];
Y=[500,50,100,100,200,300,200,100,50,100,50];
exp=150;
verify('stat.AVERAGEIF_D(X,"==\'Thursday\'",Y)/exp < (1+eps) && stat.AVERAGEIF_D(X,"==\'Thursday\'",Y)/exp > (1-eps)');
verify('type.equals(stat.AVERAGEIF_D(Y,"==\'hola\'"),predef.Error("#DIV/0","Any value satisfy the criteria"))');
/// BINOM.DIST
exp=0.2461;
verify('stat.BINOMDIST_D(5,10,0.5,false)/exp < (1+eps) && stat.BINOMDIST(5,10,0.5,false)/exp > (1-eps)');
exp=0.079589237;
verify('stat.BINOMDIST_D(50,100,0.5,false)/exp < (1+eps) && stat.BINOMDIST(50,100,0.5,false)/exp > (1-eps)');
exp=0.000863856
verify('stat.BINOMDIST_D(65,100,0.5,false)/exp < (1+eps) && stat.BINOMDIST(65,100,0.5,false)/exp > (1-eps)');
exp=0.539794619;
verify('stat.BINOMDIST_D(50,100,0.5,true)/exp < (1+eps) && stat.BINOMDIST(50,100,0.5,true)/exp > (1-eps)');
exp=0.999105035;
verify('stat.BINOMDIST_D(65,100,0.5,true)/exp < (1+eps) && stat.BINOMDIST(65,100,0.5,true)/exp > (1-eps)');
verify('type.equals(stat.BINOMDIST_D("a",100,0.5,true),predef.Error("#VALUE!","The value introduced for the successes is not allowed"))');
verify('type.equals(stat.BINOMDIST_D(65,"e",0.5,true),predef.Error("#VALUE!","The value introduced for the trials is not allowed"))');
verify('type.equals(stat.BINOMDIST_D(65,100,"i",true),predef.Error("#VALUE!","The value introduced for the probability is not allowed"))');
verify('type.equals(stat.BINOMDIST_D(65,100,0.5,1),predef.Error("#NAME!","The value introduced for cumulative is not allowed"))');
verify('type.equals(stat.BINOMDIST_D(100,65,0.5,true),predef.Error("#NUM!","The successes must be less than trials"))');
verify('type.equals(stat.BINOMDIST_D(-1,65,0.5,true),predef.Error("#NUM!","The successes must be greater than 0"))');
verify('type.equals(stat.BINOMDIST_D(1,65,-1,true),predef.Error("#NUM!","The probability must be greater or equal than 0"))');
verify('type.equals(stat.BINOMDIST_D(1,65,2,true),predef.Error("#NUM!","The probability must be less or equal than 1"))');
/// BINOMDISTRANGE
exp=0.028443967;
verify('stat.BINOMDISTRANGE_D(100,0.5,0,40)/exp < (1+eps) && stat.BINOMDISTRANGE_D(100,0.5,0,40)/exp > (1-eps)');
exp=0.728746976;
verify('stat.BINOMDISTRANGE_D(100,0.5,45,55)/exp < (1+eps) && stat.BINOMDISTRANGE_D(100,0.5,45,55)/exp > (1-eps)');
exp=0.539794619;	
verify('stat.BINOMDISTRANGE_D(100,0.5,50,100)/exp < (1+eps) && stat.BINOMDISTRANGE_D(100,0.5,50,100)/exp > (1-eps)');
exp=0.079589237;
verify('stat.BINOMDISTRANGE_D(100,0.5,50)/exp < (1+eps) && stat.BINOMDISTRANGE_D(100,0.5,50)/exp > (1-eps)');
verify('type.equals(stat.BINOMDISTRANGE_D(100,-1,50),predef.Error("#NUM!","The probability must be greater or equal than 0"))');
verify('type.equals(stat.BINOMDISTRANGE_D(100,2,50,60),predef.Error("#NUM!","The probability must be less or equal than 1"))');
verify('type.equals(stat.BINOMDISTRANGE_D(100,0.5,140,60),predef.Error("#NUM!","The successes must be less than trials"))');
verify('type.equals(stat.BINOMDISTRANGE_D(100,0.5,-1,60),predef.Error("#NUM!","The successes must be greater than 0"))');
verify('type.equals(stat.BINOMDISTRANGE_D(100,0.5,40,20),predef.Error("#NUM!","The successes range is not valid"))');
/// BINOMINV
verify('stat.BINOMINV_D(100,0.5,0.2) == 46');
verify('stat.BINOMINV_D(100,0.5,0.5) == 50');
verify('stat.BINOMINV_D(100,0.5,0.9) == 56');
verify('type.equals(stat.BINOMINV_D(100,0.5,"a"),predef.Error("#VALUE!","The value introduced for alpha is not allowed"))');
verify('type.equals(stat.BINOMINV_D("n",0.5,0.5),predef.Error("#VALUE!","The value introduced for the trials is not allowed"))');
verify('type.equals(stat.BINOMINV_D(100,"p",0.5),predef.Error("#VALUE!","The value introduced for the probability is not allowed"))');
verify('type.equals(stat.BINOMINV_D(100,-1,0.5),predef.Error("#NUM!","The probability must be greater or equal than 0"))');
verify('type.equals(stat.BINOMINV_D(100,2,0.5),predef.Error("#NUM!","The probability must be less or equal than 1"))');
verify('type.equals(stat.BINOMINV_D(-1,1,0.5),predef.Error("#NUM!","The trials must be greater or equal than 0"))');
verify('type.equals(stat.BINOMINV_D(100,0.7,-1),predef.Error("#NUM!","Alpha must be greater or equal than 0"))');
verify('type.equals(stat.BINOMINV_D(100,0.7,2),predef.Error("#NUM!","Alpha must be less or equal than 1"))');
/// CORREL
var X = [43,21,25,42,57,59];
var Y = [99,65,79,75,87,81];
exp = 0.529809;
verify('stat.CORREL_D(X,Y)/exp < (1+eps) && stat.CORREL_D(X,Y)/exp > (1-eps)');
X = [2,10,7,17,14,16,8,12,11,15,18,3,4,1,6,5,13,19,20,9];
Y = [22.9,45.78,33.49,49.77,40.94,36.18,21.05,50.57,31.32,53.76,55.66,27.61,11.15,10.11,37.9,31.08,45.48,63.83,63.6,27.01];
exp = 0.870035104;
verify('stat.CORREL_D(X,Y)/exp < (1+eps) && stat.CORREL_D(X,Y)/exp > (1-eps)');
verify('type.equals(stat.CORREL_D([],[1]),predef.Error("#N/A","The supplied arrays have different lengths"))');
verify('type.equals(stat.CORREL_D([],[]),predef.Error("DIV/0!","The arrays should not be empty"))');
verify('type.equals(stat.CORREL_D([1],[0]),predef.Error("DIV/0!","The standard deviation of the values should not be zero"))');
/// COUNTIF
X = [0,2.1,2,3,2.5,3,6,4,0];
verify('stat.COUNTIF(X,">=3") == 4');
verify('stat.COUNTIF(X,"==0") == 2');
/// COVARIANCEP
X = [2,7,8,3,4,1,6,5];
Y = [22.9,33.49,34.5,27.61,19.5,10.11,37.9,31.08];
exp = 16.633125;
verify('stat.COVARIANCEP_D(X,Y)/exp < (1+eps) && stat.COVARIANCEP_D(X,Y)/exp > (1-eps)');
X = []
verify('type.equals(stat.COVARIANCEP_D(X,Y),predef.Error("#VALUE!","The arrays must not be empty"))');
X = [2,7,8,3,4,1];
Y = [];
verify('type.equals(stat.COVARIANCEP_D(X,Y),predef.Error("#VALUE!","The arrays must not be empty"))');
Y = [1];
verify('type.equals(stat.COVARIANCEP_D(X,Y),predef.Error("#N/A","The arrays must have the same length"))');
Y = [22.9,33.49,34.5,27.61,19.5,10.11,37.9,31.08];
verify('type.equals(stat.COVARIANCEP_D(X,Y),predef.Error("#N/A","The arrays must have the same length"))');
/// COVARIANCES
X = [2,7,8,3,4,1,6,5];
Y = [22.9,33.49,34.5,27.61,19.5,10.11,37.9,31.08];
exp = 19.00928571;
verify('stat.COVARIANCES_D(X,Y)/exp < (1+eps) && stat.COVARIANCES_D(X,Y)/exp > (1-eps)');
X = []
verify('type.equals(stat.COVARIANCES_D(X,Y),predef.Error("#VALUE!","The arrays must not be empty"))');
X = [2,7,8,3,4,1];
Y = [];
verify('type.equals(stat.COVARIANCES_D(X,Y),predef.Error("#VALUE!","The arrays must not be empty"))');
Y = [1];
verify('type.equals(stat.COVARIANCES_D(X,Y),predef.Error("#N/A","The arrays must have the same length"))');
Y = [22.9,33.49,34.5,27.61,19.5,10.11,37.9,31.08];
verify('type.equals(stat.COVARIANCES_D(X,Y),predef.Error("#N/A","The arrays must have the same length"))');
/// DEVSQ
exp = 47.5
verify('stat.DEVSQ([1,3,5,2,9,7])/exp < (1+eps) && stat.DEVSQ([1,3,5,2,9,7])/exp > (1-eps)');
verify('stat.DEVSQ([1,3,5,2,9],7)/exp < (1+eps) && stat.DEVSQ([1,3,5,2,9],7)/exp > (1-eps)');
verify('stat.DEVSQ(1,3,5,2,9,7)/exp < (1+eps) && stat.DEVSQ(1,3,5,2,9,7)/exp > (1-eps)');
exp = 48
verify('stat.DEVSQ(4,5,8,7,11,4,3)/exp < (1+eps) && stat.DEVSQ(4,5,8,7,11,4,3)/exp > (1-eps)');
verify('type.equals(stat.DEVSQ_D(3,4,"a"),predef.Error("#VALUE!","The values introduced are not allowed"))');
/// FISHER
exp = 0.9729551;
verify('stat.FISHER_D(0.75)/exp < (1+eps) && stat.FISHER_D(0.75)/exp > (1-eps)');
exp = -1.47221949
verify('stat.FISHER_D(-0.9)/exp < (1+eps) && stat.FISHER_D(-0.9)/exp > (1-eps)');
exp = -0.255412812
verify('stat.FISHER_D(-0.25)/exp < (1+eps) && stat.FISHER_D(-0.25)/exp > (1-eps)');
exp = 1.098612289
verify('stat.FISHER_D(0.8)/exp < (1+eps) && stat.FISHER_D(0.8)/exp > (1-eps)');
verify('type.equals(stat.FISHER_D("a"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(stat.FISHER_D(-1),predef.Error("#NUM!","The value must be greater than -1 and less than 1"))');
verify('type.equals(stat.FISHER_D(1),predef.Error("#NUM!","The value must be greater than -1 and less than 1"))');
/// FISHERINV
exp = 0.75
verify('stat.FISHERINV_D(0.972955)/exp < (1+eps) && stat.FISHERINV_D(0.972955)/exp > (1-eps) ');
exp = -0.19737532
verify('stat.FISHERINV_D(-0.2)/exp < (1+eps) && stat.FISHERINV_D(-0.2)/exp > (1-eps) ');
exp = 0
verify('stat.FISHERINV_D(0) == 0 ');
exp = 0.99263152
verify('stat.FISHERINV_D( 2.8)/exp < (1+eps) && stat.FISHERINV_D( 2.8)/exp > (1-eps) ');
verify('type.equals(stat.FISHERINV_D("a"),predef.Error("#VALUE!","The value introduced is not allowed"))');
/// FORECAST
X = [1,2,3,4,5,6];
Y = [3,7,15,20,22,27];
exp = 32.666667
verify('stat.FORECAST_D(7,Y,X)/exp < (1+eps) && stat.FORECAST_D(7,Y,X)/exp > (1-eps)');
X = [6,7,9,15,21];
Y = [20,28,31,38,40];
exp = 52.64321608;
verify('stat.FORECAST_D(30,Y,X)/exp < (1+eps) && stat.FORECAST_D(30,Y,X)/exp > (1-eps)');
X = []
verify('type.equals(stat.FORECAST_D(3,X,Y),predef.Error("#VALUE!","The arrays must not be empty"))');
X = [2,7,8,3,4,1];
Y = [];
verify('type.equals(stat.FORECAST_D(3,X,Y),predef.Error("#VALUE!","The arrays must not be empty"))');
Y = [1];
verify('type.equals(stat.FORECAST_D(3,X,Y),predef.Error("#N/A","The arrays must have the same length"))');
Y = [22.9,33.49,34.5,27.61,19.5,10.11,37.9,31.08];
verify('type.equals(stat.FORECAST_D(3,X,Y),predef.Error("#N/A","The arrays must have the same length"))');
verify('type.equals(stat.FORECAST_D("a",X,Y),predef.Error("#VALUE!","The predict data point introduced is not allowed"))');
/// GEOMEAN
exp = 1.622671112;
verify('stat.GEOMEAN_D(2.5,3,[0.5,1],3)/exp < (1+eps) && stat.GEOMEAN_D(2.5,3,[0.5,1],3)/exp > (1-eps) ');
exp = 5.476987;
verify('stat.GEOMEAN_D([4,5,8,7,11,4,3])/exp < (1+eps) && stat.GEOMEAN_D([4,5,8,7,11,4,3])/exp > (1-eps) ');
verify('type.equals(stat.GEOMEAN_D(1,2,3,"a"),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(stat.GEOMEAN_D(["a",2,3],"b"),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(stat.GEOMEAN_D([1,2],-1,5),predef.Error("#NUM!","The numbers must be positive"))');
verify('type.equals(stat.GEOMEAN_D(-4),predef.Error("#NUM!","The numbers must be positive"))');
/// GEOMEAN
exp = 1.229508197;
verify('stat.HARMEAN_D(2.5,3,[0.5,1],3)/exp < (1+eps) && stat.HARMEAN_D(2.5,3,[0.5,1],3)/exp > (1-eps) ');
exp = 5.028376;
verify('stat.HARMEAN_D([4,5,8,7,11,4,3])/exp < (1+eps) && stat.HARMEAN_D([4,5,8,7,11,4,3])/exp > (1-eps) ');
verify('type.equals(stat.HARMEAN_D(1,2,3,"a"),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(stat.HARMEAN_D(["a",2,3],"b"),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(stat.HARMEAN_D([1,2],-1,5),predef.Error("#NUM!","The numbers must be positive"))');
verify('type.equals(stat.HARMEAN_D(-4),predef.Error("#NUM!","The numbers must be positive"))');
/// HYPGEOMDIST
exp = 0.238095238;
console.log(stat.HYPGEOMDIST_D(0,3,3,9,false));
verify('stat.HYPGEOMDIST_D(0,3,3,9,false)/exp < (1+eps) && stat.HYPGEOMDIST_D(0,3,3,9,false)/exp > (1-eps)');
exp = 0.535714286
verify('stat.HYPGEOMDIST_D(1,3,3,9,false)/exp < (1+eps) && stat.HYPGEOMDIST_D(1,3,3,9,false)/exp > (1-eps)');
exp = 0.214285714
verify('stat.HYPGEOMDIST_D(2,3,3,9,false)/exp < (1+eps) && stat.HYPGEOMDIST_D(2,3,3,9,false)/exp > (1-eps)');
exp = 0.011904762
verify('stat.HYPGEOMDIST_D(3,3,3,9,false)/exp < (1+eps) && stat.HYPGEOMDIST_D(3,3,3,9,false)/exp > (1-eps)');
exp = 0.238095238;
verify('stat.HYPGEOMDIST_D(0,3,3,9,true)/exp < (1+eps) && stat.HYPGEOMDIST_D(0,3,3,9,true)/exp > (1-eps)');
exp = 0.773809524
verify('stat.HYPGEOMDIST_D(1,3,3,9,true)/exp < (1+eps) && stat.HYPGEOMDIST_D(1,3,3,9,true)/exp > (1-eps)');
exp = 0.988095238
verify('stat.HYPGEOMDIST_D(2,3,3,9,true)/exp < (1+eps) && stat.HYPGEOMDIST_D(2,3,3,9,true)/exp > (1-eps)');
exp = 1
verify('stat.HYPGEOMDIST_D(3,3,3,9,true)/exp < (1+eps) && stat.HYPGEOMDIST_D(3,3,3,9,true)/exp < (1+eps)');
verify('type.equals(stat.HYPGEOMDIST_D("a",3,3,9,true),predef.Error("#VALUE!","The value of sample successes is not allowed"))');
verify('type.equals(stat.HYPGEOMDIST_D(1,"e",3,9,true),predef.Error("#VALUE!","The value of sample number is not allowed"))');
verify('type.equals(stat.HYPGEOMDIST_D(1,3,"i",9,true),predef.Error("#VALUE!","The value of population successes is not allowed"))');
verify('type.equals(stat.HYPGEOMDIST_D(1,3,3,"o",true),predef.Error("#VALUE!","The value of population number is not allowed"))');
verify('type.equals(stat.HYPGEOMDIST_D(4,3,3,9,true),predef.Error("#NUM!","The sample successes must be less than the sample number"))');
verify('type.equals(stat.HYPGEOMDIST_D(-1,3,3,9,true),predef.Error("#NUM!","The sample successes must be greater than 0"))');
verify('type.equals(stat.HYPGEOMDIST_D(4,5,3,9,true),predef.Error("#NUM!","The sample successes must be less than population successes"))');
verify('type.equals(stat.HYPGEOMDIST_D(0,0,3,9,true),predef.Error("#NUM!","The sample number must be greater than 0"))');
verify('type.equals(stat.HYPGEOMDIST_D(0,1,3,2,true),predef.Error("#NUM!","The sample successes value is not allowed"))');
verify('type.equals(stat.HYPGEOMDIST_D(0,3,-1,9,true),predef.Error("#NUM!","The population successes must be greater than 0"))');
verify('type.equals(stat.HYPGEOMDIST_D(3,3,3,0,true),predef.Error("#NUM!","The population number must be greater than 0"))');
/// INTERCEPT
X = [1,2,3,4,5,6]
Y = [6,9,17,20,20,27]
exp = 2.4
verify('stat.INTERCEPT_D(Y,X)/exp < (1+eps) && stat.INTERCEPT_D(Y,X)/exp > (1-eps)');
X = [2,3,9,1,8]
Y = [6,5,11,7,5]
exp = 5.364661654
verify('stat.INTERCEPT_D(Y,X)/exp < (1+eps) && stat.INTERCEPT_D(Y,X)/exp > (1-eps)');
X = []
verify('type.equals(stat.INTERCEPT_D(X,Y),predef.Error("#VALUE!","The arrays must not be empty"))');
X = [2,7,8,3,4,1];
Y = [];
verify('type.equals(stat.INTERCEPT_D(X,Y),predef.Error("#VALUE!","The arrays must not be empty"))');
Y = [1];
verify('type.equals(stat.INTERCEPT_D(X,Y),predef.Error("#N/A","The arrays must have the same length"))');
Y = [22.9,33.49,34.5,27.61,19.5,10.11,37.9,31.08];
verify('type.equals(stat.INTERCEPT_D(X,Y),predef.Error("#N/A","The arrays must have the same length"))');
/// LARGE
X = [6,12,15,1,4];
verify('stat.LARGE(X,1) == 15')
verify('stat.LARGE(X,3) == 6')
verify('type.equals(stat.LARGE_D(X,"1"),predef.Error("#VALUE!","The k value is not allowed"))');
verify('type.equals(stat.LARGE_D(X,0),predef.Error("NUM!","The k value must be greater than zero"))');
verify('type.equals(stat.LARGE_D(X,8),predef.Error("#NUM!","The k value must be less or equal than the number of values in the array"))');
/// MAX
verify('stat.MAX_D([4,1,3,2,5,7,3]) == 7');
verify('stat.MAX_D(4,1,3,2,5,7,3) == 7');
verify('stat.MAX_D(4,1,[3,2,5,7],3) == 7');
verify('stat.MAX_D(4,1,"a",3) == 4');
/// MAXA
verify('stat.MAXA_D([4,1,3,2,5,7,3]) == 7');
verify('stat.MAXA_D(4,1,3,2,5,7,3) == 7');
verify('stat.MAXA_D(4,1,[3,2,5,7],3) == 7');
verify('type.equals(stat.MAXA_D(4,1,"a",3),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(stat.MAXA_D(4,1,[1,2,"5"],3),predef.Error("#VALUE!","The values introduced are not allowed"))');
/// MEDIAN
verify('stat.MEDIAN_D(13,8,4.5,14,9,7,1) == 8')
verify('stat.MEDIAN_D([13,8,4.5,14,9,7,1],12) == 8.5')
verify('stat.MEDIAN_D(13,8,4.5,14,9,7,1,"") == 8')
verify('stat.MEDIAN_D(13,8,4.5,14,9,7,1,[]) == 8')
/// MIN
verify('stat.MIN_D([4,1,3,2,5,7,3]) == 1');
verify('stat.MIN_D(4,1,3,2,5,7,3) == 1');
verify('stat.MIN_D(4,1,[3,2,5,7],3) == 1');
verify('stat.MIN_D(4,1,"a",3) == 1');
/// MINA
verify('stat.MINA_D([4,1,3,2,5,7,3]) == 1');
verify('stat.MINA_D(4,1,3,2,5,7,3) == 1');
verify('stat.MINA_D(4,1,[3,2,5,7],3) == 1');
verify('type.equals(stat.MINA_D(4,1,"a",3),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(stat.MINA_D(4,1,[1,2,"5"],3),predef.Error("#VALUE!","The values introduced are not allowed"))');
/// MODESINGL
verify('stat.MODESNGL_D(5.6,4,4,3,2,4) == 4');
verify('stat.MODESNGL_D(1,2,1,3,2,4,2) == 2');
verify('stat.MODESNGL_D(1,4,4,[3,2,4,2,3],3,1) == 3')
verify('type.equals(stat.MODESNGL_D(1,2,1,3,2,"m",2),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(stat.MODESNGL_D(1,2,3,4),predef.Error("#NUM!","There is no mode"))');
/// PERMUT
verify('stat.PERMUT_D(6,6) == 720');
verify('stat.PERMUT_D(7,6) == 5040');
verify('stat.PERMUT_D(10,6) == 151200');
verify('type.equals(stat.PERMUT_D("m",2),predef.Error("#VALUE!","The number value is not allowed"))');
verify('type.equals(stat.PERMUT_D(2,"m"),predef.Error("#VALUE!","The object number value is not allowed"))');
verify('type.equals(stat.PERMUT_D(-1,5),predef.Error("#NUM!","The number value must be greater or equal than 0"))');
verify('type.equals(stat.PERMUT_D(0,-1),predef.Error("#NUM!","The object number value must be greater or equal than 0"))');
verify('type.equals(stat.PERMUT_D(0,2),predef.Error("#NUM!","The number value must be greater or equal than the object number"))');
/// PERMUTATIONA
verify('stat.PERMUTATIONA_D(6,6) == 46656');
verify('stat.PERMUTATIONA_D(7,6) == 117649');
verify('stat.PERMUTATIONA_D(10,6) == 1000000');
verify('type.equals(stat.PERMUTATIONA_D("m",2),predef.Error("#VALUE!","The number value is not allowed"))');
verify('type.equals(stat.PERMUTATIONA_D(2,"m"),predef.Error("#VALUE!","The object number value is not allowed"))');
verify('type.equals(stat.PERMUTATIONA_D(-1,5),predef.Error("#NUM!","The number value must be greater or equal than 0"))');
verify('type.equals(stat.PERMUTATIONA_D(0,-1),predef.Error("#NUM!","The object number value must be greater or equal than 0"))');
verify('type.equals(stat.PERMUTATIONA_D(0,2),predef.Error("#NUM!","The number value must be greater or equal than the object number"))');
/// POISSONDIST
exp = 0.051917469
verify('stat.POISSONDIST_D(20,25,false)/exp < (1+eps) && stat.POISSONDIST_D(20,25,false)/exp > (1-eps)');
exp = 0.242414198
verify('stat.POISSONDIST_D(35,40,true)/exp < (1+eps) && stat.POISSONDIST_D(35,40,true)/exp > (1-eps)');
verify('type.equals(stat.POISSONDIST_D("m",2,false),predef.Error("#VALUE!","The events number value is not allowed"))');
verify('type.equals(stat.POISSONDIST_D(2,"m",false),predef.Error("#VALUE!","The mean value is not allowed"))');
verify('type.equals(stat.POISSONDIST_D(-1,5,false),predef.Error("#NUM!","The events number must be greater or equal than zero"))');
verify('type.equals(stat.POISSONDIST_D(5,-5,false),predef.Error("#NUM!","The mean must be greater or equal than zero"))');
/// SLOPE
X=[1,2,3,4,5,6];
Y=[3,7,17,20,20,27];
exp = 4.628571429
verify('stat.SLOPE_D(Y,X)/exp < (1+eps) && stat.SLOPE_D(Y,X)/exp > (1-eps)');
X = []
verify('type.equals(stat.SLOPE_D(X,Y),predef.Error("#VALUE!","The arrays must not be empty"))');
X = [2,7,8,3,4,1];
Y = [];
verify('type.equals(stat.SLOPE_D(X,Y),predef.Error("#VALUE!","The arrays must not be empty"))');
Y = [1];
verify('type.equals(stat.SLOPE_D(X,Y),predef.Error("#N/A","The arrays must have the same length"))');
Y = [22.9,33.49,34.5,27.61,19.5,10.11,37.9,31.08];
verify('type.equals(stat.SLOPE_D(X,Y),predef.Error("#N/A","The arrays must have the same length"))');
/// VARS
X = [1345,1301,1368,1322,1310,1370,1318,1350,1303,1299];
exp = 678.84;
verify('stat.VARP_D(X)/exp < (1+eps) && stat.VARP_D(X)/exp > (1-eps)');
verify('type.equals(stat.VARP_D(1,"a",3,4),predef.Error("#VALUE!","The values introduced are not allowed"))');
/// VARP
exp = 754.27;
verify('stat.VARS_D(X)/exp < (1+eps) && stat.VARS_D(X)/exp > (1-eps)');
verify('type.equals(stat.VARS_D(1,"a",3,4),predef.Error("#VALUE!","The values introduced are not allowed"))');
verify('type.equals(stat.VARS_D(1),predef.Error("#DIV/0!","There are fewer arguments given to the function"))');

//
// text.js
//

///
/// TEXT
///

var eps = 0.001;
/// CHAR
verify('text.CHAR_D(65) == "A"');
verify('text.CHAR_D(97) == "a"');
verify('text.CHAR_D(63) == "?"');
verify('text.CHAR_D(51) == "3"');
verify('type.equals(text.CHAR_D(777),predef.Error("#VALUE!","The value introduced is not in the range allowed"))')
verify('type.equals(text.CHAR_D("hola"),predef.Error("#VALUE!","The value introduced is not allowed"))')
/// CLEAN
verify('text.CLEAN_D("HOLA"+text.CHAR_D(9)+text.CHAR_D(11)+" MUNDO") == "HOLA MUNDO"');
/// CODE
verify('text.CODE_D("Alpha") == 65');
verify('text.CODE_D("alpha") == 97');
verify('text.CODE_D("?") == 63');
verify('text.CODE_D("3") == 51');
/// CONCATENATE
verify('text.CONCATENATE_D("Enzo"," ","ALDA") == "Enzo ALDA"');
verify('text.CONCATENATE_D("Richard"," ","LARES"," ","Mejías") == "Richard LARES Mejías"');
/// DOLLAR
verify('text.DOLLAR_D(123.456) == "$123.46"');
verify('text.DOLLAR_D(123.456,1) == "$123.5"');
verify('text.DOLLAR_D(123.456,0) == "$123"');
verify('text.DOLLAR_D(123.456,-1) == "$120"');
verify('text.DOLLAR_D(123.456,-2) == "$100"');
verify('type.equals(text.DOLLAR_D("prueba"),predef.Error("#VALUE!","The value introduced is not allowed"))');
/// EXACT
verify('text.EXACT_D("Text","Text") == true');
verify('text.EXACT_D("Text","text") == false');
verify('text.EXACT_D(1234.56,1234.56) == true');
/// FIND


// verify('text.FIND("", "", 1) = 1');
// verify('text.FIND("", "any", 1) = 1');
// verify('text.FIND("", "any", 4) = 4');
verify('text.FIND_D("berry","strawberry",1) == 6');
verify('text.FIND_D("T","Original Text") == 10');
verify('text.FIND_D("t","Original Text") == 13');
verify('text.FIND_D("i","Original Text") == 3');
verify('text.FIND_D("i","Original Text",4) == 5');
verify('type.equals(text.FIND_D("T","Original Text",-20),predef.Error("#VALUE!","The start number is less or equal than zero"))');
verify('type.equals(text.FIND_D("T","Original Text",40),predef.Error("#VALUE!","The start number is greater than the length of the supplied entire text"))');
verify('type.equals(text.FIND_D("Holi","Original Text"),predef.Error("#VALUE!","The supplied find text is nout found in the supllied entire text"))');
/// Mr Enzo
///verify('text.ARABIC_D("MCMLXXV") == 1975');
verify('text.CHAR_D(64) == "@"'); // great, but what about the next one?
verify('type.equals(text.CHAR_D("Say Whaaat?"),predef.Error("#VALUE!","The value introduced is not allowed"))'); // <= this is what MS-Excel does: you are ignoring cases like this
/// FIXED
verify('text.FIXED_D(5123.591) == 5123.59');
verify('text.FIXED_D(5123.591,1) == 5123.6');
verify('text.FIXED_D(5123.591,0) == 5124');
verify('text.FIXED_D(5123.591,-1) == 5120');
verify('text.FIXED_D(5123.591,-2) == 5100');
/// PROPER
verify('text.PROPER_D("this is a sentence") == "This Is A Sentence"');
verify('text.PROPER_D("THIS IS A SENTENCE") == "This Is A Sentence"');
verify('text.PROPER_D("111tEST teXT") == "111Test Text"');
verify('text.PROPER_D("Mr. SMITH\'s address") == "Mr. Smith\'s Address"');
/// REPLACE
verify('text.REPLACE_D("test string",7,3,"X") == "test sXng"');
verify('text.REPLACE_D("second test string",8,4,"XXX") == "second XXX string"');
verify('type.equals(text.REPLACE_D("test string",-1,3,"X"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(text.REPLACE_D("test string",7,-1,"X"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(text.REPLACE_D("test string","Prueba",3,"X"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(text.REPLACE_D("test string",7,"Otra prueba","X"),predef.Error("#VALUE!","The value introduced is not allowed"))');
/// REPT
verify('text.REPT_D("ha",8) == "hahahahahahahaha"');
verify('text.REPT_D("ha",0) == ""');
verify('"/"+text.REPT_D("*",20)+" /" == "/******************** /"');
/// SEARCH
verify('text.SEARCH_D("T","Original Text") == 10');
verify('text.SEARCH_D("t","Original Text") == 10');
verify('text.SEARCH_D("i","Original Text") == 3');
verify('text.SEARCH_D("i","Original Text",4) == 5');
verify('type.equals(text.SEARCH_D("hola","Original Text"),predef.Error("#VALUE!","The supplied find text is nout found in the supllied entire text"))');
verify('type.equals(text.SEARCH_D("t","Original Text",-3),predef.Error("#VALUE!","The start number is less or equal than zero"))');
verify('type.equals(text.SEARCH_D("t","Original Text",25),predef.Error("#VALUE!","The start number is greater than the length of the supplied entire text"))');
/// T
verify('text.T_D("text") == "text"');
verify('text.T_D(25) == ""');
verify('text.T_D(false) == ""');
/// TRIM
verify('text.TRIM_D("    trimmed text") == "trimmed text"');
verify('text.TRIM_D("trimmed text 		") == "trimmed text"');
verify('text.TRIM_D("    trimmed text 		") == "trimmed text"');
/// NUMBERVALUE
verify('text.NUMBERVALUE_D("1000") == 1000');
verify('text.NUMBERVALUE_D( "2.45", "." ) == 2.45');
verify('text.NUMBERVALUE_D("2.000.000",",",".") == 2000000')
verify('text.NUMBERVALUE_D( "1,000.05", ".", "," ) == 1000.05');
verify('text.NUMBERVALUE_D( "1.000,05", ",", "." ) == 1000.05');
exp=0.05
verify('text.NUMBERVALUE_D( "5%" )/exp < (1+eps) && text.NUMBERVALUE_D("5%")/exp > (1-eps)');
exp=0.0005
verify('text.NUMBERVALUE_D( "5%%" )/exp < (1+eps) && text.NUMBERVALUE_D("5%%")/exp > (1-eps)');
exp=0.000005
verify('text.NUMBERVALUE_D( "5%%%" )/exp < (1+eps) && text.NUMBERVALUE_D("5%%%")/exp > (1-eps)');
verify('type.equals(text.NUMBERVALUE_D("2e"),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(text.NUMBERVALUE_D("2,000,000",","),predef.Error("#VALUE!","The value introduced is not allowed"))');
verify('type.equals(text.NUMBERVALUE_D("2,000.000",",","."),predef.Error("#VALUE!","The value introduced is not allowed"))');
/// UNICHAR
verify('text.UNICHAR_D(65) == "A"')
verify('text.UNICHAR_D(66) == "B"')
verify('text.UNICHAR_D(32) == " "')
verify('text.UNICHAR_D(63) == "?"')
verify('text.UNICHAR_D(97) == "a"')
verify('type.equals(text.UNICHAR_D(0),predef.Error("#VALUE!","The number introduced is not allowed"))');
verify('type.equals(text.UNICHAR_D("a"),predef.Error("#VALUE!","The number introduced is not allowed"))');
/// UNICODE
verify('text.UNICODE_D( "Alpha" ) == 65')
verify('text.UNICODE_D( "alpha" ) == 97')
verify('text.UNICODE_D( "?" ) == 63')
verify('text.UNICODE_D( "3" ) == 51')
verify('type.equals(text.UNICODE_D(0),predef.Error("#VALUE!","The value introduced is not allowed"))');