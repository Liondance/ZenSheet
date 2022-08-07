var predef = require('./predef.js');
var math   = require('./math.js');

///
/// Stat Functions
///

exports.AVERAGE = function average(arr) {
	var sum = 0;

	for (var i = 0; i < arr.length; i++){
		if (isNaN(arr[i]))
			throw predef.Error("#VALUE!","The value introduced are not allowed");

		sum += arr[i];
	}
	
	if (arr.length == 0)
		return 0;
	
	return sum/arr.length;
}

exports.AVERAGE_D = function average(arr) {
	if (!(arr instanceof Array))
		return predef.Error("#VALUE!","The value introduced are not allowed");

    try {return exports.AVERAGE(arr);}catch(error){return error;}
}


exports.AVEDEV_I = function avedev(dynamic,arg) {
	var mean = 0, count = 0, i = 0;
	while (arg[i]!=undefined) {
		if (typeof arg[i] == "object") {
			for (var j in arg[i]) {
				mean += arg[i][j];
				count++;
			}
		}
		else if (typeof arg[i] == "number") {
			mean+=arg[i];
			count++;
		}
		else {
			if (dynamic)
				return predef.Error("#VALUE!","The values introduced are not allowed");
			else
				throw predef.Error("#VALUE!","The values introduced are not allowed");
		}
		i++;
	}
	mean=mean/count;
	i = 0;
	var avedev = 0;
	while (arg[i]!=undefined) {
		if (typeof arg[i] == "object") {
			for (var j in arg[i]) {
				avedev+=Math.abs(arg[i][j]-mean);
			}
		}
		else if (typeof arg[i] == "number") {
			avedev+=Math.abs(arg[i]-mean);
		}
		else {
			if (dynamic)
				return predef.Error("#VALUE!","The values introduced are not allowed");
			else
				throw predef.Error("#VALUE!","The values introduced are not allowed");
		}
		i++;
		
	}
	return avedev/count;
}

exports.AVEDEV = function avedev(number) {
	return exports.AVEDEV_I(false,arguments);
}

exports.AVEDEV_D = function avedev(number) {
	return exports.AVEDEV_I(true,arguments);
}

exports.AVERAGEIF = function averageif(range,criteria,aveRange) {
	if (aveRange == undefined) {
		aveRange = range;
	}
	if (criteria.length>255) {
		throw predef.Error("#VALUE!","The criteria length is greater than 255");
	}
	var ave = 0, count = 0;
	for (var i in range) {
		if(eval(range[i]+criteria)) {
			if (typeof aveRange[i] == "number") {
				ave+=aveRange[i];
			}
			count++;
		}
	}
	if (ave == 0) {
		throw predef.Error("#DIV/0","Any value satisfy the criteria");
	}
	return ave/count;
}

exports.AVERAGEIF_D = function averageif(range,criteria,aveRange) {
	if (aveRange == undefined) {
		aveRange = range;
	}
	if (criteria.length>255) {
		return predef.Error("#VALUE!","The criteria length is greater than 255");
	}
	var ave = 0, count = 0;
	for (var i in range) {
		if(eval(range[i]+criteria)) {
			if (typeof aveRange[i] == "number") {
				ave+=aveRange[i];
			}
			count++;
		}
	}
	if (ave == 0) {
		return predef.Error("#DIV/0","Any value satisfy the criteria");
	}
	return ave/count;
}

exports.AVERAGEIFS = function averageifs(aveRange,criteriaRange,criteria) {
	if (criteria.length>255) {
		throw predef.Error("#VALUE!","The criteria length is greater than 255");
	}
	var ave = 0, count = 0;
	j=1;
	while (arguments[j]!=undefined) {
		for (var i in arguments[j]) {
			if(eval(arguments[j][i]+arguments[j][i+1])) {
				if (typeof aveRange[i] == "number") {
					ave+=aveRange[i];
				}
				count++;
			}
		}
		j+=2
	}
	if (ave == 0) {
		throw predef.Error("#DIV/0","Any value satisfy the criteria");
	}
	return ave/count;
}

exports.AVERAGEIFS_D = function averageifs(aveRange,criteriaRange,criteria) {
	if (criteria.length>255) {
		return predef.Error("#VALUE!","The criteria length is greater than 255");
	}
	var ave = 0, count = 0;
	j=1;
	while (arguments[j]!=undefined) {
		for (var i in arguments[j]) {
			if(eval(arguments[j][i]+arguments[j][i+1])) {
				if (typeof aveRange[i] == "number") {
					ave+=aveRange[i];
				}
				count++;
			}
		}
		j+=2
	}
	if (ave == 0) {
		return predef.Error("#DIV/0","Any value satisfy the criteria");
	}
	return ave/count;
}

exports.BINOMDIST_I = function binomdist(dynamic,k,n,p,cumulative) {
	if (k>n)
		return predef.throwable_error(dynamic,"#NUM!","The successes must be less than trials");

	else if (k<0)
		return predef.throwable_error(dynamic,"#NUM!","The successes must be greater than 0");

	else if (p<0)
		return predef.throwable_error(dynamic,"#NUM!","The probability must be greater or equal than 0");

	else if (p>1)
		return predef.throwable_error(dynamic,"#NUM!","The probability must be less or equal than 1");

	if (dynamic) {
		if (typeof k != "number") {
			return predef.Error("#VALUE!","The value introduced for the successes is not allowed");
		}
		else if (typeof n != "number") {
			return predef.Error("#VALUE!","The value introduced for the trials is not allowed");
		}
		else if (typeof p != "number") {
			return predef.Error("#VALUE!","The value introduced for the probability is not allowed");
		}
		else if (typeof cumulative != "boolean") {
			return predef.Error("#NAME!","The value introduced for cumulative is not allowed");
		}
	}
	var result = 0;
	if (!(cumulative))
		result = math.COMBIN(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);
	else
		while (k>=0) {
            result += math.COMBIN(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);
			k--;
		}
	return result;
}

exports.BINOMDIST = function binomdist(k,n,p,cumulative) {
	return exports.BINOMDIST_I(false,k,n,p,cumulative);
}

