/**
 * buiToggle
 * 
 * @ProjectDescription
 * @author codenamic@gmail.com
 * @version 1.1
 * 
 * Copyright (c) 2018,
 *
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 * 
 */
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' && module.exports ) {
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

		active: true,
		activeClass: 'active',

		inactive: false,
		inactiveClass: 'inactive',

		disabled: false,
		disabledClass: null,

		focusin: false,
		focusout: false,

		clickout: false,
		clickoutTarget: null,

		// target
		target: null,
		targetClass: 'bui-toggle-target',
		targetActiveClass: 'active',
		targetAttribute: 'data-toggle-target',
		targetObject: null,

		// close
		close: false,
		closeButton: 'button',
		closeButtonClass: 'close',
		closeButtonText: 'close',
		closeButtonArea: null,

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

	//
	// Methods
	//

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

	// Actions Active
	function active(settings, toggleThis) {
		settings.eventBeforeCallBack.call(toggleThis);
		settings.activeBeforeCallBack.call(toggleThis);

		toggleThis.target.classList.add(settings.activeClass);
		if (settings.inactive) toggleThis.target.classList.remove(settings.inactiveClass);
		if (toggleThis.button != null) toggleThis.button.classList.add(settings.activeClass);
		if (settings.reactTarget != null) toggleThis.reactTarget.classList.add(settings.reactTargetActiveClass);
		if (settings.reactParent != null) toggleThis.target.closest(settings.reactParent).classList.add(settings.reactParentActiveClass);
		if (settings.focusin) focusin(toggleThis);
		toggleThis.active = true;

		settings.eventAfterCallBack.call(toggleThis);
		settings.activeAfterCallBack.call(toggleThis);
	};
	
	// Actions Inactive
	function inactive(settings, toggleThis) {
		settings.eventBeforeCallBack.call(toggleThis);
		settings.inactiveBeforeCallBack.call(toggleThis);
		
		toggleThis.target.classList.remove(settings.activeClass);
		if (settings.inactive) toggleThis.target.classList.add(settings.inactiveClass);
		if (toggleThis.button != null) toggleThis.button.classList.remove(settings.activeClass);
		if (settings.reactTarget != null) toggleThis.reactTarget.classList.remove(settings.reactTargetActiveClass);
		if (settings.reactParent != null) toggleThis.target.closest(settings.reactParent).classList.remove(settings.reactParentActiveClass);
		toggleThis.active = false;

		settings.eventAfterCallBack.call(toggleThis);
		settings.inactiveAfterCallBack.call(toggleThis);
	};

	// Create Inactive Button
	function createInactiveButton(settings, toggleThis) {
		var inactiveButton = toggleThis.target.querySelector('.' + settings.closeButtonClass);
		if (inactiveButton === null) {
			inactiveButton = document.createElement('button');
			inactiveButton.setAttribute('type', 'button');
			inactiveButton.className = settings.closeButtonClass;
			inactiveButton.innerHTML = settings.closeButtonText;
			
			// Append Inactive Button
			settings.closeButtonArea === null ? toggleThis.target.appendChild(inactiveButton) : toggleThis.target.querySelector(settings.closeButtonArea).appendChild(inactiveButton);
		}

		// Inactive event
		inactiveButton.addEventListener('click', function(event) {
			event.preventDefault();
			// this.blur();
			inactive(settings, toggleThis);
		}, false);
	};

	// Inactive by Clickout
	function clickout(settings, toggleThis) {
		document.addEventListener('mouseup', function(event) {
			if (toggleThis.active) {
				if (!toggleThis.clickoutTarget.contains(event.target)) {
					inactive(settings, toggleThis);
				}
			}
		});
	};

	// Inactive by focusout
	function focusout(settings, toggleThis) {
		document.addEventListener('keyup', function(event) {
			if (toggleThis.active && event.keyCode === 9) {
				if (!toggleThis.target.contains(event.target)) {
					inactive(settings, toggleThis);
				}
			}
		});
	};

	// Move focus to Active target
	function focusin(toggleThis) {
		toggleThis.target.setAttribute('tabindex', '0');
		toggleThis.target.focus();
	};

	// Move focus to Active target
	function focusReturn(toggleThis) {
		toggleThis.target.setAttribute('tabindex', '0');
		toggleThis.target.focus();
	};

	/**
	 * Create the Constructor object
	 */
	var Constructor = function(selector, options) {

		// Merge user options with defaults
		settings = extend(defaults, options || {});

		var publicAPIs = {};
		var settings;		
		var toggleCount = 0;

		publicAPIs.myToggle = {};

		/**
		 * Create an object to apply to BuiToggle
		 */
		var setProperties = function(toggleTarget) {
			var toggleName = toggleTarget.id;
			var toggleTarget = toggleTarget;
			var toggleButton = document.querySelector('[data-bui-toggle-button=' + toggleTarget.id + ']');
			var reactTarget = document.querySelector(settings.reactTarget);

			publicAPIs.myToggle[toggleTarget.id] = {
				name: toggleName,
				active: false,
				target: toggleTarget,
				button: toggleButton,
				reactTarget: reactTarget,
				clickoutTarget: settings.clickoutTarget != null ? toggleTarget.querySelector(settings.clickoutTarget) : toggleTarget
			};
		};

		publicAPIs.active = function(toggleName) {
			active(settings, publicAPIs.myToggle[toggleName]);
			// console.log(this);
			// console.log(event.target);
			// if(event.target) {
			// }
		};

		publicAPIs.inactive = function(toggleName) {
			inactive(settings, publicAPIs.myToggle[toggleName]);
		};
	
		publicAPIs.toggle = function(toggleName) {
			(!publicAPIs.myToggle[toggleName].target.classList.contains(settings.activeClass)) ? publicAPIs.active(toggleName) : publicAPIs.inactive(toggleName);
		};

		publicAPIs.update = function() {
			var toggleTargets = document.querySelectorAll(selector);
			if (!toggleTargets) return;
			
			Array.prototype.forEach.call(toggleTargets, function(toggleTarget, index) {
				if (index >= toggleCount) {
					setProperties(toggleTarget);
					toggleActions(publicAPIs.myToggle[toggleTarget.id]);
					// check toggle item length
					// console.log(index + ', ' + toggleCount);
					toggleCount = toggleCount + 1;
				}
				settings.onloadCallBack.call(publicAPIs.myToggle[toggleTarget.id]);
			});
		};

		var toggleActions = function(toggleThis) {
			if(toggleThis.button != null) {
				if (settings.event === 'click') {
					toggleThis.button.addEventListener('click', function(event) {
						event.preventDefault();
						publicAPIs.toggle(toggleThis.name);
					}, false);
				}

				if (settings.event === 'hover') {
					toggleThis.button.addEventListener('mouseenter', function() {
						publicAPIs.active(toggleThis.name);
					}, false);

					toggleThis.button.addEventListener('mouseleave', function() {
						publicAPIs.inactive(toggleThis.name);
					}, false);

					toggleThis.target.addEventListener('mouseenter', function() {
						publicAPIs.active(toggleThis.name);
					}, false);

					toggleThis.target.addEventListener('mouseleave', function() {
						publicAPIs.inactive(toggleThis.name);
					}, false);
				}
			}

			if (settings.close) createInactiveButton(settings, toggleThis);
			if (settings.clickout) clickout(settings, toggleThis);
			if (settings.focusout) focusout(settings, toggleThis);
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
});

