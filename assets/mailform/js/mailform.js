
/*----------------------------------------------
	
	Script Name : Responsive Mailform
	Author : FIRSTSTEP - Motohiro Tani
	Author URL : https://www.1-firststep.com
	Create Date : 2014/3/25
	Version : 3.3
	Last Update : 2017/2/10
	
----------------------------------------------*/


var mailform_dt  = $( '#mail_form dl dt' );
var start_time   = 0;
var stop_time    = 0;
var writing_time = 0;




function slice_method( dt ) {
	var span_start = dt.html().indexOf( '</span>' );
	var span_end   = dt.html().lastIndexOf( '<span' );
	var dt_name    = dt.html().slice( span_start+7, span_end );
	return dt_name;
}




function compare_method( s, e ) {
	if ( s > e ) {
		return e;
	} else {
		return s;
	}
}




function error_span( e, dt, comment, bool ) {
	if ( bool == true ) {
		var m = e.parents( 'dd' ).find( 'span' ).text( dt + ' ' + '이' + ' ' + comment + '입력되어 있지 않습니다' );
	} else {
		var m = e.parents( 'dd' ).find( 'span' ).text( '' );
	}
}




function hidden_append( name, value ){
	$( '<input />' )
		.attr({
			type: 'hidden',
			name: name,
			value: value
		})
		.appendTo( $( '#mail_form dl' ).next( 'p' ) );
}




