jQuery(function($) {
	function tempUpdates(context) {
		var $context = $(context);



		$context.find('.sub-section-header').each(function(idx) {
			var $con = $(this);

			var heading = document.createElement('span');
			heading.classList.add('sub-section-heading');
			heading.appendChild(document.createTextNode(this.childNodes[0].nodeValue));
			this.replaceChild(heading, this.childNodes[0]);

			$con.find('.metric-set-value-count').prependTo($con).each(function(){
				var text = $(this).text();
				var matches = text.match(/.*(\d+)\s+of\s+(\d+).*/);
				var count = parseInt(matches[1]);
				var total = parseInt(matches[2]);
				var percent = Math.floor((count / total) * 100);

				if (percent == 100) {
					$(this).closest('.sub-section').addClass('sub-section-complete');
				}

				$(this)
					.empty()
					.append('<span class="metric-value-bar"><span class="metric-value-bar-progress" style="width: ' + percent + '%;" /></span><span class="metric-value-percent">' + percent + '</span>');
			});
		});

		$context.find('.photo-metric').each(function() {
			var $con = $(this);
			var $ep = $con.find('.event-pictures');

			$ep.removeClass('prop-wrapper prop-gen');

			$con.find('.prop-header-actions .actions').insertAfter($con.find('> .label-component')).addClass('metric-container-actions');
			$con.find('.prop-header').remove();
			//$con.find('.prop-footer-actions .actions').appendTo($con);
			$con.find('.prop-footer').remove();

			$con.find('> .label-component, .persistence-actions').wrapAll('<div class="metric-container-header" />');
			$con.find('.label-component').removeClass('label-component').addClass('metric-container-heading');

			$con.find('.message-container').insertAfter($con.find('.metric-container-header'));

			$con.find('.value-component').removeClass('value-component').addClass('metric-container-content');

			if ($ep.hasClass('prop-viewer')) {
				$ep.removeClass('prop-viewer').addClass('event-pictures-viewer');
			}

			if ($ep.hasClass('prop-editor')) {
				$ep.removeClass('prop-editor').addClass('event-pictures-editor');
				$con.find('.prop-group.default-group .props > div').appendTo($ep).addClass('picture-upload');
			}

			$con.find('.col-photos .props').appendTo($ep).removeClass('props').addClass('picture-list');
			$con.find('.picture-list > div').addClass('picture');
			//image needs to be scaled to 130 px tall while keeping aspect ratio

			$con.find('.prop-body').remove();

			$con.find('.picture .select-for-download input[type=checkbox]')
				.on('click', function(evt) {
					evt.stopPropagation();
				}).on('change', function() {
					$(this).closest('.picture').toggleClass('picture-selected', $(this).prop('checked'));
				});
			$con.find('.picture').on('click', function() {
				var $cb = $(this).find('input[type=checkbox]');
				$cb.prop('checked', !$cb.prop('checked'));
				$cb.trigger('change');
			});

		});
	}

	$('.miwt-form').each(function() {
		var form = this;

		if (!form.submit_options) {
			form.submit_options = {};
		}

		var oldPostUpdate = form.submit_options.postUpdate ? form.submit_options.postUpdate : $.noop;

		form.submit_options.postUpdate = function() {
			oldPostUpdate();
			tempUpdates(form);
		};

		tempUpdates(form);
	});
});