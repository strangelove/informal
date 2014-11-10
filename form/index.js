'use strict';

var prime = require('prime'),
	forOwn = require('mout/object/forOwn'),
	isArray = require('mout/lang/isArray'),
	isObject = require('mout/lang/isObject'),
	zen = require('elements/zen');

var Form = prime({
	mixin: [
		require('./pages'),
		require('./groups'),
		require('./fields')
	],

	/**
	 * @param {object} pages
	 * @param {object} data
	 */
	constructor: function(spec, data){
		if (!(this instanceof Form)){
			return new Form(spec);
		}

		if (!isObject(spec)){
			throw new Error('Spec needs to be an object');
		}

		if (!isArray(spec.pages)){
			throw new Error('No pages found in spec');
		}

		this.pages = {};
		this.groups = {};
		this.fields = {};
		this.spec = spec;
		this.data = data || {};
		this.pageCount = this.spec.pages.length;

		this.spec.method = this.spec.method || 'get';
		this.spec.action = this.spec.action || '#';
		this.spec.attributes = this.spec.attributes || {};

		this.spec.pager = this.spec.pager || {};
		this.spec.pager.position = this.spec.pager.position || 'bottom';
		this.spec.pager.type = this.spec.pager.type || 'default';
	},

	/**
	 * Build up required elements for the base form
	 */
	build: function(){
		if (this.wrap) return;
		this.wrap = zen('form.informal')
			.attribute('method', this.spec.method)
			.attribute('action', this.spec.action);
		this.pageContainer = zen('div.pages').insert(this.wrap);

		if (this.pageCount > 1){
			this.buildPager();
			this.activePage = -1;
		}

		if (this.spec.save){
			this.save = zen('input[type=submit]')
				.value(this.spec.save.label || 'Save')
				.insert(this.wrap);

			if (this.spec.save.attributes){
				forOwn(this.spec.save.attributes, function(value, key){
					this.save.attribute(key, value);
				}.bind(this));
			}
		}

		this.showPage(0);
	},

	/**
	 * Attach the form to a dom node
	 * @param {element} parent
	 */
	attach: function(parent){
		this.build();
		this.wrap.insert(parent);
	},

	serialize: function(){
		var values = {};

		forOwn(this.fields, function(field, name){
			values[name] = field.serialize();
		});

		return values;
	}
});

module.exports = Form;
