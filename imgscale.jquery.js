/*
* Automatically scale images to fit or fill their parent container.
*
* Author: JP74, based on Kelly Meath's work (http://imgscale.kjmeath.com)
* Website: https://github.com/ecstaticpeon/jquery-image-scale
* Version: 1.0.0
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
(function($) {
	$.fn.imgscale = function(params) {
		params = $.extend({
			/**
			 * CSS selector used to get the image container against which the
			 * image size will be calculated.
			 *
			 * Default to the image's immediate parent.
			 */
			parent_css_selector: null,
			/**
			 * Set to 'fit' or 'fill'. When set to 'fit', the image will scale
			 * to fit inside it's parent container's bounds. When set to
			 * 'fill', the image will fill it's parent container's bounds.
			 */
			scale: 'fill',
			/**
			 * Boolean. The image will automatically center itself if the
			 * scale parameter is set to 'fill'. Set to false to disable this
			 * feature. 
			 */
			center: true,
			/**
			 * Time in milliseconds. When set, images that are not already
			 * cached by the browser will load hidden, then fade in. 0 to
			 * disable.
			 */
			fade_duration: 0,
			/**
			 * Boolean. Whether to rescale images when the browser is resized.
			 */
			rescale_after_resize: true
		}, params);

		// https://gist.github.com/527683
		var ie_version = (function() {
			var undef,
				v = 3,
				div = document.createElement('div'),
				all = div.getElementsByTagName('i');
			
			while (
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0]
			);
			
			return v > 4 ? v : undef;
		}());

		parse_images(this);
		if (params.rescale_after_resize) {
			$(window).resize(function() {
				parse_images(this);
			}.bind(this));
		}

		function parse_images(images) {
			images.each(function() {
				var image = $(this);
				if (params.parent_css_selector) {
					var parent = img.parents(params.parent_css_selector);
				}
				else {
					var parent = image.parent();
				}

				parent.css({
					opacity: 0,
					overflow: 'hidden'
				});

				if (parent.length) {
					if (image.get(0).complete) {
						scale_image(image, parent, params);
					}
					else {
						image.bind('load', function() {
							scale_image(image, parent, params);
						});
						if (ie_version == 9) {
							// IE 9 bug - the load event isn't triggered.
							image.attr('src', image.attr('src'));
						}
					}
				}
			});
		}

		function scale_image(image, parent, params) {
			image.removeAttr('width').removeAttr('height');
			image.css({'width': 'auto', 'height': 'auto'});

			var parent_height = parent.height();
			var parent_width = parent.width();
			var image_height = image.height();
			var image_width = image.width();

			resize_image();
			if (params.center) {
				reposition_image();
			}
			show_image();

			function resize_image() {
				if (parent_width / image_width > parent_height / image_height) {
					if (params.scale == 'fit') {
						image.css('height', parent_height);
					}
					else {
						image.css('width', parent_width);
					}
				}
				else {
					if (params.scale == 'fit') {
						image.css('width', parent_width);
					}
					else {
						image.css('height', parent_height);
					}
				}
			}

			function reposition_image() {
				var new_width = image.width();
				var new_height = image.height();

				image.css({'margin-left': 0, 'margin-top': 0});

				if (new_width > parent_width) {
					image.css(
						'margin-left',
						'-' + Math.floor((new_width - parent_width) / 2) + 'px'
					);
				}
				if (new_height > parent_height) {
					image.css(
						'margin-top',
						'-' + Math.floor((new_height - parent_height) / 2) + 'px'
					);
				}
			}

			function show_image() {
				if (params.fade_duration > 0 && !image.get(0).complete) {
					parent.animate({opacity: 1}, params.fade_duration);
				}
				else {
					parent.css('opacity', 1);
				}
			}
		}
	}
})(jQuery);