'use strict';

if (typeof Object.create !== 'function') {
	Object.create = function (obj) {
		function F() {}
		F.prototype = obj;
		return new F();
	};
}

(function ($, window, document, undefined) {

	var Slider = {
		init: function (options, elem) {

			var self = this;

			self.maxScrollPosition = 0;
			self.switcher = 0;   
			self.elem = elem;
			self.$elem = $ (elem);

			self.options = $.extend({}, $.fn.sliderGoods.options, options);

			self.calcConst();

			$(this.elem).find('.carousel__btn--prev').on('click', function (e) {
				e.preventDefault();
				var $targetItem = self.$elem.find('.carousel__item--edge').prev();

				self.toGalleryItem($targetItem);
			});

			$(this.elem).find('.carousel__btn--next').on('click', function (e) {
				e.preventDefault();
				var $targetItem = self.$elem.find('.carousel__item--edge').next();

				self.toGalleryItem($targetItem);
			});

		},

		calcConst: function () {
			var self = this,
			totalWidth = 0,
			totalHeigt = 0,

			category = $(this.elem).find('.category'),
			section = $(this.elem).outerWidth() - 95,
			contentWidth = section / this.options.caseLimit - this.options.spaceSection * 2;


			$(this.elem).find('.carousel__swither').width(section);

			$(this.elem).find('.carousel__item')
			.css({
				width:contentWidth + this.options.spaceSection * 2,
				'padding-left': this.options.spaceSection,
				'padding-right': this.options.spaceSection
			})
			.each(function() {
				totalWidth = totalWidth + $(this).outerWidth(true);
			});

			self.maxScrollPosition = totalWidth - $(this.elem).find('.carousel__swither').outerWidth();
			self.switcher = $(this.elem).find('.carousel__wrapper');

			self.switcher.width(totalWidth + 20);

			$(this.elem).find('.carousel__item:first').addClass('carousel__item--edge');

			if (this.options.autoHeight === 'true') {
				$(this.elem).find('.carousel__item').height(contentWidth);
				$(this.elem).find('.carousel__swither').height(totalHeigt + contentWidth);
				$(this.elem).height(totalHeigt + contentWidth + 40 );
			} else {
				$(this.elem).find('.carousel__item').height(this.options.autoHeight);
			}

		},

		toGalleryItem:  function ($targetItem) {
			var self = this;

			if($targetItem.length) {

				var newPosition = $targetItem.position().left;

				if(newPosition <= self.maxScrollPosition) {

					$targetItem.addClass('carousel__item--edge');
					$targetItem.siblings().removeClass('carousel__item--edge');

					self.switcher.animate({
						left : - newPosition
					});
				} else {
					self.switcher.animate({
						left : - self.maxScrollPosition
					});
				}
			}
		} 
	};

	$.fn.sliderGoods = function (options) {
		return this.each(function() {

			var slider = Object.create( Slider );
			slider.init( options, this );
		});
	};   

	$.fn.sliderGoods.options = {
        autoHeight: 'false', // высота всего слайдера
        caseLimit: 4, //кол-во элементов в витрине
        spaceSection: 15, //расстояние между секциями
    };


// =============begin SliderMain ==============



var SliderMain = {

	init: function (options, elem) {

		var self = this;
		self.elem = elem;
		self.ind = 0;
		self.ifBusy = 0;

		self.options = $.extend({}, $.fn.sliderMain.options, options);

		self.calcConst();

		var li = $(this.elem).find('li').hide();

		$(li[0]).show();

		$(this.elem).find('.slider__btn').on('click', function (e) {
			e.preventDefault();

			if(self.ifBusy) return;

			$(this).hasClass('slider__btn slider__btn--prev')
			? self.animation(li)
			: self.animation(li, true)
		});
	},

	calcConst: function () {
		var blur,
		self = this,
		blurString = '<div class="blur"><svg version="1.1" xmlns="http://www.w3.org/2000/svg"><filter id="blur"><feGaussianBlur stdDeviation="3" /></filter></svg></div>';

		$(this.elem).find('li').each(function(i) {
			if (self.options.blur) {$(blurString).appendTo(this)};

			$(this).css({
				'background-image' : 'url(../' + $(this).children('img').attr('src') + ')',
				'z-index' : 1
			});
		});

		if(self.options.auto) {
			setInterval(function() {
				$(self.elem).find('.slider__btn--next').trigger('click');
			}, self.options.auto)
		}
	},

	animation: function (elem, ind) {
		var self = this;
		self.ifBusy = 1;

		if (ind){
			self.ind++;
			self.ind = self.ind % $(elem).length;
		} else {
			self.ind--;
			if (self.ind < 0)  self.ind = $(elem).length - 1;
		}

		$(elem[self.ind]).fadeIn(self.options.anim, function() {
			$(this).siblings("li").hide();
			$(this).css('z-index', 1);
			self.ifBusy = 0;
		})
		.css('z-index', 2);
	}
};



$.fn.sliderMain = function (options) {
	return this.each(function() {

		var slider = Object.create( SliderMain );
		slider.init( options, this );
	});
};

$.fn.sliderMain.options = {
        blur: false, //заблюривание хедера
        auto: false, // автопрокрутка, мс
        anim: 2200 // время перехода
    };




// ===============	tabs begin ===============

$('.tabs__container').hide();
$('.tabs__1').show();

$('.tab').on('click', function( e ) {
	e.preventDefault();

	if($(this).hasClass('active')) return;

	var $this = $(this);

	$('.tab').removeClass('active');
	$('.tabs__container').hide();

	$this.addClass('active');
	$('.' + $this.data('tab')).fadeToggle(300);
});

// ===============	tabs end =================


(function($){

	// $('.navbar').addClass('navbar');
	// $('.categories-menu>ul').addClass('nav navbar-nav');

	var menuCell = $('.navbar>ul>li>ul').hide(),
	menuButton = $('.navbar>ul>li');

	menuButton.hover(function() {
		$(this).children('ul').show();
		$(this).addClass('active');
	},
	function() {
		$(this).children('ul').hide();
		$(this).removeClass('active');
	}
	);
	
})(jQuery);

var zoom = document.documentElement.clientWidth;
    $(window).resize(function() {
        var zoomNew = zoom / window.innerWidth;
        if( zoomNew < 0.91) {
           $('body').css({
                '-ms-zoom': 1,
                'zoom': 2.1 - zoomNew
                
            });
       } else {
           $('body').css('zoom', 1);
       }
    });

})( jQuery, window, document );


