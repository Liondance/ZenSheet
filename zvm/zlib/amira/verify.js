///
/// Test harness utilities
///

function verify(assertion) {
	var ok = eval(assertion);
	console.log((ok ? "PASSED: " : "FAILED: ") + assertion);
}


var default_epsilon = 0.000001;

function near(x, y, epsilon) {
	if (epsilon == undefined) {
		epsilon = default_epsilon;
	}
	var error = Math.abs(x - y) / ((Math.abs(x) + Math.abs(y))/2.0);
	return error < epsilon;
}

function log3(x) {
	return Math.log(x) / Math.log(3);
}

verify("log3(3 * 3 * 3 * 3 * 3) == 5");

verify("near(log3(3 * 3 * 3 * 3 * 3), 5)");
