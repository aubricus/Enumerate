# Enumerate

> An enumeration defines a common type for a group of related values and enables you to work with those values in a type-safe way withing your code.

Enumerate is JS Pseudo-Enums inspired by Swift.

While we aren't very concerned with type-safety in JS it is sometimes still useful to have a small convention around defining a common *type* for a group of related values.

Enumerate provides this convention.

## Version

*v0.0.1*

## Dependencies

- Underscore or Lodash ~latest

## Available Files

- [Development Version of enumerate.js](build/enumerate.js)
- [Production Version of enumerate.js](build/enumerate.min.js)
- [Bundled Production Version of enumerate.js](build/enumerate.bundled.min.js)

> The bundled version comes with Underscore 1.8.3 bundled in.

## Installation

**Html**

```html
<script src="static/js/vendor/enumerate/enumerate.min.js" ></script>
<script src="static/js/main.js"></script>
```

```javascript
// main.js
(function(window, Enumerate){

    // ...

})(window, Enumerate);
```

**RequireJS**

```javascript

// standard define
define(["app/vendor/enumerate/enumerate"], function(Enumerate){

    // ...

});

// or
// commonJS style imports
var Enumerate = require("app/vendor/enumerate/enumerate");

```

**Node**

```javascript
var Enumerate = require("enumerate");
```

## Usage

> Check out the [specs](spec/enumerate-spec.js) for more usage examples!

> Check out [src/enumerate.js](src/enumerate.js) for docs / comments!

There are essentially two ways to construct an Enumerate.Enum type:

- As an associative enum
- As an enum with a raw value

### Associative Value Enum Example

Sometimes it's useful to store associated values alongside enum values. This enables the storage of additional custom information and permits this information to vary each time.

```javascript

var ProductCode = new Enumerate.Enum([
    "Barcode",
    "QrCode",
    "ISBN"
]);

var Product = function(productCode) {
    this.productCode = productCode;
}

var toy = new Product( ProductCode.Barcode("85909-51226") );

console.log(toy.productCode.value()); // => 85909-51226

```

### Raw Value Enums

Sometimes you just need a simple data structure to store some basic values for a small set of read-only object keys. This is where raw value enums come in handy.

> Raw value enums can store any valid JS type.

> Raw value enums should share the same data type by convention.

```javascript

var direction = new Enumerate.Enum({
    North: "north",
    South: "south",
    East: "east",
    West: "west"
});

var dir = direction.North;

switch(dir) {
    case direction.North:
        console.log("To Canada!");
        break;

    case direction.South:
        console.log("To Mexico!");
        break;

    case direction.East:
        console.log("To Europe!");
        break;

    case direction.West:
        console.log("To Japan!");

    default:
        console.log("Going Nowhere!");
}

// => To Canada!

```

### Feeling Iterable?

```javascript
// iterate over enum as a list of EnumValues

_.each(direction.values(), function(enumValue){
    alert(enumValue.value());
});

// iterate over enum as a list of keys

_.each(direction.keys(), function(key){
    alert(key);
});

// iterate over enum as a list of {key, EnumValue} pairs

_.each(direction.keyValues(), function(kv){
    alert(kv.key + ": " + kv.enumValue.value())
});

```

### Custom Types

**Enumerate.EnumValue** and **Enumerate.Enum** are extendable via a familiar `.extend` method.

```javascript
var DirectionEnumValue = Enumerate.EnumValue.extend({
    toString: function() {
        var orig = Enumerate.EnumValue.prototype.toString.call(this);
        return "[DirectionEnumValue] " + orig;
    }
});

var DirectionEnum = Enumerate.Enum.extend({
    ValueType: DirectionEnumValue,

    toString: function() {
        var all = _(this.values()).map(function(enumValue){
            return enumValue.toString();
        });

        return all.join(" | ");
    }
});

var direction = new DirectionEnum({
    north: "north",
    south: "south",
    east: "east",
    west: "west"
});

console.log(direction.toString());
// => [DirectionEnumValue] north | [DirectionEnumValue] south | [DirectionEnumValue] east | [DirectionEnumValue] west

```