function required_check() {
	
	var error        = 0;
	var scroll_point = $( 'body' ).height();
	
	
	if ( $( '.required' ).find( 'input#name_1' ).length ) {
		var element = $( '.required' ).find( 'input#name_1' );
		var dt      = element.parents( 'dd' ).prev( 'dt' );
		var dt_name = slice_method( dt );
		if ( element.val() == '' ) {
			error_span( element, dt_name, '입력', true );
			error++;
			scroll_point = compare_method( scroll_point, element.offset().top );
		} else {
			error_span( element, dt_name, '', false );
		}
	}
	
	
	if ( $( '.required' ).find( 'input#read_1' ).length ) {
		var element = $( '.required' ).find( 'input#read_1' );
		var dt      = element.parents( 'dd' ).prev( 'dt' );
		var dt_name = slice_method( dt );
		if ( element.val() == '' ) {
			error_span( element, dt_name, '입력', true );
			error++;
			scroll_point = compare_method( scroll_point, element.offset().top );
		} else {
			error_span( element, dt_name, '', false );
		}
	}
	
	
	if ( $( '.required' ).find( 'input#mail_address' ).length ) {
		var element = $( '.required' ).find( 'input#mail_address' );
		var dt      = element.parents( 'dd' ).prev( 'dt' );
		var dt_name = slice_method( dt );
		if ( element.val() == '' ) {
			error_span( element, dt_name, '입력', true );
			error++;
			scroll_point = compare_method( scroll_point, element.offset().top );
		} else {
			if( ! ( element.val().match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/) ) ) {
				element.parents( 'dd' ).find( 'span' ).text( '正しい' + dt_name + 'の書式ではありません。' );
				error++;
				scroll_point = compare_method( scroll_point, element.offset().top );
			} else {
				error_span( element, dt_name, '', false );
			}
		}
	} else if ( $( 'input#mail_address' ).length ) {
		var element = $( 'input#mail_address' );
		var dt      = element.parents( 'dd' ).prev( 'dt' );
		var dt_name = slice_method( dt );
		if ( element.val() != '' ) {
			if( ! ( element.val().match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/) ) ) {
				element.parents( 'dd' ).find( 'span' ).text( '正しい' + dt_name + 'の書式ではありません。' );
				error++;
				scroll_point = compare_method( scroll_point, element.offset().top );
			} else {
				error_span( element, dt_name, '', false );
			}
		} else {
			error_span( element, dt_name, '', false );
		}
	}
	
	
	if ( $( '.required' ).find( 'input#mail_address_confirm' ).length ) {
		var element   = $( '.required' ).find( 'input#mail_address_confirm' );
		var element_2 = $( 'input#mail_address' );
		var dt        = element.parents( 'dd' ).prev( 'dt' );
		var dt_name   = slice_method( dt );
		if ( element.val() == '' ) {
			error_span( element, dt_name, '입력', true );
			error++;
			scroll_point = compare_method( scroll_point, element.offset().top );
		} else {
			if ( element.val() !== element_2.val() ) {
				element.parents( 'dd' ).find( 'span' ).text( dt_name + 'が一致しません。' );
				error++;
				scroll_point = compare_method( scroll_point, element.offset().top );
			} else {
				if ( ! ( element.val().match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/) ) ) {
					element.parents( 'dd' ).find( 'span' ).text( '正しい' + dt_name + 'の書式ではありません。' );
					error++;
					scroll_point = compare_method( scroll_point, element.offset().top );
				} else {
					error_span( element, dt_name, '', false );
				}
			}
		}
	} else if ( $( 'input#mail_address_confirm' ).length ) {
		var element   = $( 'input#mail_address_confirm' );
		var element_2 = $( 'input#mail_address' );
		var dt        = element.parents( 'dd' ).prev( 'dt' );
		var dt_name   = slice_method( dt );
		if ( element.val() != '' ) {
			if ( element.val() !== element_2.val() ) {
				element.parents( 'dd' ).find( 'span' ).text( dt_name + 'が一致しません。' );
				error++;
				scroll_point = compare_method( scroll_point, element.offset().top );
			} else {
				if ( ! ( element.val().match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/) ) ) {
					element.parents( 'dd' ).find( 'span' ).text( '正しい' + dt_name + 'の書式ではありません。' );
					error++;
					scroll_point = compare_method( scroll_point, element.offset().top );
				} else {
					error_span( element, dt_name, '', false );
				}
			}
		} else {
			error_span( element, dt_name, '', false );
		}
	}
	
	
	if ( $( '.required' ).find( 'input.gender' ).length ) {
		var gender_error = 0;
		var elements     = $( '.required' ).find( 'input.gender' );
		var dt           = elements.eq(0).parents( 'dd' ).prev( 'dt' );
		var dt_name      = slice_method( dt );
		
		for ( var i = 0; i < elements.length; i++ ) {
			if ( elements.eq(i).is( ':checked' ) == '' ) {
				gender_error++;
			}
		}
		
		if ( gender_error == elements.length ) {
			error_span( elements.eq(0), dt_name, '選択', true );
			error++;
			scroll_point = compare_method( scroll_point, elements.eq(0).offset().top );
		} else {
			error_span( elements.eq(0), dt_name, '', false );
		}
	}
	
	
	if ( $( '.required' ).find( 'input#postal' ).length ) {
		var element = $( '.required' ).find( 'input#postal' );
		var dt      = element.parents( 'dd' ).prev( 'dt' );
		var dt_name = slice_method( dt );
		if ( element.val() == '' ) {
			error_span( element, dt_name, '입력', true );
			error++;
			scroll_point = compare_method( scroll_point, element.offset().top );
		} else {
			error_span( element, dt_name, '', false );
		}
	}
	
	
	if ( $( '.required' ).find( 'input#address_1' ).length ) {
		var element = $( '.required' ).find( 'input#address_1' );
		var dt      = element.parents( 'dd' ).prev( 'dt' );
		var dt_name = slice_method( dt );
		if ( element.val() == '' ) {
			error_span( element, dt_name, '입력', true );
			error++;
			scroll_point = compare_method( scroll_point, element.offset().top );
		} else {
			error_span( element, dt_name, '', false );
		}
	}
	
	
	if ( $( '.required' ).find( 'input#phone' ).length ) {
		var element = $( '.required' ).find( 'input#phone' );
		var dt      = element.parents( 'dd' ).prev( 'dt' );
		var dt_name = slice_method( dt );
		if ( element.val() == '' ) {
			error_span( element, dt_name, '입력', true );
			error++;
			scroll_point = compare_method( scroll_point, element.offset().top );
		} else {
			error_span( element, dt_name, '', false );
		}
	}
	
	
	if ( $( '.required' ).find( 'input#schedule' ).length ) {
		var element = $( '.required' ).find( 'input#schedule' );
		var dt      = element.parents( 'dd' ).prev( 'dt' );
		var dt_name = slice_method( dt );
		if ( element.val() == '' ) {
			error_span( element, dt_name, '입력', true );
			error++;
			scroll_point = compare_method( scroll_point, element.offset().top );
		} else {
			error_span( element, dt_name, '', false );
		}
	}
	
	
	if ( $( '.required' ).find( 'select#product' ).length ) {
		var element = $( '.required' ).find( 'select#product' );
		var dt      = element.parents( 'dd' ).prev( 'dt' );
		var dt_name = slice_method( dt );
		if ( element.val() == '' ) {
			error_span( element, dt_name, '選択', true );
			error++;
			scroll_point = compare_method( scroll_point, element.offset().top );
		} else {
			error_span( element, dt_name, '', false );
		}
	}
	
	
	if ( $( '.required' ).find( 'input.kind' ).length ) {
		var kind_error = 0;
		var elements   = $( '.required' ).find( 'input.kind' );
		var dt         = elements.eq(0).parents( 'dd' ).prev( 'dt' );
		var dt_name    = slice_method( dt );
		
		for ( var i = 0; i < elements.length; i++ ) {
			if ( elements.eq(i).is( ':checked' ) == '' ) {
				kind_error++;
			}
		}
		
		if ( kind_error == elements.length ) {
			error_span( elements.eq(0), dt_name, '選択', true );
			error++;
			scroll_point = compare_method( scroll_point, elements.eq(0).offset().top );
		} else {
			error_span( elements.eq(0), dt_name, '', false );
		}
	}
	
	
	if ( $( '.required' ).find( 'textarea#mail_contents' ).length ) {
		var element = $( '.required' ).find( 'textarea#mail_contents' );
		var dt      = element.parents( 'dd' ).prev( 'dt' );
		var dt_name = slice_method( dt );
		if ( element.val() == '' ) {
			error_span( element, dt_name, '입력', true );
			error++;
			scroll_point = compare_method( scroll_point, element.offset().top );
		} else {
			error_span( element, dt_name, '', false );
		}
	}
	
	
	
	
	if ( error == 0 ) {
		if ( window.confirm( '送信してもよろしいですか？' ) ) {
			
			hidden_append( 'javascript_action', true );
			
			var now_url = encodeURI( document.URL );
			hidden_append( 'now_url', now_url );
			
			var before_url = encodeURI( document.referrer );
			hidden_append( 'before_url', before_url );
			
			hidden_append( 'writing_time', writing_time );
			
			
			var order_number = 0;
			for ( var i = 0; i < mailform_dt.length; i++ ) {
				
				if ( mailform_dt.eq(i).next( 'dd' ).find( 'input' ).length ) {
					var element = mailform_dt.eq(i).next( 'dd' ).find( 'input' );
					var dt      = element.eq(0).parents( 'dd' ).prev( 'dt' );
					var dt_name = slice_method( dt );
					
					if ( element.eq(0).attr( 'type' ) == 'radio' || element.eq(0).attr( 'type' ) == 'checkbox' ) {
						var list_error = 0;
						for ( var j = 0; j < element.length; j++ ) {
							if ( element.eq(j).is( ':checked' ) == '' ) {
								list_error++;
							}
						}
						
						if ( list_error != element.length ) {
							var attr_name = element.eq(0).attr( 'name' ).replace( /\[|\]/g, "" );
							order_number++;
							hidden_append( 'order_' + order_number, attr_name + ',' + dt_name );
						}
						
					} else {
						if ( element.eq(0).val() != '' ) {
							order_number++;
							hidden_append( 'order_' + order_number, element.eq(0).attr( 'name' ) + ',' + dt_name );
						}
						
					}
				}
				
				
				if ( mailform_dt.eq(i).next( 'dd' ).find( 'select' ).length ) {
					var element = mailform_dt.eq(i).next( 'dd' ).find( 'select' );
					var dt      = element.parents( 'dd' ).prev( 'dt' );
					var dt_name = slice_method( dt );
					if ( element.val() != '' ) {
						order_number++;
						hidden_append( 'order_' + order_number, element.attr( 'name' ) + ',' + dt_name );
					}
				}
				
				
				if ( mailform_dt.eq(i).next( 'dd' ).find( 'textarea' ).length ) {
					var element = mailform_dt.eq(i).next( 'dd' ).find( 'textarea' );
					var dt      = element.parents( 'dd' ).prev( 'dt' );
					var dt_name = slice_method( dt );
					if ( element.val() != '' ) {
						order_number++;
						hidden_append( 'order_' + order_number, element.attr( 'name' ) + ',' + dt_name );
					}
				}
				
			}
			
			hidden_append( 'order_count', order_number );
			
			return true;
		} else {
			return false;
		}
	} else {
		$( 'html, body' ).animate({
			scrollTop: scroll_point - 70
		}, 500);
		return false;
	}
	
}