exports.BINOMDIST_D = function binomdist(k,n,p,cumulative) {
	return exports.BINOMDIST_I(true,k,n,p,cumulative);	
}

exports.BINOMDISTRANGE_I = function binomdistrange(dynamic, n,p,k,k2) {
	if (k2 == undefined) {
		k2 = k;
	}
	if (p<0) {
		return predef.throwable_error(dynamic,"#NUM!","The probability must be greater or equal than 0");
	}
	else if (p>1) {
		return predef.throwable_error(dynamic,"#NUM!","The probability must be less or equal than 1");
	}
	else if (k>n) {
		return predef.throwable_error(dynamic,"#NUM!","The successes must be less than trials");	
	} 
	else if (k<0) {
		return predef.throwable_error(dynamic,"#NUM!","The successes must be greater than 0");
	}
	else if (k2<0) {
		return predef.throwable_error(dynamic,"#NUM!","The successes must be greater than 0");	
	}
	else if (k2>n) {
		return predef.throwable_error(dynamic,"#NUM!","The successes must be less than trials");	
	} 
	else if (k2<k) {
		return predef.throwable_error(dynamic,"#NUM!","The successes range is not valid");	
		}
	if (dynamic) {
		if (typeof k != "number") {
			return predef.Error("#VALUE!","The value introduced for the lower successes is not allowed");
		}
		else if (typeof n != "number") {
			return predef.Error("#VALUE!","The value introduced for the trials is not allowed");
		}
		else if (typeof p != "number") {
			return predef.Error("#VALUE!","The value introduced for the probability is not allowed");
		}
		else if (typeof k2 != "number") {
			return predef.Error("#VALUE!","The value introduced for the higher successes is not allowed");
		}
	}
	var result=0;
	while (k2>=k) {
		result += math.COMBIN(n,k2)*Math.pow(p,k2)*Math.pow(1-p,n-k2);
		k2--;
	}
	return result;
}

exports.BINOMDISTRANGE = function binomdistrange(n,p,k,k2) {
	return exports.BINOMDISTRANGE_I(false,n,p,k,k2);
}

exports.BINOMDISTRANGE_D = function binomdistrange(n,p,k,k2) {
	return exports.BINOMDISTRANGE_I(true,n,p,k,k2);	
}

exports.BINOMINV_I = function binominv(dynamic,n,p,a) {
	if (p<0) {
		return predef.throwable_error(dynamic,"#NUM!","The probability must be greater or equal than 0");
	}
	else if (p>1) {
		return predef.throwable_error(dynamic,"#NUM!","The probability must be less or equal than 1");
	}
	else if (n<0) {
		return predef.throwable_error(dynamic,"#NUM!","The trials must be greater or equal than 0");
	}
	else if (a<0) {
		return predef.throwable_error(dynamic,"#NUM!","Alpha must be greater or equal than 0");
	}
	else if (a>1) {
		return predef.throwable_error(dynamic,"#NUM!","Alpha must be less or equal than 1");
	}
	if (dynamic) {
		if (typeof a != "number") {
			return predef.Error("#VALUE!","The value introduced for alpha is not allowed");
		}
		else if (typeof n != "number") {
			return predef.Error("#VALUE!","The value introduced for the trials is not allowed");
		}
		else if (typeof p != "number") {
			return predef.Error("#VALUE!","The value introduced for the probability is not allowed");
		}
	}
	var k=0;
	for (var i=0;i<n;i++) {
		if (exports.BINOMDIST(i,n,p,true)>a) {
			k=i;
			break;
		}
	}
	return k;
}

exports.BINOMINV = function binominv(n,p,a) {
	return exports.BINOMINV_I(false,n,p,a);
}

exports.BINOMINV_D = function binominv(n,p,a) {
	return exports.BINOMINV_I(true,n,p,a);
}

exports.EXPONDIST = function expondist(x,lambda,cumulative){
    if (x < 0)
        return predef.Error("#NUM!","x must be postive");
    if (lambda <= 0)
        return predef.Error("#NUM!","lambda must be non-negative");

    if (!cumulative) 
        return math.verifyNaN( lambda* Math.E **(-lambda*x));
    else
        return math.verifyNaN( 1 - Math.E **(-lambda*x));
}
exports.EXPONDIST_D = function expondist(x,lambda,cumulative){
    if (typeof x != "number" )
        return predef.Error("#VALUE!", "The value introduced is not allowed");
    if (typeof lambda != "number" )
        return predef.Error("#VALUE!", "The value introduced is not allowed");
    if (typeof cumulative != "boolean" )
        return predef.Error("#VALUE!", "The value introduced is not allowed");

    try {return exports.EXPONDIST(x,lambda,cumulative);}catch(error){return error;}
}

exports.NORMDIST = function normdist(x,mu,sigma,cumulative){
    if (!cumulative)
        return math.verifyNaN((1 / (Math.sqrt(2*Math.PI) * sigma) ) * Math.E**-(((x-mu))**2/ (2*(sigma**2))))
    else{
        // Copy from https://stackoverflow.com/questions/14846767/std-normal-cdf-normal-cdf-or-error-function
        
        function cdf(x, mean, variance) {
          return 0.5 * (1 + erf((x - mean) / (Math.sqrt(2 * variance))));
        }

        function erf(x) {
          // save the sign of x
          var sign = (x >= 0) ? 1 : -1;
          x = Math.abs(x);

          // constants
          var a1 =  0.254829592;
          var a2 = -0.284496736;
          var a3 =  1.421413741;
          var a4 = -1.453152027;
          var a5 =  1.061405429;
          var p  =  0.3275911;

          // A&S formula 7.1.26
          var t = 1.0/(1.0 + p*x);
          var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
          return sign * y; // erf(-x) = -erf(x);
        }

        return math.verifyNaN(cdf(x,mu,sigma));
    }
}
exports.NORMDIST_D = function normdist(x,mu,sigma,cumulative){
    if (typeof x != "number" )
        return predef.Error("#VALUE!", "The value introduced is not allowed");
    if (typeof mu != "number" )
        return predef.Error("#VALUE!", "The value introduced is not allowed");
    if (typeof sigma != "number" )
        return predef.Error("#VALUE!", "The value introduced is not allowed");
    if (typeof cumulative != "boolean" )
        return predef.Error("#VALUE!", "The value introduced is not allowed");

    try {return exports.NORMDIST(x,mu,sigma,cumulative);}catch(error){return error;}
}

