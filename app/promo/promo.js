( function ( ) {
    'use strict';

/**
 * @ngdoc function
 * @name app.controller:Promo
 * @description
 * # Promo
 * Controller of the app
 */
angular.module( 'app.promo' ).controller( 'Promo', Promo );

/*@ngInject*/
function Promo( ApiService, Utils, $location, $rootScope, Notification, $scope, $timeout ) {
    var vm = this;

    $rootScope.loading = false;
    vm.update = update;
    vm.toggleCategory = toggleCategory;
    vm.get = get;
    vm.clickedOptionList = clickedOptionList;
    vm._toggleSelect = _toggleSelect;
    vm.createNewChallengeForm = createNewForm;
    vm.pickerOnSuccess = pickerOnSuccess;
    vm.selectorOpen = false;
  	var selEl = document.getElementById( 'promotion_selector' );

	// all options
	var selOpts = [ ].slice.call( selEl.querySelectorAll( 'li[data-option]' ) );

    // total options
/*
    var selOptsCount = selOpts.length;
    var preSelCurrent;
*/
	
    // current index
    var current = selOpts.indexOf( selEl.querySelector( 'li.cs-selected' ) ) || -1;
    
    // placeholder elem
    var selPlaceholder = selEl.querySelector( 'span.cs-placeholder' );
    
    vm.placeHolderText = 'All my Promos';
    
    // 0 - OK Saved, 1 - Edited SavePending, 2 - Saving, -1 - Errors to fix
    vm.savingStatus = 0;
    vm.countCategoriesSelected = 0;

    // 0 - OK Saved, 1 - Edited SavePending, 2 - Saving, -1 - Errors to fix
    vm.savingStatus = 0;
    vm.countCategoriesSelected = 0;

    initialize( );

    function initialize( ) {
        $rootScope.breadCrumbs = 'Traffic  >  Promotions';
        
        getList( );

        // Delete just for testing
        //get( 34 );

        createNewForm( );
    }
    
    function getList( defaultItemId ) {
        $rootScope.loading = true;
        ApiService.get( 'sponsor_promo' )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.list = response.data;
/*
                    $timeout( function( ) {
                        if ( defaultItemId != undefined ) {
                            clickedOptionList( defaultItemId, false );
                        }
                    }, 0, true );
*/
                } else {
                    Notification.error( response.message );
                    vm.savingStatus = -1;
                    return { };
                }
                $rootScope.loading = false;
            });
    }

    function get( id ) {
        $rootScope.loading = true;
        ApiService.get( 'sponsor_promo', id )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.base = response.data;
                    
                    if ( id == -10 ) {
                        // Starts immediately by default 
                        vm.base.data.promo.start_date = moment( ).format( 'YYYY-MM-DD HH:mm' );
                    } else {
                        // Give the right format
                        vm.base.data.promo.start_date = moment( vm.base.data.promo.start_date ).format( 'YYYY-MM-DD HH:mm' );
                    }

                    vm.base.form_extra.select_category = [
                            { 
                                background_color: "#f14c38",
                                category_title: "Bar Code",
                                challenge_category_seqid: 2,
                                checked: false,
                                fa_class: "fa fa-barcode",
                                img_url: "http://primg.checkpointchallenge.com:81/utils/form_icons/edit.svg"
                            },
                            { 
                                background_color: "#f14c38",
                                category_title: "QR Code",
                                challenge_category_seqid: 2,
                                checked: false,
                                fa_class: "fa fa-qrcode",
                                img_url: "http://primg.checkpointchallenge.com:81/utils/form_icons/edit.svg"
                            },
                            { 
                                background_color: "#f14c38",
                                category_title: "Copy Code",
                                challenge_category_seqid: 2,
                                checked: false,
                                fa_class: "fa fa-copy",
                                img_url: "http://primg.checkpointchallenge.com:81/utils/form_icons/edit.svg"
                            },
                            { 
                                background_color: "#f14c38",
                                category_title: "Print",
                                challenge_category_seqid: 2,
                                checked: false,
                                fa_class: "fa fa-print",
                                img_url: "http://primg.checkpointchallenge.com:81/utils/form_icons/edit.svg"
                            }
                        ];
                    

/*
                    // 1 Month duration by default 
                    var endDate = moment( ).add( 1, 'months' );
                    vm.base.data.promo.end_date = moment( endDate ).format( 'YYYY-MM-DD HH:mm' );
*/
                    // Timeout to wait for digest process to load the DOM
                    $timeout( function( ) {
                        document.getElementById( 'promo_description' ).focus( );
                    }, 0, true );
                } else {
                    Notification.error( response.message );
                    vm.savingStatus = -1;
                    return { };
                }
                $rootScope.loading = false;
            });
    }
    
    // This activates the form for new challenge creation
    function createNewForm( ) {
        // -10 Indicates to the API that we are going to create a new Challenge
        get( -10 );
        //$scope.promo_form.$setPristine();
        //document.getElementById( 'promo_description' ).focus( );
    }

    function validatePayload( ) {
        var notNull = [ 'description', 'detail', 'img_uri', 'coupons' ];
        var texts = {
            description: 'Description',
            detail: 'Details',
            img_uri: 'Logo',
            coupons: 'How Many Coupons?'
        };
        var message = 'Please fill these values:';
        var valid = true;
        notNull.forEach( function( item, index ) {
            if ( !Utils.isNotEmpty( vm.base.data.promo[ item ] ) ) {
                message += ' - ' +  texts[ item ].toUpperCaseFirstChar( );
                valid = false;
            }
        } );

        if ( !valid ) {
            Notification.warning( { message: message, delay: 10000 } );
        }

        return valid;
    }

    function createNew( ) {
        $rootScope.loading = true;
        vm.savingStatus = 2;

        ApiService.post( 'sponsor_promo', vm.base )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.data = response.data;

                    Notification.success( 'The Promotion has been successfully created. - ' + vm.data.message );
                    getList( vm.data.promo_seqid );
       				selPlaceholder.textContent = vm.base.data.promo.description;
                    get( vm.data.promo_seqid );

                    //createNewForm( );
                    vm.savingStatus = 0;
                } else {
                    Notification.error( response.message );
                    vm.savingStatus = -1;

                    return { };
                }
                $rootScope.loading = false;
            });
    }

    function update( ) {
        $rootScope.loading = true;
        vm.savingStatus = 2;

        if ( !validatePayload( ) ) {
            vm.savingStatus = -1;
            $rootScope.loading = false;
            return;
        } 
        
        if ( vm.base.data.promo.promo_seqid == -10 ) {
            createNew( );
            return;
        }

        ApiService.put( 'sponsor_promo', vm.base )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.data = response.data;

                    Notification.success( 'The Promotion has been successfully updated. - ' + vm.data.message );
                    getList( );
                    selPlaceholder.textContent = vm.base.data.promo.description;
                    document.getElementById( 'promo_description' ).focus( );

                    vm.savingStatus = 0;
                } else {
                    Notification.error( response.message );
                    vm.savingStatus = -1;

                    return { };
                }
                $rootScope.loading = false;
            });
    }

    function countCategoriesSelected( ) {
        vm.countCategoriesSelected = 0;
        try {
            for ( var i=0; i < vm.profile.form_extra.select_category.length; i++ ) {
                var cat = vm.profile.form_extra.select_category[ i ];
                if ( cat.checked ) vm.countCategoriesSelected++;
            }
        } catch( e ) {
            
        }
    }

    function toggleCategory( object ) {
        object.checked = !object.checked;
        countCategoriesSelected( );
    }
    
    
    /* ****** List Selector ****** */
  	function hasParent( e, p ) {
		if (!e) return false;
		var el = e.target||e.srcElement||e||false;
		while (el && el != p) {
			el = el.parentNode||false;
		}
		return (el!==false);
	}

    function _navigateOpts( dir ) {
		if( !_isOpen( ) ) {
			_toggleSelect();
		}

		var tmpcurrent = typeof preSelCurrent != 'undefined' && preSelCurrent !== -1 ? preSelCurrent : current;

		if( dir === 'prev' && tmpcurrent > 0 || dir === 'next' && tmpcurrent < selOptsCount - 1 ) {
			// save pre selected current - if we click on option, or press enter, or press space this is going to be the index of the current option
			preSelCurrent = dir === 'next' ? tmpcurrent + 1 : tmpcurrent - 1;
			// remove focus class if any..
			_removeFocus();
			// add class focus - track which option we are navigating
			classie.add( selOpts[ preSelCurrent ], 'cs-focus' );
		}
	}

	// close the select element if the target it´s not the select element or one of its descendants..
	document.addEventListener( 'click', function( ev ) {
		var target = ev.target;
		if( _isOpen( ) && target !== selEl && !hasParent( target, selEl ) ) {
			_toggleSelect( );
            $scope.$apply( );
		}
	} );

	// keyboard navigation events
