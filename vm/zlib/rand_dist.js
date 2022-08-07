var PD = require("probability-distributions");

exports.normal = function normal(){
    return PD.rnorm(1)[0];
}

exports.chi_squared = function chi_squared(degrees){
    return PD.rchisq(1, degrees)[0];
}

exports.poisson = function poisson(mean_var){
    return PD.rpois(1, mean_var)[0];
}

exports.binomial = function binomial(trials, prob){
    return PD.rbinom(1, trials,prob)[0];
}
exports.fisher_f = function fisher_f(deg1,deg2){
    return PD.rexp(12, deg1, deg2);     
}

// Public domain code extracted from
// https://www.johndcook.com/python_student_t_rng.html
exports.student_t = function student_t(degrees){
    return PD.rnorm(1)[0];
    x = PD.rnorm(1)[0];
    y = PD.rgamma(1,0.5*degrees,2.0)[0];
    return x / (Math.sqrt(y/degrees))
}