exports.NORM01_D = function normdist(x){
    return exports.NORMDIST_D(x,0,1,true);
}

exports.LOGNORMDIST = function lognormdist(x,mu,sigma){
    if (x <= 0)
        return predef.Error("#NUM!","x must be non-negative");
    if (sigma <= 0)
        return predef.Error("#NUM!","sigma must be non-negative");

    return math.verifyNaN( exports.NORM01_D( (Math.log(x) - mu) / sigma ) );
}
exports.LOGNORMDIST_D = function lognormdist(x,mu,sigma){
    if (typeof x != "number" )
        return predef.Error("#VALUE!", "The value introduced is not allowed");
    if (typeof mu != "number" )
        return predef.Error("#VALUE!", "The value introduced is not allowed");
    if (typeof sigma != "number" )
        return predef.Error("#VALUE!", "The value introduced is not allowed");

    try {return exports.LOGNORMDIST(x,mu,sigma);}catch(error){return error;}
}

exports.CORREL = function correl(array1,array2) {
	var sumX = 0, sumY = 0, sumXY = 0, sumXS = 0, sumYS = 0, n = array1.length, n2 = array2.length ;
	if (n!=n2) {
		throw predef.Error("#N/A","The supplied arrays have different lengths");
	}
	else if (n==0) {
		throw predef.Error("DIV/0!","The arrays should not be empty");
	}
	for (var i = 0; i < n; i++) {
		sumX += array1[i];
		sumY += array2[i];
		sumXY += array1[i]*array2[i];
		sumXS += array1[i]*array1[i];
		sumYS += array2[i]*array2[i];
	}
	var num = ((n*sumXY) - (sumX*sumY));
	var den = ((n*sumXS) - (sumX*sumX)) * ((n*sumYS) - (sumY*sumY));
	if (den == 0) {
		throw predef.Error("DIV/0!","The standard deviation of the values should not be zero");
	}
	return num / (Math.pow( den , 0.5));
}

exports.CORREL_D = function correl(array1,array2) {
	var sumX = 0, sumY = 0, sumXY = 0, sumXS = 0, sumYS = 0, n = array1.length, n2 = array2.length ;
	if (n!=n2) {
		return predef.Error("#N/A","The supplied arrays have different lengths");
	}
	else if (n==0) {
		return predef.Error("DIV/0!","The arrays should not be empty");
	}
	for (var i = 0; i < n; i++) {
		if (typeof array1[i] != "number" || typeof array2[i] != "number") {
			return predef.Error("DIV/0!","The standard deviation of the values should not be zero");
		}
		sumX  += array1[i];
		sumY  += array2[i];
		sumXY += array1[i]*array2[i];
		sumXS += array1[i]*array1[i];
		sumYS += array2[i]*array2[i];
	}
	var num = ((n*sumXY) - (sumX*sumY));
	var den = ((n*sumXS) - (sumX*sumX)) * ((n*sumYS) - (sumY*sumY));
	if (den == 0) {
		return predef.Error("DIV/0!","The standard deviation of the values should not be zero");
	}
	return num / (Math.pow( den , 0.5));
}

exports.COUNTIF = function countif(range,criteria) {
	if (criteria.length>255) {
		throw predef.Error("#VALUE!","The criteria length is greater than 255");
	}
	var count = 0;
	for (var i in range) {
		if(eval(range[i]+criteria)) {
			count++;
		}
	}
	return count;
}

exports.COUNTIF_D = function countif(range,criteria) {
	if (criteria.length>255) {
		return predef.Error("#VALUE!","The criteria length is greater than 255");
	}
	var count = 0;
	for (var i in range) {
		if(eval(range[i]+criteria)) {
			count++;
		}
	}
	return count;
}

exports.COVARIANCEP = function covariancep(array1,array2) {
	if ((array1[0] == null) || array2[0] == null) {
		return predef.Error("#VALUE!","The arrays must not be empty")
	}
	var count=0,x=0,y=0,xy=0;
	for (var i in array1) {
		if (array2[count] == undefined) {
			throw predef.Error("#N/A","The arrays must have the same length");
		}
		else if (array1[count+1]==undefined && array2[count+1]!=undefined) {
			throw predef.Error("#N/A","The arrays must have the same length");	
		}
		x+=array1[i];
		y+=array2[i];
		xy+=array1[i]*array2[i];
		count++;
	}
	return xy/count - (x/count)*(y/count)
}

exports.COVARIANCEP_D = function covariancep(array1,array2) {
	if ((array1[0] == null) || array2[0] == null) {
		return predef.Error("#VALUE!","The arrays must not be empty")
	}
	var count=0,x=0,y=0,xy=0;
	for (var i in array1) {
		if (array2[count] == undefined) {
			return predef.Error("#N/A","The arrays must have the same length");
		}
		else if (array1[count+1]==undefined && array2[count+1]!=undefined) {
			return predef.Error("#N/A","The arrays must have the same length");	
		}
		x+=array1[i];
		y+=array2[i];
		xy+=array1[i]*array2[i];
		count++;
	}
	return xy/count - (x/count)*(y/count)
}

exports.COVARIANCES = function covariances(array1,array2) {
	if ((array1[0] == null) || array2[0] == null) {
		throw predef.Error("#VALUE!","The arrays must not be empty")
	}
	var count=0,x=0,y=0,xy=0;
	for (var i in array1) {
		if (array2[count] == undefined) {
			throw predef.Error("#N/A","The arrays must have the same length");
		}
		else if (array1[count+1]==undefined && array2[count+1]!=undefined) {
			throw predef.Error("#N/A","The arrays must have the same length");	
		}
		x+=array1[i];
		y+=array2[i];
		xy+=array1[i]*array2[i];
		count++;
	}
	return xy/(count-1) - (count/(count-1))*(x/(count))*(y/(count))
}

