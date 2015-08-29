;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['underscore'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('underscore'));
  } else {
    root.Enumerate = factory(root._);
  }
}(this, function(_) {
/** ===================================
 * @module Enumerate
 * @description Javascript Pseudo-Enums inspired by Swift.
 * @version 0.0.1
 * @author Aubrey Taylor
 * ================================= */

var exports = {};

/**
 * Extend method modified from Backbone.js 1.2.2
 *
 * (c) 2010-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Backbone may be freely distributed under the MIT license.
 * For all details and documentation:
 * http://backbonejs.org
 */

var extend = function(protoProps, staticProps) {
    var Child     = function(){ return parent.apply(this, arguments); };
    var Surrogate = function(){ this.constructor = child; };
    var parent    = this;

    var propsHasConstructor = protoProps && _.has(protoProps, 'constructor');
    var child;

    child = propsHasConstructor ? protoProps.constructor : Child;

    _.extend(child, parent, staticProps);

    Surrogate.prototype = parent.prototype;
    child.prototype     = new Surrogate();

    if (protoProps) _.extend(child.prototype, protoProps);

    child.__super__ = parent.prototype;

    return child;
};

/* end backbone extend */

/**
 * A base EnumValue type
 *
 * @param {EnumValue} namedParams {key, (rawValue || associatedValue) }
 */
var EnumValue = function(namedParams) {
    namedParams = namedParams || {};

    this._key             = namedParams.key;
    this._rawValue        = namedParams.rawValue;
    this._associatedValue = namedParams.associatedValue;
};

EnumValue.extend = extend;

/**
 * get EnumValue associated value, will be undefined if constructed
 * as rawValue enum
 *
 * @return {any} returns this._associatedValue
 */
EnumValue.prototype.getAssociatedValue = function () {
    return this._associatedValue;
};

/**
 * get EnumValue raw value, will be undefined if constructed
 * as an associative enum
 *
 * @return {any} returns this_.rawValue
 */
EnumValue.prototype.getRawValue = function () {
    return this._rawValue;
};

/**
 * syntax sugar to ease extracting EnumValue values
 * @return {[type]} [description]
 */
EnumValue.prototype.value = function () {
    var raw   = this.getRawValue();
    var assoc = this.getAssociatedValue();

    if(!_.isUndefined(assoc)) {
        return assoc;
    }

    if(!_.isUndefined(raw)) {
        return raw;
    }
};

/**
 * converts EnumValue to string
 * @return {String} returns the this._key
 */
EnumValue.prototype.toString = function () {
    return this._key;
};

/**
 * A base Enum type
 * @param {array or object} valuse configuration parameters
 */
var Enum = function(values) {
    this.ValueType = this.ValueType || EnumValue;

    this._values = values;
    this._enumeratedValues = this.enumerateValues(this._values);

    _.extend(this, this._enumeratedValues);
};

Enum.extend = extend;

/**
 * return enum as a list of EnumValues
 * @return {Array} [EnumValue...]
 */
Enum.prototype.values = function() {
    return _(this._enumeratedValues).values();
};

/**
 * returns enum as a list of keys
 * @return {Array} [key...]
 */
Enum.prototype.keys = function() {
    return _(this._enumeratedValues).keys();
};

/**
 * return enum as a list of key, EnumValue pairs
 * @return {Array} [{key, EnumValue}...]
 */
Enum.prototype.keyValues = function() {
    return this._enumeratedValuesToKeyValues(this._enumeratedValues);
};

/**
 * internal helper function to format enumerated values as an array
 * of key, value pairs
 * @param  {Array} values [[key, EnumValue]...]
 * @return {Array}        [{key, EnumValue}...]
 */
Enum.prototype._enumeratedValuesToKeyValues = function(values) {
    return _(this._enumeratedValues).map(function(value, key){
        return {key: key, enumValue: value};
    });
};

/**
 * parse and return constructor params
 * @param  {array or object} params configuration params, passed in from constructor
 * @return {object} parsed enumeration data
 */
Enum.prototype.enumerateValues = function(values) {
    var mapAssoc = this._mapAssociativeValues.bind(this);
    var mapRaw   = this._mapRawValues.bind(this);
    var isObject = !_.isArray(values) && _.isObject;
    var isArray  = _.isArray(values);
    var mapper;

    if(isArray) mapper = mapAssoc;
    if(isObject) mapper = mapRaw;

    return _.chain(values)
        .map(mapper)
        .object()
        .value();
};

/**
 * internal helper function to parse the associative param form
 * @param  {string} key eventual enum value key
 * @return {array} returns [key, function]
 */
Enum.prototype._mapAssociativeValues = function(key) {
    return [key, this._createAssociativeConstructor(key)];
};

/**
 * internal helper function to create an associative enum constructor
 * @param  {string} key eventual enum value key
 * @return {[type]} returns [key, any]
 */
Enum.prototype._createAssociativeConstructor = function (key) {
    return function(value) {
        return new this.ValueType({key: key, associatedValue: value});
    };
};

/**
 * internal helper function to parse the raw param form
 * @param  {any} value passed in via constructor, can be any valid JS type
 * @param  {string} key passed in via constructor, represents enum value key
 * @return {[type]} returns [key, EnumValue]
 */
Enum.prototype._mapRawValues = function(value, key) {
    return [
        key,
        new this.ValueType({key: key, rawValue: value})
    ];
};

exports.EnumValue = EnumValue;
exports.Enum = Enum;



return exports;
}));
