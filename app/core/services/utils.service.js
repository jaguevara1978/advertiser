( function(  ) {    'use strict';    /**     * @ngdoc service     * @name app.FireworksService     * @description     * # FireworksService     * Factory in the app.     */    angular.module( 'app' ).factory( 'Utils', Utils );    function Utils( ) {        var service = { };                service.getWinSize = getWinSize;        service.isNotEmpty = isNotEmpty;        service.isMobile = {            Android: function( ) {                return navigator.userAgent.match(/Android/i);            },            BlackBerry: function( ) {                return navigator.userAgent.match(/BlackBerry/i);            },            iOS: function( ) {                return navigator.userAgent.match(/iPhone|iPad|iPod/i);            },            Opera: function( ) {                return navigator.userAgent.match(/Opera Mini/i);            },            Windows: function( ) {                return navigator.userAgent.match(/IEMobile/i);            },            any: function( ) {                return ( service.isMobile.Android( )                 || service.isMobile.BlackBerry( )                 || service.isMobile.iOS( )                 || service.isMobile.Opera( )                 || service.isMobile.Windows( ) );            }        };        /** Window Resize Event */        var $event = $.event,        $special,        resizeTimeout;                $special = $event.special.debouncedresize = {        	setup: function() {        		$( this ).on( "resize", $special.handler );        	},        	teardown: function() {        		$( this ).off( "resize", $special.handler );        	},        	handler: function( event, execAsap ) {        		// Save the context        		var context = this,        			args = arguments,        			dispatch = function() {        				// set correct event type        				event.type = "debouncedresize";        				$event.dispatch.apply( context, args );        			};                		if ( resizeTimeout ) {        			clearTimeout( resizeTimeout );        		}                		execAsap ?        			dispatch() :        			resizeTimeout = setTimeout( dispatch, $special.threshold );        	},        	threshold: 250        };        // ======================= imagesLoaded Plugin ===============================        // https://github.com/desandro/imagesloaded                // $('#my-container').imagesLoaded(myFunction)        // execute a callback when all images have loaded.        // needed because .load() doesn't work on cached images                // callback function gets image collection as argument        //  this is the container                // original: MIT license. Paul Irish. 2010.        // contributors: Oren Solomianik, David DeSandro, Yiannis Chatzikonstantinou                // blank image data-uri bypasses webkit log warning (thx doug jones)        var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';                $.fn.imagesLoaded = function( callback ) {        	var $this = this,        		deferred = $.isFunction($.Deferred) ? $.Deferred() : 0,        		hasNotify = $.isFunction(deferred.notify),        		$images = $this.find('img').add( $this.filter('img') ),        		loaded = [],        		proper = [],        		broken = [];                	// Register deferred callbacks        	if ($.isPlainObject(callback)) {        		$.each(callback, function (key, value) {        			if (key === 'callback') {        				callback = value;        			} else if (deferred) {        				deferred[key](value);        			}        		});        	}                	function doneLoading() {        		var $proper = $(proper),        			$broken = $(broken);                		if ( deferred ) {        			if ( broken.length ) {        				deferred.reject( $images, $proper, $broken );        			} else {        				deferred.resolve( $images );        			}        		}                		if ( $.isFunction( callback ) ) {        			callback.call( $this, $images, $proper, $broken );        		}        	}                	function imgLoaded( img, isBroken ) {        		// don't proceed if BLANK image, or image is already loaded        		if ( img.src === BLANK || $.inArray( img, loaded ) !== -1 ) {        			return;        		}                		// store element in loaded images array        		loaded.push( img );                		// keep track of broken and properly loaded images        		if ( isBroken ) {        			broken.push( img );        		} else {        			proper.push( img );        		}                		// cache image and its state for future calls        		$.data( img, 'imagesLoaded', { isBroken: isBroken, src: img.src } );                		// trigger deferred progress method if present        		if ( hasNotify ) {        			deferred.notifyWith( $(img), [ isBroken, $images, $(proper), $(broken) ] );        		}                		// call doneLoading and clean listeners if all images are loaded        		if ( $images.length === loaded.length ){        			setTimeout( doneLoading );        			$images.unbind( '.imagesLoaded' );        		}        	}                	// if no images, trigger immediately        	if ( !$images.length ) {        		doneLoading();        	} else {        		$images.bind( 'load.imagesLoaded error.imagesLoaded', function( event ){        			// trigger imgLoaded        			imgLoaded( event.target, event.type === 'error' );        		}).each( function( i, el ) {        			var src = el.src;                			// find out if this image has been already checked for status        			// if it was, and src has not changed, call imgLoaded on it        			var cached = $.data( el, 'imagesLoaded' );        			if ( cached && cached.src === src ) {        				imgLoaded( el, cached.isBroken );        				return;        			}                			// if complete is true and browser supports natural sizes, try        			// to check for image status manually        			if ( el.complete && el.naturalWidth !== undefined ) {        				imgLoaded( el, el.naturalWidth === 0 || el.naturalHeight === 0 );        				return;        			}                			// cached images don't fire load sometimes, so we reset src, but only when        			// dealing with IE, or image is complete (loaded) and failed manual check        			// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f        			if ( el.readyState || el.complete ) {        				el.src = BLANK;        				el.src = src;        			}        		});        	}                	return deferred ? deferred.promise( $this ) : $this;        };        // ======================= imagesLoaded Plugin ===============================        // ======================= imagesLoaded Plugin ===============================              	function getWinSize( ) {            var $window = $( window );    		return { width : $window.width(), height : $window.height() };    	}        // ======================= Grid Plugin ===============================                service.Grid = ( function( ) {            var $window = $( window );            // list of items        	var $grid = $( '#og-grid' );            	function init( config ) {                // list of items            	$grid = $( '#og-grid' );        		// the items        		//$items = $grid.children( 'li' );                		// preload all images        		$grid.imagesLoaded( function() {        			// initialize some events        			initEvents();        		} );        	}                	function initEvents( ) {        		// on window resize get the window�s size again        		// reset some values..        		$window.on( 'debouncedresize', function() {                    // Do something if you want to        		} );        	}        	return {         		init : init        	};        } ) ( );        // ======================= Grid Plugin ===============================        // validates that the field value string has one or more characters in it        function isNotEmpty( value ) {            if ( value == null || value == undefined ) return false;          //var str = elem.value;            var re = /.+/;            if ( !String( value ).match( re ) ) {                //alert("Please fill in the required field.");                //setTimeout("focusElement('" + elem.form.name + "', '" + elem.name + "')", 0);                return false;            } else {                return true;            }        }        //validates that the entry is a positive or negative number        function isNumber(elem) {          var str = elem.value;            var re = /^[-]?\d*\.?\d*$/;            str = str.toString();            if (!str.match(re)) {                alert("Enter only numbers into the field.");                setTimeout("focusElement('" + elem.form.name + "', '" + elem.name + "')", 0);                return false;            }            return true;        }        // validates that the entry is 16 characters long        function isLen16(elem) {          var str = elem.value;            var re = /\b.{16}\b/;            if (!str.match(re)) {                alert("Entry does not contain the required 16 characters.");                setTimeout("focusElement('" + elem.form.name + "', '" + elem.name + "')", 0);                return false;            } else {                return true;            }        }        // validates that the entry is formatted as an e-mail address        function isEMailAddr(elem) {          var str = elem.value;            var re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;            if (!str.match(re)) {                alert("Verify the e-mail address format.");                setTimeout("focusElement('" + elem.form.name + "', '" + elem.name + "')", 0);                return false;            } else {                return true;            }        }        // validate that the user made a selection other than default        function isChosen(select) {            if (select.selectedIndex == 0) {                alert("Please make a choice from the list.");                return false;            } else {                return true;            }        }                // validate that the user has checked one of the radio buttons        function isValidRadio(radio) {            var valid = false;            for (var i = 0; i < radio.length; i++) {                if (radio[i].checked) {                    return true;                }            }            alert("Make a choice from the radio buttons.");            return false;        }                function focusElement(formName, elemName) {            var elem = document.forms[formName].elements[elemName];            elem.focus();            elem.select();        }                // batch validation router        function validateForm(form) {            if (isNotEmpty(form.name1)) {                if (isNotEmpty(form.name2)) {                    if (isNotEmpty(form.eMail)) {                        if (isEMailAddr(form.eMail)) {                            if (isChosen(form.continent)) {                                if (isValidRadio(form.accept)) {                                    return true;                                }                            }                        }                    }                }            }            return false;        }        String.prototype.toUpperCaseFirstChar = function( ) {            return this.substr( 0, 1 ).toUpperCase( ) + this.substr( 1 );        }                String.prototype.toLowerCaseFirstChar = function() {            return this.substr( 0, 1 ).toLowerCase( ) + this.substr( 1 );        }                String.prototype.toUpperCaseEachWord = function( delim ) {            delim = delim ? delim : ' ';            return this.split( delim ).map( function(v) { return v.toUpperCaseFirstChar() } ).join( delim );        }                String.prototype.toLowerCaseEachWord = function( delim ) {            delim = delim ? delim : ' ';            return this.split( delim ).map( function(v) { return v.toLowerCaseFirstChar() } ).join( delim );        }        return service;    }} )( );