exports.COVARIANCES_D = function covariances(array1,array2) {
	if ((array1[0] == null) || array2[0] == null) {
		return predef.Error("#VALUE!","The arrays must not be empty")
	}
	var count=0,x=0,y=0,xy=0;
	for (var i in array1) {
		if (array2[count] == undefined) {
			return predef.Error("#N/A","The arrays must have the same length");
		}
		else if (array1[count+1]==undefined && array2[count+1]!=undefined) {
			return predef.Error("#N/A","The arrays must have the same length");	
		}
		x+=array1[i];
		y+=array2[i];
		xy+=array1[i]*array2[i];
		count++;
	}
	return xy/(count-1) - (count/(count-1))*(x/(count))*(y/(count))
}

exports.DEVSQ_I = function devsq(dynamic,arg) {
	var mean = 0, count = 0, i = 0;
	while (arg[i]!=undefined) {
		if (typeof arg[i] == "object") {
			for (var j in arg[i]) {
				mean += arg[i][j];
				count++;
			}
		}
		else if (typeof arg[i] == "number") {
			mean+=arg[i];
			count++;
		}
		else {
			if (dynamic) {
				return predef.Error("#VALUE!","The values introduced are not allowed");
			}
		}
		i++;
	}
	mean=mean/count;
	i = 0;
	var devsq = 0;
	while (arg[i]!=undefined) {
		if (typeof arg[i] == "object") {
			for (var j in arg[i]) {
				devsq+=Math.pow(arg[i][j]-mean,2);
			}
		}
		else if (typeof arg[i] == "number") {
			devsq+=Math.pow(arg[i]-mean,2);
		}
		else {
			if (dynamic) {
				return predef.Error("#VALUE!","The values introduced are not allowed");
			}
		}
		i++;
		
	}
	return devsq;
}

exports.DEVSQ = function devsq(number) {
	return exports.DEVSQ_I(false,arguments);
}

exports.DEVSQ_D = function devsq(number) {
	return exports.DEVSQ_I(true,arguments);
}

exports.FISHER = function fisher(x) {
	if ((x <= -1) || (x >= 1))
		throw predef.Error("#NUM!","The value must be greater than -1 and less than 1");

	return 0.5*Math.log((1+x) / (1-x));
}

exports.FISHER_D = function fisher(x) {
	if (typeof x != "number")
		return predef.Error("#VALUE!","The value introduced is not allowed");

    if ((x <= -1) || (x >= 1))
		return predef.Error("#NUM!","The value must be greater than -1 and less than 1");

	return 0.5*Math.log((1+x) / (1-x));
}

exports.FISHERINV = function fisherinv(y) {
	return math.verifyNaN( (Math.pow(Math.E,2*y)-1)/(Math.pow(Math.E,2*y)+1) );
}

exports.FISHERINV_D = function fisherinv(y) {
	if (typeof y != "number")
		return predef.Error("#VALUE!","The value introduced is not allowed");	

	try { return exports.FISHERINV(y) } catch (err){ return err;};
}

exports.FORECAST = function forecast(x,arrayY,arrayX) {
	if ((arrayX[0] == null) || arrayY[0] == null) {
		throw predef.Error("#VALUE!","The arrays must not be empty")
	}
	var xM = 0, y = 0, xy = 0, xx = 0, a = 0, b = 0, result = 0, n = 0;
      
	for (var i in arrayX) {
		if (arrayY[n] == undefined) {
			throw predef.Error("#N/A","The arrays must have the same length");
		}
		else if (arrayX[n+1]==undefined && arrayY[n+1]!=undefined) {
			throw predef.Error("#N/A","The arrays must have the same length");	
		}
		xM += arrayX[i];
		y += arrayY[i];
		xy += arrayX[i]*arrayY[i];
		xx += arrayX[i]*arrayX[i];
		n++;
	}

	b = ((n * xy) - (xM * y)) / ((n * xx) - (xM * xM));

	a = (y - (b * xM)) / n;
	return a + (b * x);
}

exports.FORECAST_D = function forecast(x,arrayY,arrayX) {
	if (typeof x != "number") {
		return predef.Error("#VALUE!","The predict data point introduced is not allowed");
	}
	else if ((arrayX[0] == null) || arrayY[0] == null) {
		return predef.Error("#VALUE!","The arrays must not be empty")
	}
	var xM = 0, y = 0, xy = 0, xx = 0, a = 0, b = 0, result = 0, n = 0;
      
	for (var i in arrayX) {
		if (arrayY[n] == undefined) {
			return predef.Error("#N/A","The arrays must have the same length");
		}
		else if (arrayX[n+1]==undefined && arrayY[n+1]!=undefined) {
			return predef.Error("#N/A","The arrays must have the same length");	
		}
		xM += arrayX[i];
		y += arrayY[i];
		xy += arrayX[i]*arrayY[i];
		xx += arrayX[i]*arrayX[i];
		n++;
	}

	b = ((n * xy) - (xM * y)) / ((n * xx) - (xM * xM));

	a = (y - (b * xM)) / n;
	return a + (b * x);
}

/* Pending for later*/
exports.FREQUENCY = function frequency() {}

exports.GEOMEAN = function geomean(number) {
	var geomean = 1, count = 0, i = 0;
	while (arguments[i]!=undefined) {
		if (typeof arguments[i] == "object")
			for (var j in arguments[i]) {
				if (arguments[i][j]<=0)
					throw predef.Error("#NUM!","The numbers must be positive");
				geomean *= arguments[i][j];
				count++;
			}
		else if (typeof arguments[i] == "number") {
			if (arguments[i]<=0)
				throw predef.Error("#NUM!","The numbers must be positive");
			geomean*=arguments[i];
			count++;
		}
		i++;
	}
	return math.verifyNaN(Math.pow(geomean,1/count));
}

exports.GEOMEAN_D = function geomean(number) {
	try {return exports.GEOMEAN.apply(null,arguments);}catch(error){return error;}
}

