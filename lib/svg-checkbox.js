/* globals _, d3, jQuery */

'use strict';
(function () {
	const wrapperTpl = _.template('<div class="svg-checkbox-wrapper <%=wrapperClass%>"></div>');
	const normalTpl = _.template(`<svg width="<%=width%>" height="<%=height%>" class="svg-checkbox">
        <path d="M <%=(width / 7)%> <%=(height / 2)%> L <%=(width / 2.7)%> , <%=(height * 0.8)%> "
            class="svg-checkbox-line svg-checkbox-line svg-checkbox-line-animation-first">
        </path>
        <path d="M <%=(width / 2.5)%>, <%=(height * 0.8)%> L <%=(width * 6 / 7)%> , <%=(height / 4)%>"
            class="svg-checkbox-line svg-checkbox-line svg-checkbox-line-animation-second">
        </path>
    </svg>`);
	const disabledTpl = _.template(`<svg width="<%=width%>" height="<%=height%>" class="svg-checkbox">
        <path d="M 0 0 0 0 <%=width%> <%=height%>"
            class="svg-checkbox-line svg-checkbox-line svg-checkbox-line-animation-first">
        </path>
        <path d="M <%=width%> 0 <%=width%> 0 0 <%=height%>"
            class="svg-checkbox-line svg-checkbox-line svg-checkbox-line-animation-second">
        </path>
    </svg>`);
	(function ($) {
		$.fn.SvgCheckbox = function (options, callback) {
			const defaults = {
				height: 15,
				width: 15,
				speed: 0.1
			};

			var inputClass = $(this).attr('class');

			this.hide();
			this.each(function () {
				var $currentWrapper = $(this).parents('.svg-checkbox-wrapper');
				if ($currentWrapper.length) {
					$currentWrapper.find('svg.svg-checkbox').remove();
					$(this).unwrap();
				}
				if (!$(this).is(':disabled')) {
					$(this).wrap(wrapperTpl({
						wrapperClass: inputClass
					}));
					$(this).parent().append(normalTpl(defaults));
					return;
				}
				$(this).wrap(wrapperTpl({
					wrapperClass: (inputClass || '') + ' svg-checkbox-disabled'
				}));
				$(this).parent().append(disabledTpl(defaults));
			});
			$('.svg-checkbox-wrapper').each(function () {
				var $checkbox;
				$checkbox = $(this).find('input[type=checkbox]');
				if ($checkbox.is(':checked') && !$checkbox.is(':disabled')) {
					$(this).addClass('svg-checkbox-checked');
				}
				$(this).find('svg path').each(function () {
					var length = this.getTotalLength();
					$(this).css('strokeDasharray', length + ' ' + length);


					if ($checkbox.is(':checked') || $checkbox.is(':disabled')) {
						$(this).removeClass('mute-animation');
					} else {
						$(this).addClass('mute-animation');
						$(this).css('strokeDashoffset', length);
					}
				});
			});
			$('.svg-checkbox-wrapper').click(function () {
				var $checkbox;
				$checkbox = $(this).find('input[type=checkbox]');

				if ($checkbox.is(':disabled')) {
					return;
				}
				if (!$checkbox.is(':checked')) {
					$(this).addClass('svg-checkbox-checked');
				} else {
					$(this).removeClass('svg-checkbox-checked');
				}

				$(this).find('svg path').each(function () {
					var length = this.getTotalLength();
					if ($checkbox.is(':checked')) {
						$(this).css('strokeDashoffset', length);
						$(this).addClass('mute-animation');
					} else {
						$(this).addClass('mute-animation');
						$(this).css('strokeDashoffset', length);
						$(this).removeClass('mute-animation');
						$(this).css('strokeDashoffset', 0);
					}
				});
				$checkbox.prop('checked', !$checkbox.is(':checked')).change();
			});
		};
	})(jQuery);
}).call(this);