/**
 * buiTab
 */
 (function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.buiTab = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

	'use strict';

	// Variables
	var defaults = {
		// general
		mode: 'normal',
		active: false,
		activeClass: 'current',
		initial: 0,

		// tab
		tabItem: '.tab-item',
		tabName: '.tab-name',
		buttonActiveText: null,
		buttonAppendTo: null,
		tabItemReact: false,

		// target
		target: null,
		targetClass: 'bui-tab-target',
		targetActiveClass: 'active',
		container: '.tab-content',

		/* callback */
		onloadCallBack: function() {return false;},
		eventCallBack: function() {return false;},
		activeCallBack: function() {return false;},
		inactiveCallBack: function() {return false;}
	};

	/**
	 * Merge two or more objects together.
	 * @param	{Object}	objects		The objects to merge together
	 * @returns	{Object}				Merged values of defaults and options
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

	var tabToggle = function(settings, tabs) {
		tabs.item.classList.add(settings.activeClass);
		tabs.item.setAttribute('title', '현재 선택된 항목');

		Array.prototype.forEach.call(getSiblings(tabs.item), function(siblingsItem) {
			siblingsItem.classList.remove(settings.activeClass);
			siblingsItem.removeAttribute('title');
		});

		if(tabs.target != null) {
			tabs.target.classList.add(settings.targetActiveClass);
			Array.prototype.forEach.call(getSiblings(tabs.target), function(siblingsItem) {
				siblingsItem.classList.remove(settings.targetActiveClass);
			});
		}

		if (settings.tabItemReact != false) {
			var items = tabs.item;
			var left = items.offsetLeft + items.clientWidth + 16;
			var move = left - window.outerWidth;

			if (window.outerWidth < left) {
				items.parentElement.parentElement.scrollTo(move, 0);
			} else{
				items.parentElement.parentElement.scrollTo(0, 0);
			}
		}
	}

	var tabItemReact = function(settings, selectItems) {
		if (settings.tabItemReact != false) {
			Array.prototype.forEach.call(selectItems, function(list, index) {
				var items = list.querySelector('.' + settings.activeClass);
				var left = items.offsetLeft + items.clientWidth + 16;
				var move = left - window.outerWidth;
				items.parentElement.parentElement.style.scrollBehavior = 'smooth';

				if (window.outerWidth < left) {
					items.parentElement.parentElement.scrollTo(move, 0);
				} else{
					items.parentElement.parentElement.scrollTo(0, 0);
				}
			});
		}
	}

	/**
	 * Create the Constructor object
	 */
	var Constructor = function (selector, options) {

		// Merge user options with defaults
		settings = extend(defaults, options || {});

		// Variables
		var publicAPIs = {};
		var settings;

		publicAPIs.itemEntry = [];

		 publicAPIs.createProperties = function(item, name, target) {
			this.item = item;
			this.name = name;
			this.target = target;
		};

		/**
		 * Setup the DOM with the proper attributes
		 */
		publicAPIs.setup = function() {
			// Variables
			var selectItems = document.querySelectorAll(selector);
			if (!selectItems) return;
		
			Array.prototype.forEach.call(selectItems, function(list, index) {
				var listEntry = [];
				var initial = settings.initial;
				var items = list.querySelectorAll(settings.tabItem);

				Array.prototype.forEach.call(items, function(item, index) {
					var name = item.querySelector(settings.tabName);
					var target = document.querySelector(name.getAttribute('href'));
					listEntry[index] = new publicAPIs.createProperties(item, name, target);
					item.classList.contains(settings.activeClass) ? initial = index : null;
				});

				// actions
				Array.prototype.forEach.call(listEntry, function(tabs, index) {
					tabs.target != null ? tabs.target.classList.add(settings.targetClass) : null;
					initial === index ? tabToggle(settings, tabs) : null;
					tabs.name.addEventListener('click', function(e) {
						
						settings.eventCallBack.call();
						settings.mode != 'null' ? e.preventDefault() : null;

						// after click
						if(settings.mode === 'scroll') {
							tabs.target.closest(settings.container).scrollTo({
								top: tabs.target.offsetTop,
								behavior: 'smooth'
							});
						} else {
							tabToggle(settings, tabs);
						}
					});
					
					// after scroll
					if(settings.mode === 'scroll') {

						// closest 으로 변경
						tabs.target.closest(settings.container).addEventListener('scroll', function(event) {
							if(this.scrollTop + 48 >= tabs.target.offsetTop && this.scrollTop + 48 < tabs.target.offsetTop + tabs.target.offsetHeight) {
								tabToggle(settings, tabs);
							}
						});
					}
				});
			});

			tabItemReact(settings, selectItems);
		};

		/**
		 * Initialize the instance
		 */
		var init = function () {
			// Setup the DOM
			publicAPIs.setup();
		};

		// Initialize and return the Public APIs
		init();
		return publicAPIs;
	};

	// Return the Constructor
	return Constructor;
});



