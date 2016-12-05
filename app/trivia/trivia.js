( function ( ) {
    'use strict';

/**
 * @ngdoc function
 * @name app.controller:Trivia
 * @description
 * # Trivia
 * Controller of the app
 */
angular.module( 'app.trivia' ).controller( 'Trivia', Trivia );

/*@ngInject*/
function Trivia( ApiService, $location, $rootScope, Notification, $scope, $timeout ) {
    var vm = this;

    $rootScope.loading = false;
    vm.update = update;
    vm.toggleCategory = toggleCategory;
    vm.get = get;
    vm.clickedChallengeList = clickedChallengeList;
    vm._toggleSelect = _toggleSelect;
    vm.createNewChallengeForm = createNewChallengeForm;

  	var selEl = document.getElementById( 'trivia_challenge_selector' );

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
    
    vm.placeHolderText = 'All my Challenges';
    
    // 0 - OK Saved, 1 - Edited SavePending, 2 - Saving, -1 - Errors to fix
    vm.savingStatus = 0;
    vm.countCategoriesSelected = 0;

    // 0 - OK Saved, 1 - Edited SavePending, 2 - Saving, -1 - Errors to fix
    vm.savingStatus = 0;
    vm.countCategoriesSelected = 0;

    initialize( );

    function initialize( ) {
        $rootScope.breadCrumbs = 'Traffic  >  Trivia Challenges';
        
        getList( );
        createNewChallengeForm( );
    }
    
    function getList( ) {
        $rootScope.loading = true;
        ApiService.get( 'challenge' )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.list = response.data;
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
        ApiService.get( 'challenge', id )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.base = response.data;

                    //console.log( vm.base );
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
        
        if ( vm.base.data.challenge.challenge_seqid == -10 ) {
            createNewChallenge( );
            return;
        }

        ApiService.put( 'challenge', vm.base )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.data = response.data;

                    Notification.success( 'The Challenge question has been successfully updated' );
                    getList( );
                    selPlaceholder.textContent = vm.base.data.challenge.description;
                    document.getElementById( 'challenge_description_input' ).focus( );

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
    
    
    /* ****** Challenge Selector ****** */
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
	function _toggleSelect( ) {
		// remove focus class if any..
		_removeFocus( );
		
		if ( _isOpen( ) ) {
			if ( current !== -1 ) {
				// update placeholder text
				selPlaceholder.textContent = document.getElementById( 'option_'+current ).textContent;
			}
			classie.remove( selEl, 'cs-active' );
		} else {
			// everytime we open we wanna see the default placeholder text
			selPlaceholder.textContent = vm.placeHolderText;
			classie.add( selEl, 'cs-active' );
		}
		var mainForm = document.querySelector('.trivia_form')
        mainForm.classList.toggle( 'trivia_form_blurred' );
	}

    function clickedChallengeList( id ) {
        current = id;
        _changeOption( );
        // close select elem
        _toggleSelect( );
        get( id );
    }
    
    // This activates the form for new challenge creation
    function createNewChallengeForm( ) {
        // -10 Indicates to the API that we are going to create a new Challenge
        get( -10 );
        document.getElementById( 'challenge_description_input' ).focus( );
    }

    function createNewChallenge( ) {
        $rootScope.loading = true;
        vm.savingStatus = 2;

        ApiService.post( 'challenge', vm.base )
            .then( function ( response ) {
                if ( response.success ) {
                    vm.data = response.data;

                    Notification.success( 'The Challenge question has been successfully created' );
                    getList( );
                    createNewChallengeForm( );
                    vm.savingStatus = 0;
                } else {
                    Notification.error( response.message );
                    vm.savingStatus = -1;

                    return { };
                }
                $rootScope.loading = false;
            });
    }

}
})();