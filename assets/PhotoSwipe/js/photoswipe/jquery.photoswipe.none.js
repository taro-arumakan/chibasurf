/*! jQuery PhotoSwipe Wrapper
 * Copyright (c) 2015 Watanabe Takashi URL:http://www.free-jquery.com/
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */
;(function($){
    $.fn.swipePhoto = function(options){
        var $this = $(this),
            $target = $this.is('a') ? $this : $('a',$this),
            images = {},
            uidkey = "data-pswp-uid",
            defaults = {
                barsSize: {top: 0, bottom: 'auto'},
                bgOpacity: 0.85,
                captionArea: true,
                shareButton: false,
                fullScreenButton: false,
                zoonButton: false,
                preloaderButton: false,
                topToClose: true,
                tapToToggleControls: true,
                showAnimationDuration: 200
            };
            options = $.extend(defaults,options);
        var init = function(){
            var open = function(id,$targetLink){
                var pswpElement = $('.pswp')[0],
                    gallery,
                    datas,
                    thumbnails = parseThumbnails($targetLink),
                    items = thumbnails.items,
                    index = thumbnails.index;
                datas = {
                    galleryUID: $targetLink.attr('data-pswp-uid'),
                    getThumbBoundsFn: function(index){
                        var $thumbnail = $('img',items[index].el),
                            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                            rect = $thumbnail[0].getBoundingClientRect();
                        return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
                    },
			        addCaptionHTMLFn: function(item, captionEl, isFake) {
						if(!item.title) {
							captionEl.children[0].innerText = '';
							return false;
						}
						captionEl.children[0].innerHTML = item.title +  '<br/><small>Photo: ' + item.author + '</small>';
						return true;
			        },
                    captionEl: options.captionArea,
                    shareEl: options.shareButton,
                    fullscreenEl: options.fullScreenButton,
                    zoomEl: options.zoomButton,
                    bgOpacity: options.bgOpacity,
                    preloaderEl: options.preloaderButton,
                    topToClose: options.topToClose,
                    tapToToggleControls: options.tapToToggleControls,
                    barsSize: options.barsSize,
                    showAnimationDuration: options.showAnimationDuration,
                    'index':index
                };

                gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, datas);
                var realViewportWidth,
				    useLargeImages = false,
				    firstResize = true,
				    imageSrcWillChange;
				gallery.listen('beforeResize', function() {
					var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
					dpiRatio = Math.min(dpiRatio, 2.5);
				    realViewportWidth = gallery.viewportSize.x * dpiRatio;

				    if(realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200 ) {
				    	if(!useLargeImages) {
				    		useLargeImages = true;
				        	imageSrcWillChange = true;
				    	}
				    } else {
				    	if(useLargeImages) {
				    		useLargeImages = false;
				        	imageSrcWillChange = true;
				    	}
				    }

				    if(imageSrcWillChange && !firstResize) {
				        gallery.invalidateCurrItems();
				    }

				    if(firstResize) {
				        firstResize = false;
				    }

				    imageSrcWillChange = false;

				});

                gallery.init();
            },
            closest = function closest(el, fn) {
                return el && ( fn(el) ? el : closest(el.parentNode, fn) );
            },
            getImage = function(src){
                return images[src];
            },
            getTargetPhotos = function($targetLink){
                var rel = $targetLink.attr('rel');
                if( ! rel ){
                    return [$targetLink];
                }
                var photos = [];
                $target.each(function(){
                    if( $(this).is('[rel="'+rel +'"]') ){
                        photos.push($(this));
                    }
                });
                return photos;
            },
            parseThumbnails = function($targetLink){
                var photos = getTargetPhotos($targetLink),max = photos.length,items = [],item,index = -1;
                for(var i = 0 ; i < max ; ++i){
                    var $photo = photos[i],photoSrc = $photo.attr('href'),img = getImage(photoSrc);
                    if( $photo.attr(uidkey) === $targetLink.attr(uidkey) ){
                        index = i;
                    }
                    item = {
                        src: photoSrc,
                        w: img.width,
                        h: img.height,
                        author: $photo.attr('data-author'),
                        title: $photo.attr('title'),
                        msrc: $('img',$photo).attr('src')
                    };
                    
                    item.el = $photo;
                    item.o = {
                        src: item.src,
                        w: item.w,
                        h: item.h
                    };
                    items.push(item);
                }
                return { 'items': items, 'index': index};
            },setuid = function(){
                var uid = 1;
                $target.each(function(){
                    if( $(this).is('a') ){
                        $(this).attr(uidkey,uid);
                        var imgSrc = $(this).attr('href');
                        if( ! ( imgSrc in images )  ){
                            var img = new Image();
                            img.src = imgSrc;
                            images[imgSrc] = img;
                        }
                        ++uid;
                    }
                });
            };
            setuid();
            $target.on('click',function(){
               var $click = $(this), uid = $click.attr(uidkey);
               open(uid,$click);
               return false;
            });
        };
        init();
    }
    $(function(){
        var pswptag = '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--share" title="Share"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div> </div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>';
        if( $('.pswp').length===  0 ){
            $('body').append(pswptag);
        }
    });
})(jQuery);