/**
 * buiFold
 */
 (function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.buiExpand = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

	'use strict';

	// Variables
	var defaults = {
		// general
		active: false,
		activeClass: 'active',
		initial: 0,

		ellipsis: false,
		ellipsisLimit: 2,
		ellipsisField: '',
		ellipsisActiveClass: 'limit',

		// target
		target: null,
		targetClass: 'bui-fold-target',
		targetActiveClass: 'active',

		// close
		button: 'button',
		buttonClass: 'expand',
		buttonActiveClass: 'active',
		buttonText: '펼치기',
		buttonActiveText: null,
		buttonAppendTo: null,

		// accordion
		// accordion: true,

		/* callback */
		onloadCallBack: function() {return false;},
		eventCallBack: function() {return false;},
		activeCallBack: function() {return false;},
		inactiveCallBack: function() {return false;}
	};

	/**
	 * Merge two or more objects together.
	 * @param	{Object}	objects		The objects to merge together
	 * @returns	{Object}				Merged values of defaults and options
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

	var actionActive = function(settings, toggleTarget, toggleButton) {
		toggleTarget.classList.add(settings.activeClass);
		toggleButton.classList.add(settings.buttonActiveClass);
		settings.buttonActiveText != null ?  toggleButton.innerHTML = settings.buttonActiveText : null;
	};

	var actionInactive = function(settings, toggleTarget, toggleButton) {
		toggleTarget.classList.remove(settings.activeClass);
		toggleButton.classList.remove(settings.buttonActiveClass);
		settings.buttonActiveText != null ? toggleButton.innerHTML = settings.buttonText : null;
	};

	var ellipsis = function(settings, toggleTarget) {
		var field = toggleTarget.querySelector(settings.ellipsisField); 
		var containerHeight = field.offsetHeight 
		var lineHeight = parseInt(window.getComputedStyle(field).getPropertyValue('line-height')); 
		var lines = containerHeight / lineHeight;

		if (lines > settings.ellipsisLimit) {
			toggleTarget.classList.add(settings.ellipsisActiveClass);
		} else {
			toggleTarget.classList.remove(settings.ellipsisActiveClass);
		}
	};

	var actionSetup = function(settings, toggleTarget) {

		toggleTarget.classList.add(settings.targetClass);
		var toggleButton = document.createElement('button');
		toggleButton.setAttribute('type', 'button');
		toggleButton.className = settings.buttonClass;
		toggleButton.innerHTML = settings.buttonText;

		if(settings.buttonAppendTo != null) {
			if(toggleTarget.querySelector(settings.buttonAppendTo)) {
				toggleTarget.querySelector(settings.buttonAppendTo).appendChild(toggleButton);
			}
		} else {
			toggleTarget.appendChild(toggleButton);
		};

		toggleButton.addEventListener('click', function(e) {
			if (settings.accordion === true) {
				if(toggleTarget.classList.contains(settings.activeClass)) {
					actionInactive(settings, toggleTarget, toggleButton);
				} else {
					actionActive(settings, toggleTarget, toggleButton);
					var siblings = getSiblings(toggleTarget);
					Array.prototype.forEach.call(siblings, function(siblingItem) {
						var siblingItemButton = siblingItem.getElementsByClassName(settings.buttonClass)[0];
						actionInactive(settings, siblingItem, siblingItemButton);
					});
				}
			} else {
				toggleTarget.classList.contains(settings.activeClass) ? actionInactive(settings, toggleTarget, toggleButton) : actionActive(settings, toggleTarget, toggleButton);
			}
			settings.eventCallBack.call(toggleTarget, toggleButton);
		});

		if(toggleTarget.classList.contains(settings.activeClass)) {
			actionActive(settings, toggleTarget, toggleButton);
		}
	}

	/**
	 * Create the Constructor object
	 */
	var Constructor = function (selector, options) {

		// Merge user options with defaults
		settings = extend(defaults, options || {});

		// Variables
		var publicAPIs = {};
		var settings;

		/**
		 * Setup the DOM with the proper attributes
		 */
		publicAPIs.setup = function() {

			// Variables
			var selectItems = document.querySelectorAll(selector);
			if (!selectItems) return;

			Array.prototype.forEach.call(selectItems, function(toggleTarget) {

				// Setup Toggle Button
				actionSetup(settings, toggleTarget);

				if(settings.ellipsis === true) {
					ellipsis(settings, toggleTarget);
					window.addEventListener('resize', function() {
						ellipsis(settings, toggleTarget);
					}, false);
				}
			});
		};
		/**
		 * Initialize the instance
		 */
		var init = function () {
			// Setup the DOM
			publicAPIs.setup();
		};

		// Initialize and return the Public APIs
		init();
		return publicAPIs;
	};
	
	// Return the Constructor
	return Constructor;
});