exports.HARMEAN = function harmean(number) {
	var harmean = 0, n = 0, i = 0;
	while (arguments[i]!=undefined) {
		if (typeof arguments[i] == "object")
			for (var j in arguments[i]) {
				if (arguments[i][j]<=0)
					throw predef.Error("#NUM!","The numbers must be positive")

				harmean += 1/arguments[i][j];
				n++;
			}
		else if (typeof arguments[i] == "number") {
			if (arguments[i]<=0)
				throw predef.Error("#NUM!","The numbers must be positive")
			harmean+=1/arguments[i];
			n++;
		}
		i++;
	}
	return math.verifyNaN(n/harmean);
}

exports.HARMEAN_D = function harmean(number) {
	try {return exports.HARMEAN.apply(null,arguments);}catch(error){return error;}
}

exports.HYPGEOMDIST_I = function hypgeomdist(dynamic,x,n,M,N,cumulative) {
	if (x<0)
		return predef.throwable_error(dynamic,"#NUM!","The sample successes must be greater than 0");
	if (n<=0) return predef.throwable_error(dynamic,"#NUM!","The sample number must be greater than 0");
	if (M<=0) return predef.throwable_error(dynamic,"#NUM!","The population successes must be greater than 0");
	if (N<=0) return predef.throwable_error(dynamic,"#NUM!","The population number must be greater than 0");	
	if (x>n)  return predef.throwable_error(dynamic,"#NUM!","The sample successes must be less than the sample number");	
	if (x>M)  return predef.throwable_error(dynamic,"#NUM!","The sample successes must be less than population successes");		
	if (x<n-N+M) return predef.throwable_error(dynamic,"#NUM!","The sample successes value is not allowed");	
	if (n>N)  return predef.throwable_error(dynamic,"#NUM!","The sample number must be less or equal than population number");
	if (M>N)  return predef.throwable_error(dynamic,"#NUM!","The population successes must be less or equal than population number");

	if (dynamic) {
		if (typeof x != "number") {
			return predef.Error("#VALUE!","The value of sample successes is not allowed");
		}
		else if (typeof n != "number") {
			return predef.Error("#VALUE!","The value of sample number is not allowed");
		}
		else if (typeof M != "number") {
			return predef.Error("#VALUE!","The value of population successes is not allowed");
		}
		else if (typeof N != "number") {
			return predef.Error("#VALUE!","The value of population number is not allowed");
		}
	}
	var result = 0;
	if (!(cumulative)) {
		result = math.COMBIN(M,x)*math.COMBIN(N-M,n-x)/math.COMBIN(N,n);
	}
	else {
		while (x>=0) {
			result += math.COMBIN(M,x)*math.COMBIN(N-M,n-x)/math.COMBIN(N,n);
			x--;
		}
	}
	return result;
}

exports.HYPGEOMDIST = function hypgeomdist(x,n,M,N,cumulative) {
	return exports.HYPGEOMDIST_I(false,x,n,M,N,cumulative);
}

exports.HYPGEOMDIST_D = function hypgeomdist(x,n,M,N,cumulative) {
	return exports.HYPGEOMDIST_I(true,x,n,M,N,cumulative);	
}

exports.INTERCEPT = function intercept(arrayY,arrayX) {
	if ((arrayX[0] == null) || arrayY[0] == null) {
		throw predef.Error("#VALUE!","The arrays must not be empty")
	}
	var xM = 0, y = 0, xy = 0, xx = 0, a = 0, b = 0, result = 0, n = 0;
      
	for (var i in arrayX) {
		if (arrayY[n] == undefined) {
			throw predef.Error("#N/A","The arrays must have the same length");
		}
		else if (arrayX[n+1]==undefined && arrayY[n+1]!=undefined) {
			throw predef.Error("#N/A","The arrays must have the same length");	
		}
		xM += arrayX[i];
		y += arrayY[i];
		xy += arrayX[i]*arrayY[i];
		xx += arrayX[i]*arrayX[i];
		n++;
	}

	b = ((n * xy) - (xM * y)) / ((n * xx) - (xM * xM));

	a = (y - (b * xM)) / n;
	return a;
}

exports.INTERCEPT_D = function intercept(arrayY,arrayX) {
	if ((arrayX[0] == null) || arrayY[0] == null) {
		return predef.Error("#VALUE!","The arrays must not be empty")
	}
	var xM = 0, y = 0, xy = 0, xx = 0, a = 0, b = 0, result = 0, n = 0;
      
	for (var i in arrayX) {
		if (arrayY[n] == undefined) {
			return predef.Error("#N/A","The arrays must have the same length");
		}
		else if (arrayX[n+1]==undefined && arrayY[n+1]!=undefined) {
			return predef.Error("#N/A","The arrays must have the same length");	
		}
		xM += arrayX[i];
		y += arrayY[i];
		xy += arrayX[i]*arrayY[i];
		xx += arrayX[i]*arrayX[i];
		n++;
	}

	b = ((n * xy) - (xM * y)) / ((n * xx) - (xM * xM));

	a = (y - (b * xM)) / n;
	return a;
}

exports.LARGE = function large(array,k) {
	if (k<1) {
		throw predef.Error("NUM!","The k value must be greater than zero");	
	}
	else if (k>array.length) {
		throw predef.Error("#NUM!","The k value must be less or equal than the number of values in the array")
	}
	array=array.sort(function(a, b) {return b-a});
	return array[k-1];
}

exports.LARGE_D = function large(array,k) {
	if (typeof k != "number") {
		return predef.Error("#VALUE!","The k value is not allowed");
	}
	var n = array.length;
	if (k<1) {
		return predef.Error("NUM!","The k value must be greater than zero");	
	}
	else if (k>array.length) {
		return predef.Error("#NUM!","The k value must be less or equal than the number of values in the array")
	}
	array=array.sort(function(a, b) {return b-a});
	return array[k-1];
}