/*
	selEl.addEventListener( 'keydown', function( ev ) {
		var keyCode = ev.keyCode || ev.which;

		switch (keyCode) {
			// up key
			case 38:
				ev.preventDefault();
				_navigateOpts('prev');
				break;
			// down key
			case 40:
				ev.preventDefault();
				_navigateOpts('next');
				break;
			// space key
			case 32:
				ev.preventDefault();
				if( _isOpen() && typeof preSelCurrent != 'undefined' && preSelCurrent !== -1 ) {
					_changeOption();
				}
				_toggleSelect();
				break;
			// enter key
			case 13:
				ev.preventDefault();
				if( _isOpen( ) && typeof preSelCurrent != 'undefined' && preSelCurrent !== -1 ) {
    				get( );
					_changeOption( );
					_toggleSelect( );
				}
				break;
			// esc key
			case 27:
				ev.preventDefault();
				if( _isOpen() ) {
					_toggleSelect();
				}
				break;
		}
	} );
*/

	/**
	 * removes the focus class from the option
	 */
	function _removeFocus ( opt ) {
		var focusEl = selEl.querySelector( 'li.cs-focus' )
		if( focusEl ) {
			classie.remove( focusEl, 'cs-focus' );
		}
	}


	/**
	 * change option - the new value is set
	 */
	function _changeOption ( ) {
		// if pre selected current (if we navigate with the keyboard)...
		if( typeof preSelCurrent != 'undefined' && preSelCurrent !== -1 ) {
			current = preSelCurrent;
			preSelCurrent = -1;
		}

		// current option
                        console.log( current );
		var opt = document.getElementById( 'option_' + current );

		// update current selected value
		selPlaceholder.textContent = opt.textContent;

		// remove class cs-selected from old selected option and add it to current selected option
		var oldOpt = selEl.querySelector( 'li.cs-selected' );
		if( oldOpt ) {
			classie.remove( oldOpt, 'cs-selected' );
		}
		classie.add( opt, 'cs-selected' );
	}

	/**
	 * returns true if select element is opened
	 */
	 function _isOpen ( opt ) {
		return classie.has( selEl, 'cs-active' );
	}


	/**
	 * open/close select
	 * when opened show the default placeholder if any
	 */
	function _toggleSelect( visual ) {
    	if ( visual == undefined ) visual = true;

		// remove focus class if any..
		_removeFocus( );
		
		if ( _isOpen( ) ) {
			vm.selectorOpen = false;
			if ( current !== -1 ) {
				// update placeholder text
				selPlaceholder.textContent = document.getElementById( 'option_'+current ).textContent;
			}
			if ( visual ) classie.remove( selEl, 'cs-active' );
		} else {
			// everytime we open we wanna see the default placeholder text
			selPlaceholder.textContent = vm.placeHolderText;
			if ( visual ) classie.add( selEl, 'cs-active' );
			vm.selectorOpen = true;
		}

/*
		var mainForm = document.querySelector( '.promo_form' )
        mainForm.classList.toggle( 'promo_form_blurred' );
*/
	}

    function clickedOptionList( id, visual ) {
    	if ( visual == undefined ) visual = true;

        current = id;
        _changeOption( );
        // close select elem
        _toggleSelect( visual );
        get( id );
        document.getElementById( 'promo_description' ).focus( );
    }
    
    function pickerOnSuccess( Blob ) {
        console.log(Blob);
        //vm.base.data.promo.logo_url = Blob.url;
/*
        $scope.files.push(Blob);
        $window.localStorage.setItem('files', JSON.stringify($scope.files));
*/
    }
}
})();