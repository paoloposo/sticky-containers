
/**
 * @author Paolo Poso (paolo@paoloposo.de)
 * 
 * @license MIT
 * 
 * @url https://github.com/paoloposo/sticky-containers
 */


(function ($) {
	
    $.fn.sticky_containers = function( options ) {
    	
    	$this = $(this);
    	
    	// Extend passed options with defaults.
    	var options = $.extend($.fn.sticky_containers.defaults, options);
    	
    	// Check if sticky containers is already active on this row.
    	if ($this.hasClass(options.parent_class)) {
    		// If so, just recalc sticky kit.
    		return $this.trigger('sticky_container:recalc');
    	}
    	
    	// Mark this row as active.
    	$this.toggleClass(options.parent_class, true);

    	// Find all containers that should be made sticky.
        var containers = $this.find(options.container_selector);
        if (containers.length == 0) { return $this; }
        
        // Call the actual sticky kit on all found containers.
        //
        // Sticky kit options that have been passed to sticky containers will
        // be forwarded, except for 'parent', which is set to the container.
        containers.stick_in_parent({
        	inner_scrolling: options.inner_scrolling,
        	sticky_class: options.sticky_class,
        	offset_top: options.offset_top,
        	spacer: options.spacer,
        	bottoming: options.bottoming,
        	recalc_every: options.recalc_every,
        	parent: $this,
        });
        
        // Make all columns in this row the same height, if specified.
        if (options.fix_height) {
        	
        	var columns = $this.children(options.column_selector);
        	
        	// Sort columns from tallest to shortest.
        	var columns_sorted = columns.sort(function (a, b) {
        		return $(b).height() - $(a).height();
        	});
        	
        	// Apply the height of the tallest column to all others as well.
        	var tallest_height = $(columns_sorted[0]).height();
        	columns.height(tallest_height);
        }
        
        // Make the row listen to the sticky_containers:detach event.
        $this.on('sticky_containers:detach', function() {
        	var $this = $(this);
        	
        	// Remove sticky kit from all sticky containers.
        	$this.find(options.container_selector).trigger('sticky_kit:detach');
        	
        	// If specified to fix column height, revert that.
        	$this.children(options.column_selector).height(options.fix_height ? 'auto' : null);
        	
        	// Mark row as inactive.
        	$this.toggleClass(options.parent_class, false)
        	
        	// Remove all related event listeners.
        	.off('sticky_containers:detach');
        });
        
        // Forward recalc events to sticky kit.
        $this.on('sticky_containers:recalc', function () {
        	return $(this).find(options.container_selector).trigger('sticky_kit:recalc');
        });
        
        // Fluent interface.
        return $this;
    };
    
    // Default options for sticky containers.
    //
    // NOTE: Options for the original sticky kit are not included here,
    // but can be passed as well. They will be forwarded (except for the
    // 'parent' option).
    $.fn.sticky_containers.defaults = {
    	container_selector: '[data-sticky=true]',
    	column_selector: '[class^="col-"], [class*=" col-"]',
    	fix_height: true,
    	parent_class: 'sticky-containers',
    }
    
}(jQuery));