exports.MAX = function max(number) {
	var max=Number.MIN_SAFE_INTEGER,i=0;
	while (arguments[i]!=undefined) {
		if (typeof arguments[i] == "object") {
			for (var j in arguments[i]) {
				if (typeof arguments[i][j] == "number") {
					max=Math.max(max,arguments[i][j]);
				}
			}
		}
		else if (typeof arguments[i] == "number") {
			max=Math.max(max,arguments[i]);
		}
		i++;
	}
	return max;
}

exports.MAX_D = function max(number) {
	var max=Number.MIN_SAFE_INTEGER,i=0;
	while (arguments[i]!=undefined) {
		if (typeof arguments[i] == "object") {
			for (var j in arguments[i]) {
				if (typeof arguments[i][j] == "number") {
					max=Math.max(max,arguments[i][j]);
				}
			}
			// console.log("SPREAD OPERATOR NOT SUPPORTED");
			max=Math.max(max,...arguments[i]);
			// max=Math.max(max,arguments[i]);
		}
		else if (typeof arguments[i] == "number") {
			max=Math.max(max,arguments[i]);
		}
		i++;
	}
	return max;
}

exports.MAXA = function maxa(number) {
	var max=Number.MIN_SAFE_INTEGER,i=0;
	while (arguments[i]!=undefined) {
		if (typeof arguments[i] == "object") {
			// console.log("SPREAD OPERATOR NOT SUPPORTED");
			max=Math.max(max,...arguments[i])
			// max=Math.max(max,arguments[i]);
		}
		else if (typeof arguments[i] == "number") {
			max=Math.max(max,arguments[i]);
		}
		i++;
	}
	return max;
}

exports.MAXA_D = function maxa(number) {
	var max=Number.MIN_SAFE_INTEGER,i=0;
	while (arguments[i]!=undefined) {
		if (typeof arguments[i] == "object") {
			for (var j in arguments[i]) {
				if (typeof arguments[i][j] == "number") {
					max=Math.max(max,arguments[i][j]);
				}
				else {
					return predef.Error("#VALUE!","The values introduced are not allowed");
				}
			}
		}
		else if (typeof arguments[i] == "number") {
			max=Math.max(max,arguments[i]);
		}
		else {
			return predef.Error("#VALUE!","The values introduced are not allowed");
		}
		i++;
	}
	return max;
}

exports.MEDIAN = function median(number) {
	var array=[],n=0;
	for (var i in arguments) {
		if (typeof arguments[i] == "number") {
			array.push(arguments[i]);
			n++;
		}
		else if (typeof arguments[i] == "object") {
			for (var j in arguments[i]) {
				if (typeof arguments[i][j] == "number") {
					array.push(arguments[i][j]);
					n++;
				}
			}
		}
	}
	array=array.sort(function(a, b) {return a-b});
	var mid = Math.floor(n/2)
        if (n % 2 != 0) {
            return array[mid]
        }
        else {
            return (array[mid-1] + array[mid]) / 2.0
        }
}

exports.MEDIAN_D = function median(number) {
	var array=[],n=0;
	for (var i in arguments) {
		if (typeof arguments[i] == "number") {
			array.push(arguments[i]);
			n++;
		}
		else if (typeof arguments[i] == "object") {
			for (var j in arguments[i]) {
				if (typeof arguments[i][j] == "number") {
					array.push(arguments[i][j]);
					n++;
				}
			}
		}
	}
	array=array.sort(function(a, b) {return a-b});
	var mid = Math.floor(n/2)
        if (n % 2 != 0) {
            return array[mid]
        }
        else {
            return (array[mid-1] + array[mid]) / 2.0
        }
}

exports.MIN = function min(number) {
	var min=Number.MAX_SAFE_INTEGER,i=0;
	while (arguments[i]!=undefined) {
		if (typeof arguments[i] == "object") {
			for (var j in arguments[i]) {
				if (typeof arguments[i][j] == "number") {
					min=Math.min(min,arguments[i][j]);
				}
			}
		}
		else if (typeof arguments[i] == "number") {
			min=Math.min(min,arguments[i]);
		}
		i++;
	}
	return min;
}

exports.MIN_D = function min(number) {
	var min=Number.MAX_SAFE_INTEGER,i=0;
	while (arguments[i]!=undefined) {
		if (typeof arguments[i] == "object") {
			for (var j in arguments[i]) {
				if (typeof arguments[i][j] == "number") {
					min=Math.min(min,arguments[i][j]);
				}
			}
			// console.log("SPREAD OPERATOR NOT SUPPORTED");
			min=Math.min(min,...arguments[i]);
			// min=Math.min(min,arguments[i]);
		}
		else if (typeof arguments[i] == "number") {
			min=Math.min(min,arguments[i]);
		}
		i++;
	}
	return min;
}

exports.MINA = function mina(number) {
	var min=Number.MAX_SAFE_INTEGER,i=0;
	while (arguments[i]!=undefined) {
		if (typeof arguments[i] == "object") {
			// console.log("SPREAD OPERATOR NOT SUPPORTED");
			min=Math.min(min,...arguments[i])
			// min=Math.min(min,arguments[i])
		}
		else if (typeof arguments[i] == "number") {
			min=Math.min(min,arguments[i]);
		}
		i++;
	}
	return min;
}

exports.MINA_D = function mina(number) {
	var min=Number.MAX_SAFE_INTEGER,i=0;
	while (arguments[i]!=undefined) {
		if (typeof arguments[i] == "object") {
			for (var j in arguments[i]) {
				if (typeof arguments[i][j] == "number") {
					min=Math.min(min,arguments[i][j]);
				}
				else {
					return predef.Error("#VALUE!","The values introduced are not allowed");
				}
			}
		}
		else if (typeof arguments[i] == "number") {
			min=Math.min(min,arguments[i]);
		}
		else {
			return predef.Error("#VALUE!","The values introduced are not allowed");
		}
		i++;
	}
	return min;
}

