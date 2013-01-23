jquery-image-scale
==================

Automatically scales images to fit or fill their parent container.

### Usage

HTML

    <div>
    	<img src="lolcat.png" alt="" title="">
    </div>

JavaScript

    $(document).ready(function() {
        $('img').imgscale();
    }

### Options

**parent_css_selector (string)**

CSS selector used to get the image container against which the image size will be calculated.

**scale (string)**

'fit' or 'fill'. When set to 'fit', the image will scale to fit inside it's
parent container's bounds. When set to 'fill', the image will fill it's parent
container's bounds. Defaults to 'fill'.

**center (boolean)**

The image will automatically center itself if the scale parameter is set to 'fill'. Set to false to disable this feature. Defaults to true.

**fade_duration (integer)**

When set, images that are not already cached by the browser will load hidden, then fade in. 0 to disable. Defaults to 0.

**rescale_after_resize (boolean)**

Whether to rescale images when the browser is resized. Defaults to true.

    $('img').imgscale({
        parent_css_selector: null, // Defaults to the image's immediate parent.
        scale: 'fill',
        center: true,
        fade_duration: 0, // Fading is disabled if set to 0.
        rescale_after_resize: true
    });

### Credits

This plugin is based on [Kelly Meath's work](http://imgscale.kjmeath.com/).

It also uses James Padolsey's
[clever snippet to detect Internet Explorer's version](https://gist.github.com/527683).