jQuery(function($) {
	function tempUpdates(context) {
		var $context = $(context);

		$context.find('.section').each(function() {
			$(this).children().not('.section-header').wrapAll('<div class="section-content" />');
		});

    $context.find('.engagement-overview').each(function() {
      var $con = $(this);
      var $newCon = $('<div class="engagement-info" />').insertBefore($con);
      var engagementMoment = moment($con.find('.engagement-date .val').text());
      var status = $con.find('.status .val').text();
      var statusKey = 'status-' + status.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
      var assigneeName = $con.find('.AssignedTo .val').text().length ? $con.find('.AssignedTo .val').text() : 'Unassigned';

      //status chain
      // Draft/Active => Feedback Started => Ready for Review => Completed

      $('<div class="engagement-info-details" />')
        .append($('<div class="engagement-name" />').text($con.find('.name .val').text()).appendTo($newCon))
        .append(
          $('<div class="engagement-datetime" />')
            .append($('<div class="engagement-date" />').text(engagementMoment.format('dddd, MMMM Do, YYYY')))
            .append(
              $('<div class="engagement-time" />')
                .append($('<span class="engagement-time-start" />').text($con.find('.Start.Time .val').text()))
                .append('<span class="engagement-time-sep">-</span>')
                .append($('<span class="engagement-time-end" />').text($con.find('.End.Time .val').text()))
            )
        )
        .append(
          $('<div class="engagement-state" />')
            .append(
              $('<div class="engagement-assignee" />')
                .append('<span class="engagement-assignee-label">Assigned to</span>')
                .append($('<span class="engagement-assignee-name" />').text(assigneeName))
            )
            .append(
              $('<div class="engagement-status">').addClass(statusKey)
                .append('<span class="engagement-status-label">Status</span>')
                .append($('<span class="engagement-status-text" />').text(status))
            )
        )
        .appendTo($newCon);
      $('<div class="engagement-location" />')
        .append('<div class="engagement-map"><img src="https://maps.googleapis.com/maps/api/staticmap?center=40.718217,-73.998284&zoom=13&size=300x150&maptype=roadmap&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=AIzaSyB4RCfgHYDHFY9WHnl6Ofup5s7pca92EXs" /></div>')
        .append(
          $('<div class="engagement-address" />')
            .append($('<div class="address-name" />').text($con.find('.engagement-site-name').text()))
            .append(
              $('<div class="address-lines" />')
                .append($('<div class="address-line" />').text($con.find('.engagement-site-address-line').text()))
            )
            .append(
              $('<div class="address-area" />')
                .append($('<span class="address-city" />').text($con.find('.engagement-site-city').text()))
                .append($('<span class="address-region" />').text($con.find('.engagement-site-state').text()))
                .append($('<span class="address-postal-code" />').text($con.find('.engagement-site-zip').text()))
            )
        )
        .appendTo($newCon);

      //$('<div class="" />').text($con.find('').text()).appendTo($newCon);
    });

    $context.find('.header-actions').insertAfter($context.find('.engagement-info'));
    $context.find('.permanent-messages').insertAfter($context.find('.engagement-info'));

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
					.append('<span class="metric-value-bar"><span class="metric-value-bar-progress" style="width: ' + percent + '%;" /></span>');
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

		var $pictures = $context.find('.photo-metric .picture img');
		var pictureHtml = $.map($pictures.slice(0, 4), function(el, idx) {
			var imageStyle = 'style="background-image: url(' + el.src + ');"';
			return '<div class="image-manager-preview-item"><div class="image-manager-preview-media" ' + imageStyle + ' /></div>';
		}).join('');

		$([
			'<div class="section media">',
				'<div class="section-header">Media</div>',
				'<div class="section-content">',
					'<div class="image-manager">',
						'<div class="image-manager-heading">Pictures<span class="image-manager-count">' + $pictures.length + '</span></div>',
						'<div class="image-manager-preview">',
							pictureHtml,
						'</div>',
						'<div class="image-manager-actions">',
							'<a class="download-all btn" href="#">Download All<span class="image-manager-size">30 MB</span></a>',
						'</div>',
					'</div>',
				'</div>',
			'</div>'
			].join(''))
			.insertBefore($context.find('.section.goals'));

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