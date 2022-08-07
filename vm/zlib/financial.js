var predef = require('./predef.js');

///
/// Financial functions
///

// exports.DB = function(cost,salvage,life,period,month){
    // var rate = 1-(salvage/cost) ** (1/life);
    // var fyde = cost * rate * (month/12);
    // var oydep
// }

exports.FV = function fv(rate,nper,pmt,pv,type) {
	if (pmt == undefined) {
		pmt=0;
	}
	if (pv==undefined) {
		pv=0;
	}
	if (type==undefined) {
		type=0;
	}
	return ((1+rate*type)*pmt*(Math.pow(1+rate,nper)-1)/rate) + (pv*Math.pow(1+rate,nper));
}

exports.FV_D = function fv(rate,nper,pmt,pv,type) {
	if (pmt == undefined) {
		pmt=0;
	}
	if (pv==undefined) {
		pv=0;
	}
	if (type==undefined) {
		type=0;
	}
	if ((typeof rate != "number") || (typeof nper != "number") || (typeof pmt != "number") || (typeof pv != "number") || (typeof type != "number")) {
		return predef.Error("#VALUE!","All arguments must be numbers");
	}
	return ((1+rate*type)*pmt*(Math.pow(1+rate,nper)-1)/rate) + (pv*Math.pow(1+rate,nper));
}

exports.PMT = function pmt(rate,nper,pv,fv,type) {
	if (fv==undefined) {
		fv=0;
	}
	if (type==undefined) {
		type=0;
	}
	if (rate<=-1) {
		throw predef.Error("#NUM!","The rate must be greater than -1");
	} 
	if (nper==0) {
		throw predef.Error("#NUM!","The nper must be different to zero")
	}
	return rate*( fv + pv*Math.pow(1+rate,nper)) / ( (1+rate*type)*(Math.pow(1+rate,nper)-1) );
}

exports.PMT_D = function pmt(rate,nper,pv,fv,type) {
	if (fv==undefined) {
		fv=0;
	}
	if (type==undefined) {
		type=0;
	}
	if ((typeof rate != "number") || (typeof nper != "number") || (typeof fv != "number") || (typeof pv != "number") || (typeof type != "number")) {
		return predef.Error("#VALUE!","All arguments must be numbers");
	}
	if (rate<=-1) {
		return predef.Error("#NUM!","The rate must be greater than -1");
	} 
	if (nper==0) {
		return predef.Error("#NUM!","The nper must be different to zero")
	}
	return rate*( fv + pv*Math.pow(1+rate,nper)) / ( (1+rate*type)*(Math.pow(1+rate,nper)-1) );
}

exports.PV = function pv(rate,nper,pmt,fv,type) {
	if (pmt == undefined) {
		pmt=0;
	}
	if (fv==undefined) {
		fv=0;
	}
	if (type==undefined) {
		type=0;
	}
	return ((1+rate*type)*pmt*(1-Math.pow(1+rate,-nper))/rate) + (fv*Math.pow(1+rate,-nper))
}

exports.PV_D = function pv(rate,nper,pmt,fv,type) {
	if (pmt == undefined) {
		pmt=0;
	}
	if (fv==undefined) {
		fv=0;
	}
	if (type==undefined) {
		type=0;
	}
	if ((typeof rate != "number") || (typeof nper != "number") || (typeof pmt != "number") || (typeof fv != "number") || (typeof type != "number")) {
		return predef.Error("#VALUE!","All arguments must be numbers")
	}
	return ((1+rate*type)*pmt*(1-Math.pow(1+rate,-nper))/rate) + (fv*Math.pow(1+rate,-nper))
}

exports.NPV = function npv(rate,value1) {
	total=0,i=1,v=1;
	while (arguments[i]!=undefined) {
		if (typeof arguments[i] == "object") {
			for (var j in arguments[i]) {
				if (typeof arguments[i][j]=="number") {
					total+=arguments[i][j] / Math.pow(1+rate,v);
					v++;
				}
			}
		}
		else if (typeof arguments[i] == "number") {
			total+=arguments[i] / Math.pow(1+rate,v);
			v++;
		}
		i++;
	}
	return total;
}

exports.NPV_D = function npv(rate,value1) {
	total=0,i=1,v=1;
	while (arguments[i]!=undefined) {
		if (typeof arguments[i] == "object") {
			for (var j in arguments[i]) {
				if (typeof arguments[i][j]=="number") {
					total+=arguments[i][j] / Math.pow(1+rate,v);
					v++;
				}
			}
		}
		else if (typeof arguments[i] == "number") {
			total+=arguments[i] / Math.pow(1+rate,v);
			v++;
		}
		i++;
	}
	return total;
}

exports.MIRR = function mirr(values,finance,reinvest) {
	var poscf=[],negcf=[],totalpv=0,totalfv=0,pvcount=0;fvcount=0;
	for (var i in values) {
		if(values[i]<0) {
			negcf.push(values[i]);
			pvcount++;
		}
		else {
			poscf.push(values[i]);
			fvcount++;
		}
	}
	for (var i in negcf) {
		totalpv+=exports.PV(finance,i,0,-negcf[i]);
	}
	for (var i in poscf) {
		totalfv+=exports.FV(reinvest,(fvcount-i-1),0,poscf[i]);
	}
	return (Math.pow(totalfv/totalpv,1/(pvcount+fvcount-1))-1)

}

exports.BKPMIRR = function bkpmirr(values,finance,reinvest) {
	var poscf=[],negcf=[],totalpv=0,totalfv=0,pvcount=0;fvcount=0;
	for (var i in values) {
		if(values[i]<0) {
			negcf.push(values[i]);
			pvcount++;
		}
		else {
			poscf.push(values[i]);
			fvcount++;
		}
	}
	for (var i in negcf) {
		totalpv+=exports.PV(finance,i,0,-negcf[i]);
	}
	for (var i in poscf) {
		totalfv+=exports.FV(reinvest,(fvcount-i-1),0,poscf[i]);
	}
	return (Math.pow(totalfv/totalpv,1/(pvcount+fvcount-1))-1)

}
