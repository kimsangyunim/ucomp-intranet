/**
 * buiToggle
 * 
 * @ProjectDescription
 * @author codenamic@gmail.com
 * @version 1.1
 * 
 * Released on 2022-02-01
 * Copyright (c) 2018,
 *
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 * 
 */

// buiToggle
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.buiToggle = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

	'use strict';

	//
	// Variables
	//
	var defaults = {
		// general
		mode: 'normal',
		event: 'click',

		activeClass: 'active',
		
		// active: true,
		// inactive: false,
		// inactiveClass: 'inactive',

		// initialTarget: null,

		// disabled: false,
		// disabledClass: null,

		focusin: true,
		focusout: true,

		clickout: false,
		clickoutTarget: null,
		
		// target
		targetClass: 'bui-toggle-target',
		targetActiveClass: 'active',
		targetAttribute: 'data-toggle-target',

		// inactiveButton
		inactiveButton: false,
		inactiveButtonElement: 'button',
		inactiveButtonClass: 'close',
		inactiveButtonText: 'close',
		inactiveButtonArea: null,

		// react target
		reactTarget: null,
		reactTargetClass: null,
		reactTargetActiveClass: 'active',

		// react Parent
		reactParent: null,
		reactParentClass: null,
		reactParentActiveClass: 'active',

		/* callback */
		onloadCallBack: function() {return false;},
		
		eventBeforeCallBack: function() {return false;},
		eventAfterCallBack: function() {return false;},

		activeBeforeCallBack: function() {return false;},
		activeAfterCallBack: function() {return false;},

		inactiveBeforeCallBack: function() {return false;},
		inactiveAfterCallBack: function() {return false;}
	};

	/**
	 * Merge two or more objects together.
	 * @param   {Object} objects	The objects to merge together
	 * @returns {Object}			Merged values of defaults and options
	 */
	var extend = function () {
		var merged = {};
		Array.prototype.forEach.call(arguments, function (obj) {
			for (var key in obj) {
				if (!obj.hasOwnProperty(key)) return;
				merged[key] = obj[key];
			}
		});
		return merged;
	};

	/**
	 * Create the Constructor object
	 */
	var Constructor = function(selector, options) {
		
		// Merge user options with defaults
		settings = extend(defaults, options || {});
		
		var publicAPIs = {};
		var settings;
		var lastEventTarget = null;

		publicAPIs.settings = settings;
		publicAPIs.myToggle = {};

		// active
		publicAPIs.active = function(name) {
			active(settings, publicAPIs.myToggle[name]);
		}

		// inactive
		publicAPIs.inactive = function(name) {
			inactive(settings, publicAPIs.myToggle[name]);
		}

		// toggle
		publicAPIs.toggle = function(name) {
			for (let [key, value] of Object.entries(publicAPIs.myToggle)) {
				if (key === name) {
					publicAPIs.myToggle[name].toggleTarget.classList.contains(settings.activeClass) ? publicAPIs.inactive(key) : publicAPIs.active(key);
				} else {
					publicAPIs.inactive(key);
				}
			}
		}

		// tab
		publicAPIs.tab = function(name) {
			for (let [key, value] of Object.entries(publicAPIs.myToggle)) {
				if (key === name) {
					publicAPIs.active(key);
				} else {
					publicAPIs.inactive(key);
				}
			}
		}

		// update
		publicAPIs.update = function() {			
			let toggleTargets = document.querySelectorAll(selector);
			if (!toggleTargets) return;
			
			toggleTargets.forEach(function(value, index, array) {
				publicAPIs.myToggle[value.id] = {
					toggleTarget: value,
					toggleButton: document.querySelectorAll('[data-bui-toggle-button="' + value.id + '"]'),
					reactTarget: document.querySelector(settings.reactTarget),
				}

				if (settings.inactiveButton) inactiveButton(settings, publicAPIs.myToggle[value.id]);
				if (settings.focusin) focusin(settings, publicAPIs.myToggle[value.id]);

				settings.onloadCallBack.call(this, publicAPIs.myToggle[value.id].toggleTarget, publicAPIs.myToggle[value.id].reactTarget);
			});
		};
		
		/**
		 * Actions Active
		 */
		 function active(settings, toggleThis) {
			settings.eventBeforeCallBack.call(this, toggleThis.toggleTarget, toggleThis.reactTarget);
			settings.activeBeforeCallBack.call(this, toggleThis.toggleTarget, toggleThis.reactTarget);

			toggleThis.toggleTarget.classList.add(settings.activeClass);
			toggleThis.toggleButton.forEach((value) => value.classList.add(settings.activeClass));
			if (settings.reactTarget != null) toggleThis.reactTarget.classList.add(settings.reactTargetActiveClass);
			if (settings.reactParent != null) toggleThis.toggleTarget.closest(settings.reactParent).classList.add(settings.reactParentActiveClass);	

			if (settings.focusin) toggleThis.toggleTarget.focus();
			event.preventDefault();
			lastEventTarget = event.taeget;

			if (settings.focusout) focusout(settings, toggleThis);
			if (settings.clickout) clickout(settings, toggleThis);

			settings.eventAfterCallBack.call(this, toggleThis.toggleTarget, toggleThis.reactTarget);
			settings.activeAfterCallBack.call(this, toggleThis.toggleTarget, toggleThis.reactTarget);
		};
		
		/**
		 * Actions Inactive
		 */
		function inactive(settings, toggleThis) {		
			settings.eventBeforeCallBack.call(this, toggleThis.toggleTarget, toggleThis.reactTarget);
			settings.inactiveBeforeCallBack.call(this, toggleThis.toggleTarget, toggleThis.reactTarget);

			toggleThis.toggleTarget.classList.remove(settings.activeClass);
			toggleThis.toggleButton.forEach((value) => value.classList.remove(settings.activeClass));
			if (settings.reactTarget != null) toggleThis.reactTarget.classList.remove(settings.reactTargetActiveClass);
			if (settings.reactParent != null) toggleThis.toggleTarget.closest(settings.reactParent).classList.remove(settings.reactParentActiveClass);

			settings.eventAfterCallBack.call(this, toggleThis.toggleTarget, toggleThis.reactTarget);
			settings.inactiveAfterCallBack.call(this, toggleThis.toggleTarget, toggleThis.reactTarget);
		};	

		/**
		 * Inactive Button
		 */
		 function inactiveButton(settings, toggleThis) {
			var inactiveButton = toggleThis.toggleTarget.querySelector('.' + settings.inactiveButtonClass);

			if (inactiveButton === null) {
				inactiveButton = document.createElement('button');
				inactiveButton.setAttribute('type', 'button');
				inactiveButton.className = settings.inactiveButtonClass;
				inactiveButton.innerHTML = settings.inactiveButtonText;
				
				// Append Inactive Button
				settings.inactiveButtonArea === null ? toggleThis.toggleTarget.appendChild(inactiveButton) : toggleThis.toggleTarget.querySelector(settings.inactiveButtonArea).appendChild(inactiveButton);
			}

			// Inactive event
			inactiveButton.addEventListener('click', function() {
				inactive(settings, toggleThis);
			}, false);
		};

		/**
		 * reactTarget
		 */
		 function reactTarget(settings, toggleThis) {		
			toggleThis.reactTarget.classList.add(settings.activeClass);
		};

		/**
		 * Inactive by Clickout
		 */
		function clickout(settings, toggleThis) {
			document.addEventListener('mouseup', function(event) {
				if (toggleThis.toggleTarget.classList.contains(settings.activeClass) && !toggleThis.toggleTarget.contains(event.target)) {
					inactive(settings, toggleThis);
				}
			});
		};

		/**
		 * Inactive by focusout
		 */
		function focusout(settings, toggleThis) {
			toggleThis.toggleTarget.addEventListener('keydown', function(event) {
				if (event.keyCode === 9) {
					setInterval(function() {
						if (!toggleThis.toggleTarget.contains(document.activeElement)) inactive(settings, toggleThis);
					}, 1);
				}
			});
		};

		/**
		 * focus to Active target
		 */
		function focusin(settings, toggleThis) {
			toggleThis.toggleTarget.setAttribute('tabindex', '0');
		};


		/**
		 * Initialize the instance
		 */
		var init = function () {
			// Setup the DOM
			publicAPIs.update();
		};

		// Initialize and return the Public APIs
		init();
		return publicAPIs;
	};

	// Return the Constructor
	return Constructor;
})