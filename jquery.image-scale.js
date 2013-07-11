/**
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
	$.fn.imageScale = function(params) {
		var _matched_elements = this;

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

		parse_images(_matched_elements);
		if (params.rescale_after_resize) {
			$(window).resize(function() {
				parse_images(_matched_elements, true);
			});
		}

		function parse_images(images, skip_init) {
			images.each(function() {
				var image = $(this);
				if (params.parent_css_selector) {
					var parent = img.parents(params.parent_css_selector);
				}
				else {
					var parent = image.parent();
				}

				if (!skip_init) {
					parent.css({
						opacity: 0,
						overflow: 'hidden'
					});
				}

				if (parent.length) {
					image.bind('load', function() {
						scale_image(image, parent, params);
					});
					// Trigger load event for cache images.
					 var src = this.src;
					// Webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
					// Data uri bypasses webkit log warning (thx doug jones).
					this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
					this.src = src;
				}
			});
		}

		function scale_image(image, parent, params) {
			image.removeAttr('width').removeAttr('height');
			image.css({'width': 'auto', 'height': 'auto'});

			// Account for ancestors that are hidden to ensure we're getting
			// the correct sizes.
			var ancestor = image.get(0),
				hiddenAncestors = [];
			while (ancestor && ancestor.tagName != 'BODY') {
				if (ancestor.style.display == 'none') {
					hiddenAncestors.push(ancestor);
					ancestor.style.display = 'block';
				}
				ancestor = ancestor.parentNode;
			}

			var parent_width = parent.width(),
				parent_height = parent.height(),
				image_width = image.width(),
				image_height = image.height();

			resize_image();
			if (params.center) {
				reposition_image();
			}

			for (var i = 0; i < hiddenAncestors.length; i++) {
				hiddenAncestors[i].style.display = 'none';
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
				var new_width = image.width(),
					new_height = image.height();

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

		return this;
	}
})(jQuery);