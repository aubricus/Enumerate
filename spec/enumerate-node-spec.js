describe("Enumerate node test suite", function() {

    var _ = require('underscore');
    var Enumerate = require('enumerate');

    it('imports successfully', function(){
        expect(_.isObject(Enumerate)).toBe(true);
    });

});