exports.MODESNGL_I = function modesngl(dynamic,arg) {
	var array=[],numMapping={};
	for (var i=1;i<arg.length;i++) {
		if (typeof arg[i] == "number") {
			if(numMapping[arg[i]] === undefined) {
	            numMapping[arg[i]] = 0;
	        }        
            numMapping[arg[i]] += 1;
		}
		else if (typeof arg[i] == "object") {
			for (var j in arg[i]) {
				if (typeof arg[i][j] == "number") {
					if(numMapping[arg[i][j]] === undefined) {
			            numMapping[arg[i][j]] = 0;
			        }        
		            numMapping[arg[i][j]] += 1;
				}
			}
		}
		else {
			if (dynamic) {
				return predef.Error("#VALUE!","The values introduced are not allowed");
			}
		}
	}
	var freq = 1,mode=Number.MAX_SAFE_INTEGER;
    for(var i in numMapping) {
        if (numMapping[i] > freq) {
            freq = numMapping[i];
            mode = i;
        }
        else if (numMapping[i] == freq) {
        	if (i<mode) {
        		mode=i;
        	}
        }
    }
    if (freq == 1) {
    	return predef.throwable_error(dynamic,"#NUM!","There is no mode");
    }
    return parseInt(mode);
}

exports.MODESNGL = function modesngl(number) {
	return exports.MODESNGL_I(false,arguments)
}

exports.MODESNGL_D = function modesngl(number) {
	return exports.MODESNGL_I(true,arguments)
}

exports.PEARSON = function pearson(array1,array2) {
	return exports.CORREL(array1,array2);
}

exports.PEARSON_D = function pearson(array1,array2) {
	return exports.CORREL_D(array1,array2);
}

exports.PERMUT = function permut(n,k) {
	if (n<=0)
		throw predef.Error("#NUM!","The number value must non-negative");
	if (k<0)
		throw predef.Error("#NUM!","The number chosen must be positive");
	if (n<k)
		throw predef.Error("#NUM!","The number value must be greater or equal than the object number");
	return math.verifyNaN(Math.round(math.FACT(n)/math.FACT(n-k)));
}

exports.PERMUT_D = function permut(n,k) {
	if (typeof n != "number")
		return predef.Error("#VALUE!","The number value is not allowed");
	if (typeof k != "number")
		return predef.Error("#VALUE!","The object number value is not allowed");
	try {return exports.PERMUT(Math.floor(n),Math.floor(k));}catch(error){return error;}
}

exports.PERMUTATIONA = function permutationa(n,k) {
	if (n<0) {
		throw predef.Error("#NUM!","The number value must be greater or equal than 0");
	} else if (k<0) {
		throw predef.Error("#NUM!","The object number value must be greater or equal than 0");
	} else if (n<k) {
		throw predef.Error("#NUM!","The number value must be greater or equal than the object number");
	}
	return Math.pow(n,k);
}

exports.PERMUTATIONA_D = function permutationa(n,k) {
	if (typeof n != "number") {
		return predef.Error("#VALUE!","The number value is not allowed");
	}
	else if (typeof k != "number") {
		return predef.Error("#VALUE!","The object number value is not allowed");
	}
	else if (n<0) {
		return predef.Error("#NUM!","The number value must be greater or equal than 0");
	}
	else if (k<0) {
		return predef.Error("#NUM!","The object number value must be greater or equal than 0");
	}
	else if (n<k) {
		return predef.Error("#NUM!","The number value must be greater or equal than the object number");
	}
	return Math.pow(n,k);
}

exports.POISSONDIST = function poissondist(x,mean,cumulative) {
	if (x<0) {
		throw predef.Error("#NUM!","The events number must be greater or equal than zero");
	}
	else if (mean<0) {
		throw predef.Error("#NUM!","The mean must be greater or equal than zero");
	}
	else {
		var result = 0;
		if (!(cumulative)) {
			result = Math.pow(Math.E,-mean)*Math.pow(mean,x)/math.FACT(x);
		}
		else {
			while (x>=0) {
				result += Math.pow(Math.E,-mean)*Math.pow(mean,x)/math.FACT(x);;
				x--;
			}
		}
		return result;
	}
}

exports.POISSONDIST_D = function poissondist(x,mean,cumulative) {
	if (typeof x != "number") {
		return predef.Error("#VALUE!","The events number value is not allowed");
	}
	else if (typeof mean != "number") {
		return predef.Error("#VALUE!","The mean value is not allowed");
	}
	else if (x<0) {
		return predef.Error("#NUM!","The events number must be greater or equal than zero");
	}
	else if (mean<0) {
		return predef.Error("#NUM!","The mean must be greater or equal than zero");
	}
	else {
		var result = 0;
		if (!(cumulative)) {
			result = Math.pow(Math.E,-mean)*Math.pow(mean,x)/math.FACT(x);
		}
		else {
			while (x>=0) {
				result += Math.pow(Math.E,-mean)*Math.pow(mean,x)/math.FACT(x);;
				x--;
			}
		}
		return result;
	}
}

exports.SLOPE = function slope(arrayY,arrayX) {
	if ((arrayX[0] == null) || arrayY[0] == null) {
		throw predef.Error("#VALUE!","The arrays must not be empty")
	}
	var xM = 0, y = 0, xy = 0, xx = 0, a = 0, b = 0, result = 0, n = 0;
      
	for (var i in arrayX) {
		if (arrayY[n] == undefined) {
			throw predef.Error("#N/A","The arrays must have the same length");
		}
		else if (arrayX[n+1]==undefined && arrayY[n+1]!=undefined) {
			throw predef.Error("#N/A","The arrays must have the same length");	
		}
		xM += arrayX[i];
		y += arrayY[i];
		xy += arrayX[i]*arrayY[i];
		xx += arrayX[i]*arrayX[i];
		n++;
	}

	b = ((n * xy) - (xM * y)) / ((n * xx) - (xM * xM));

	return b;
}

