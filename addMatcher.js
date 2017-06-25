/*
  This is a better API for defining custom Jasmine matchers.
*/
let matcher = function (name, messageTemplates, checkFn, formatValueFn = jasmine.pp) {
    return {
        [name]: function (util, customEqualityTesters) {
            messageTemplates = [].concat(messageTemplates);
            let normalMessage = messageTemplates[0]
                .replace(' (not)', '')
                .replace(' (NOT)', '');
            let negatedMessage = messageTemplates[1] ||
                messageTemplates[0]
                    .replace('(not)', 'not')
                    .replace('(NOT)', 'NOT');

            return {
                compare: function (actual, expected) {
                    let pass = checkFn(actual, expected, util, customEqualityTesters);
                    let message = (pass ? negatedMessage : normalMessage);
                    message = message
                        .replace('{actual}', formatValueFn(actual, util, customEqualityTesters))
                        .replace('{expected}', formatValueFn(expected, util, customEqualityTesters));
                    return { pass, message };
                }
            };
        }
    };
};

let addMatcher = function (name, messageTemplates, checkFn, formatValueFn = jasmine.pp) {
    return jasmine.addMatchers(matcher(name, messageTemplates, checkFn, formatValueFn));
};

module.exports = {matcher, addMatcher};