(function( $ ) {
	
	for ( var i = 0; i < mailform_dt.length; i++ ) {
		if ( mailform_dt.eq(i).next( 'dd' ).attr( 'class' ) == 'required' ) {
			$( '<span/>' )
				.text( '필수' )
				.addClass( 'required' )
				.prependTo( $( mailform_dt.eq(i) ) );
			
			$( '<span/>' )
				.appendTo( mailform_dt.eq(i).next( 'dd' ) );
		} else {
			$( '<span/>' )
				.text( '어떤' )
				.addClass( 'optional' )
				.prependTo( $( mailform_dt.eq(i) ) );
			
			if ( mailform_dt.eq(i).next( 'dd' ).find( 'input#mail_address' ).length ) {
				$( '<span/>' )
				.appendTo( mailform_dt.eq(i).next( 'dd' ) );
			}
			
			if ( mailform_dt.eq(i).next( 'dd' ).find( 'input#mail_address_confirm' ).length ) {
				$( '<span/>' )
				.appendTo( mailform_dt.eq(i).next( 'dd' ) );
			}
		}
	}
	
	
	$( 'input' ).on( 'keydown', function( e ) {
		if ( ( e.which && e.which === 13 ) || ( e.keyCode && e.keyCode === 13 ) ) {
			return false;
		} else {
			return true;
		}
	});
	
	
	if ( $( 'textarea#mail_contents' ).length ) {
		$( 'textarea#mail_contents' )
			.focus(function() {
				start_time = new Date();
			})
			.blur(function() {
				stop_time = new Date();
				writing_time += Math.round( ( stop_time - start_time ) / 1000 );
			});
	}
	
	
	$( '#mail_submit_button' ).click( required_check );
	
})( jQuery );