exports.SLOPE_D = function slope(arrayY,arrayX) {
	if ((arrayX[0] == null) || arrayY[0] == null) {
		return predef.Error("#VALUE!","The arrays must not be empty")
	}
	var xM = 0, y = 0, xy = 0, xx = 0, a = 0, b = 0, result = 0, n = 0;
      
	for (var i in arrayX) {
		if (arrayY[n] == undefined) {
			return predef.Error("#N/A","The arrays must have the same length");
		}
		else if (arrayX[n+1]==undefined && arrayY[n+1]!=undefined) {
			return predef.Error("#N/A","The arrays must have the same length");	
		}
		xM += arrayX[i];
		y += arrayY[i];
		xy += arrayX[i]*arrayY[i];
		xx += arrayX[i]*arrayX[i];
		n++;
	}

	b = ((n * xy) - (xM * y)) / ((n * xx) - (xM * xM));

	return b;
}

exports.VARP_I = function varp(dynamic,arg) {
	var sumX = 0, sumXS = 0, n = 0, i = 0;
	while (arg[i]!=undefined) {
		if (typeof arg[i] == "object") {
			for (var j in arg[i]) {
				if (typeof arg[i][j] == "number") {
					sumX += arg[i][j];
					sumXS += arg[i][j]*arg[i][j];
					n++;
				}
				else {
					if (dynamic) {
						return predef.Error("#VALUE!","The values introduced are not allowed");
					}
				}
			}
		}
		else if (typeof arg[i] == "number") {
			sumX += arg[i];
			sumXS += arg[i]*arg[i];
			n++;
		}
		else {
			if (dynamic) {
				return predef.Error("#VALUE!","The values introduced are not allowed");
			}		
		}
		i++;
	}
	return (sumXS/(n)) - (sumX/n)*(sumX/n)
}

exports.VARP = function varp(number) {
	return exports.VARP_I(false,arguments);
}

exports.VARP_D = function varp(number) {
	return exports.VARP_I(true,arguments);
}

exports.VARS_I = function vars(dynamic,arg) {
	var sumX = 0, sumXS = 0, n = 0, i = 0;
	while (arg[i]!=undefined) {
		if (typeof arg[i] == "object") {
			for (var j in arg[i]) {
				if (typeof arg[i][j] == "number") {
					sumX += arg[i][j];
					sumXS += arg[i][j]*arg[i][j];
					n++;
				}
				else {
					if (dynamic) {
						return predef.Error("#VALUE!","The values introduced are not allowed");
					}
				}
			}
		}
		else if (typeof arg[i] == "number") {
			sumX += arg[i];
			sumXS += arg[i]*arg[i];
			n++;
		}
		else {
			return predef.Error("#VALUE!","The values introduced are not allowed");
		}
		i++;
	}
	if (n < 2) {
		if (dynamic) {
			return predef.Error("#DIV/0!","There are fewer arguments given to the function");
		}
		else {
			throw predef.Error("#DIV/0!","There are fewer arguments given to the function");
		}
	}
	return (sumXS - (sumX*sumX/n))/(n-1)
}

exports.VARS = function vars(number) {
	return exports.VARS_I(false,arguments);
}

exports.VARS_D = function vars(number) {
	return exports.VARS_I(true,arguments);
}

exports.VARPA_I = function varpa(arg) {
	var sumX = 0, sumXS = 0, n = 0, i = 0;
	while (arg[i]!=undefined) {
		if (typeof arg[i] == "object") {
			for (var j in arg[i]) {
				if (typeof arg[i][j] == "number") {
					sumX += arg[i][j];
					sumXS += arg[i][j]*arg[i][j];
					n++;
				}
				else if (arg[i][j]) {
					sumX ++
					sumXS ++
					n++;	
				}
				else if (!(arg[i][j])) {
					n++;	
				}
				else if (parseInt(arg[i][j])!=NaN) {
					sumX += parseInt(arg[i][j]);
					sumXS += parseInt(arg[i][j])*parseInt(arg[i][j]);
					n++;
				}
			}
		}
		else if (typeof arg[i] == "number") {
			sumX += arg[i];
			sumXS += arg[i]*arg[i];
			n++;
		}
		else if (arg[i]) {
			sumX ++
			sumXS ++
			n++;	
		}
		else if (!(arg[i])) {
			n++;	
		}
		else if (parseInt(arg[i])!=NaN) {
			sumX += parseInt(arg[i]);
			sumXS += parseInt(arg[i])*parseInt(arg[i]);
			n++;
		}
		i++;
	}
	return (sumXS/(n)) - (sumX/n)*(sumX/n)
}

exports.VARPA = function varpa(number) {
	return exports.VARPA_I(arguments);
}

exports.VARPA_D = function varpa(number) {
	return exports.VARPA_I(arguments);
}

exports.VARA_I = function vara(dynamic,number) {
	var sumX = 0, sumXS = 0, n = 0, i = 1;
	while (arguments[i]!=undefined) {
		if (typeof arguments[i] == "object") {
			for (var j in arguments[i]) {
				if (typeof arguments[i][j] == "number") {
					sumX += arguments[i][j];
					sumXS += arguments[i][j]*arguments[i][j];
					n++;
				}
				else if (arguments[i][j]) {
					sumX ++
					sumXS ++
					n++;	
				}
				else if (!(arguments[i][j])) {
					n++;	
				}
				else if (parseInt(arguments[i][j])!=NaN) {
					sumX += parseInt(arguments[i][j]);
					sumXS += parseInt(arguments[i][j])*parseInt(arguments[i][j]);
					n++;
				}
			}
		}
		else if (typeof arguments[i] == "number") {
			sumX += arguments[i];
			sumXS += arguments[i]*arguments[i];
			n++;
		}
		else if (arguments[i]) {
			sumX ++
			sumXS ++
			n++;	
		}
		else if (!(arguments[i])) {
			n++;	
		}
		else if (parseInt(arguments[i])!=NaN) {
			sumX += parseInt(arguments[i]);
			sumXS += parseInt(arguments[i])*parseInt(arguments[i]);
			n++;
		}
		i++;
	}
	if (n < 2) {
		return predef.throwable_error(dynamic,"#DIV/0!","There are fewer arguments given to the function");
	}
	return (sumXS - (sumX*sumX/n))/(n-1)
}

exports.VARA = function vara(number) {
	return exports.VARA_I(false,number);
}

exports.VARA_D = function vara(number) {
	return exports.VARA_I(true,number)
}