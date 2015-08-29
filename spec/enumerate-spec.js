describe("Enumerate Test Suite", function() {

    it("exports a global", function(){
        expect(_.isObject(Enumerate)).toEqual(true);
    });

    it("creates a basic associative enum", function() {
        var productCode = new Enumerate.Enum([
            "Barcode"
        ]);
        var barcode = productCode.Barcode(1234);

        expect(productCode instanceof Enumerate.Enum).toEqual(true);
        expect(barcode instanceof Enumerate.EnumValue).toEqual(true);
        expect(barcode.value()).toEqual(1234);
        expect(barcode.toString()).toEqual("Barcode");
    });

    it("creates a basic raw value enum", function() {
        var widgetSize = new Enumerate.Enum({
            small: {w: 640, h: 480}
        });

        expect(widgetSize instanceof Enumerate.Enum).toEqual(true);
        expect(widgetSize.small instanceof Enumerate.EnumValue).toEqual(true);
        expect(widgetSize.small.value().w).toEqual(640);
        expect(widgetSize.small.toString()).toEqual("small");
    });

    it("can create a custom enum value type", function(){
        var WidgetSizeValue = Enumerate.EnumValue.extend({
            toString: function() {
                var orig = Enumerate.EnumValue.prototype.toString.call(this);
                return "size-" + orig;
            }
        });

        var params = {key: "foo", rawValue: {w: 0, h: 0}};
        var enumValue = new WidgetSizeValue(params);

        expect(enumValue instanceof WidgetSizeValue).toEqual(true);
        expect(enumValue.toString()).toEqual("size-foo");
    });

    it("can create a custom enum type", function(){
        var WidgetSizeValue = Enumerate.EnumValue.extend({
            toString: function() {
                return "size-" + this._key.toLowerCase();
            }
        });

        var WidgetSize = Enumerate.Enum.extend({
            ValueType: WidgetSizeValue,
        });

        var widgetSize = new WidgetSize({
            small: {w: 640, h: 480}
        });

        expect(widgetSize instanceof WidgetSize).toEqual(true);
        expect(widgetSize.small instanceof WidgetSizeValue).toEqual(true);
        expect(widgetSize.small.value().w).toEqual(640);
        expect(widgetSize.small.toString()).toEqual("size-small");
    });

    it("can be compared", function() {
        var direction = new Enumerate.Enum({
            north: "north",
            south: "south"
        });

        var currentDirection = direction.north;

        expect(currentDirection == direction.north).toEqual(true);
    });

    it("can be compared in a switch", function() {
        var direction = new Enumerate.Enum({
            north: "north",
            south: "south"
        });
        var compare = function(value) {
            var result;

            switch(value) {
                case direction.north:
                    result = "Go North!";
                    break;

                case direction.south:
                    result = "Go South!";
                    break;
            };

            return result;
        };

        expect(compare(direction.north)).toEqual("Go North!");
        expect(compare(direction.south)).toEqual("Go South!");
    });

    it("is iterable as a list of values", function() {
        var direction = new Enumerate.Enum({
            north: "north",
            south: "south",
        });

        var values = direction.values();
        var extracted;

        extracted = _(values).map(function(value){ return value.value() });

        expect(extracted).toEqual(["north", "south"]);
    });

    it("is iterable as a list of keys", function(){
        var direction = new Enumerate.Enum({
            north: "north",
            south: "south",
        });

        var keys = direction.keys();
        var extracted;

        extracted = _(keys).map(function(key){ return key; });

        expect(extracted).toEqual(["north", "south"]);
    });

    it("is iterable as a list of key values", function(){
        var direction = new Enumerate.Enum({
            north: "north",
            south: "south",
        });

        var keyValues = direction.keyValues();
        var extracted;

        extracted = _(keyValues).map(function(kv){
            return kv.key + ": " + kv.enumValue.value();
        });

        expect(extracted).toEqual(["north: north", "south: south"]);
    });

});
