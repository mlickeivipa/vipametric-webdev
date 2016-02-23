jQuery(function($) {
	var CSS_CLASS_SELECT_INIT = 'select2-init';

	var DEFAULT_SELECT_OPTIONS = {
		theme: 'vm',
		minimumResultsForSearch: 10
	};

	function destroySelectUpdates(context) {
		var $con = $(context || document);

		if (!$con.hasClass(CSS_CLASS_SELECT_INIT)) {
			$con = $con.find('select').filter('.' + CSS_CLASS_SELECT_INIT);
		}

		if ($con.length) {
			$con.removeClass(CSS_CLASS_SELECT_INIT).select2('destroy');
		}
	}

	function initSelectUpdates(context) {
		var $con = $(context || document);

		if (!$con.is('select')) {
			$con = $con.find('select');
		}

		if ($con.length && !($con.closest('.cke_dialog').length || $con.closest('tr[data-dnd-source-def]').length)) {
			$con.each(function(idx, select){
				var $sel = $(select);
				if ($sel.hasClass("multi-selection-constraint")) {
					$sel
						.select2({theme: 'vm-multi', tags: true, multiple: true, placeholder: 'Select'})
						.addClass(CSS_CLASS_SELECT_INIT)
						.filter('[data-features~="watch"]')
						.on('change', miwt.observerFormSubmit);
				}
				else {
					$sel
						.select2(DEFAULT_SELECT_OPTIONS)
						.addClass(CSS_CLASS_SELECT_INIT)
						.filter('[data-features~="watch"]')
						.on('change', miwt.observerFormSubmit);
				}
			});
		}
	}

	$('.vipametric .miwt-form').each(function() {
		var form = this;

		form.submit_options = {
			preProcessNode: function(data) {
				destroySelectUpdates(document.getElementById(data.refid));
				return data.content;
			},
			postProcessNode: function(data) {
				$.each(data, function(idx, d) {
					initSelectUpdates(d.node);
				});
			}
		};

		initSelectUpdates(form);
	});
});