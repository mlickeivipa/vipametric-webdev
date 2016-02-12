jQuery(function ($) {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function tempUpdates(context) {
        var $context = $(context);

        var surveys = [
            {
                name: "Pre-Event Survey",
                slug: "pre-event-survey",
                link: '/demo/survey',
                csv: '/_resources/dyn/files/35859z271659/_fn/metric-data.csv'
            },
            {
                name: "RSVP",
                slug: "rsvp",
                link: '/demo/survey',
                csv: '/_resources/dyn/files/35859z271659/_fn/metric-data.csv'
            },
            {
                name: "In-Market Survey",
                slug: "in-market-survey",
                link: '/demo/survey',
                csv: '/_resources/dyn/files/36190zc82a7590/_fn/Malibu-Survey-Data.csv'
            },
            {
                name: "Post Event Survey",
                slug: "post-event-survey",
                link: '/demo/survey',
                csv: '/_resources/dyn/files/35859z271659/_fn/metric-data.csv'
            }
        ];
        var surveyHtml = $.map(surveys, function (el, idx) {
            return [
                '<div class="survey-item '+ el.slug + '">',
                '<div class="survey-item-header">',
                '<a href="' + el.link + '" class="survey-item-name" title="Go to external survey">' + el.name + '</a>',
                '</div>',
                '<div class="survey-item-info">',
                '<div class="survey-item-data">',
                '<span class="survey-item-data-count">' + getRandomInt(50, 150) + '</span>',
                '<span class="survey-item-data-text">Entries</span>',
                '<span class="survey-item-actions">',
                '<a class="btn btn-glyph-only btn-xsmall btn-download" href="' + el.csv + '" title="Download Data"><span class="btn-text">Download Data</span></a>',
                '</span>',
                '</div>',
                '</div>',
                '</div>'
            ].join('');
        }).join('');

        $([
            '<div class="section surveys">',
            '<div class="section-header">Surveys</div>',
            '<div class="section-content">',
            '<div class="survey-items">',
            surveyHtml,
            '</div>',
            '</div>',
            '</div>'
        ].join(''))
            .prependTo($context.find('.primary-content'));

        var leads = [
            {
                name: "Emails",
                css: 'lead-email',
                csv: '/somefile.csv'
            },
            {
                name: "Phone Numbers",
                css: 'lead-phone',
                csv: '/somefile.csv'
            },
            {
                name: "Social Accounts",
                css: 'lead-social',
                csv: '/somefile.csv'
            },
            {
                name: "Addresses",
                css: 'lead-address',
                csv: '/somefile.csv'
            }
        ];

        var leadHtml = $.map(leads, function (el, idx) {
            return [
                '<div class="lead ' + el.css + '">',
                '<div class="lead-title">' + el.name + '</div>',
                '<div class="lead-count">' + getRandomInt(100, 250) + '</div>',
                '<a class="btn btn-glyph-only btn-xsmall btn-download" href="/_resources/dyn/files/35859z271659/_fn/metric-data.csv"  title="Download Data"><span class="btn-text">Download</span></a>',
                '</div>'
            ].join('');
        }).join('');

        $([
            '<div class="section leads">',
            '<div class="section-header">Leads</div>',
            '<div class="section-content">',
            '<div class="lead-summary">',
            leadHtml,
            '</div>',
            '</div>',
            '</div>'
        ].join(''))
            .insertBefore($context.find('.section.goals'));

        editSurveyData();
    }

    function editSurveyData() {
        var $engagementCont = $('.view-engagement'),
            $engagementName = $engagementCont.find('.engagement-name'),
            $preEventSurveyCon = $('.pre-event-survey'),
            $rsvpSurveyCon = $('.rsvp'),
            $inMarketSurveyCon = $('.in-market-survey'),
            $postEventSurveyCon = $('.post-event-survey'),
            $leadEmailCon = $('.lead-email'),
            $leadPhoneCon = $('.lead-phone'),
            $leadSocialCon = $('.lead-social'),
            $leadAddressCon = $('.lead-address'),
            $mediaManager = $(".section.media");

        if ($engagementName.text() == 'Malibu Example') {

            function editMediaManager() {
                var $videoManager = $mediaManager.find(".video-manager");
                var $videoManagerPreviewer = $videoManager.find("> .media-manager-previewer");
                var pictureData = [
                    {
                        src: '/_resources/dyn/files/27471za2b9e4b6/_fn/IMG_3367.JPG'
                    },
                    {
                        src: '/_resources/dyn/files/27489z2bfa704b/_fn/IMG_3368.JPG'
                    }
                ];
                var pictureHtml = $.map(pictureData, function (el, idx) {
                    var imageStyle = 'style="background-image: url(' + el.src + ');"';
                    return '<div class="media-manager-preview"><div class="media-manager-preview-render" ' + imageStyle + ' /></div>';
                }).join('');



                $videoManager.addClass("malibu");

                $('<div class="circle"></div>').insertBefore($videoManagerPreviewer);
                $videoManagerPreviewer.empty().append(pictureHtml);
            }

            function resetSurveyCounts() {
                var $preEventSurveyCount = $preEventSurveyCon.find(".survey-item-data-count"),
                    $rsvpSurveyCount = $rsvpSurveyCon.find(".survey-item-data-count"),
                    $inMarketSurveyCount = $inMarketSurveyCon.find(".survey-item-data-count"),
                    $externalSurveyCount = $postEventSurveyCon.find(".survey-item-data-count");

                $preEventSurveyCount.html('243');
                $rsvpSurveyCount.html('602');
                $inMarketSurveyCount.html('237');
                $externalSurveyCount.html('487');
            }

            function resetLeadCounts() {
                var $leadEmailCount = $leadEmailCon.find(".lead-count"),
                    $leadPhoneCount = $leadPhoneCon.find(".lead-count"),
                    $leadSocialCount = $leadSocialCon.find(".lead-count"),
                    $leadAddressCount = $leadAddressCon.find(".lead-count");

                $leadEmailCount.html('620');
                $leadPhoneCount.html('503');
                $leadSocialCount.html('254');
                $leadAddressCount.html('487');
            }

            function changeSurvey($con, name) {
                var $surveyHeader= $con.find(".survey-item-header"),
                    $surveyHeaderName = $('<div class="survey-item-name">' + name + '</div>'),
                    $surveyActions = $con.find(".survey-item-actions");

                if (name == "In-Market Survey") {
                    $surveyHeader.find("a").attr("href", "/demo2/survey");
                }
                else {
                    //Remove Link from post-event survey name
                    $surveyHeader.html($surveyHeaderName);
                }
                //Append extra action buttons to post-event survey
                $surveyActions
                    .append($('<a class="btn btn-glyph-only btn-xsmall btn-results" href="/demo2/survey/results" title="View Results"><span class="btn-text">View Results</span></a>'))
                    .append($('<a class="btn btn-glyph-only btn-xsmall btn-edit" href="#" title="Manage Results"><span class="btn-text">Manage Results</span></a>'));
            }


            resetSurveyCounts();
            resetLeadCounts();
            changeSurvey($preEventSurveyCon, "Pre-Event Survey");
            changeSurvey($rsvpSurveyCon, "RSVP");
            changeSurvey($inMarketSurveyCon, "In-Market Survey");
            changeSurvey($postEventSurveyCon, "Post Event Survey");
        }
    }

    $('.miwt-form').each(function () {
        var form = this;

        if (!form.submit_options) {
            form.submit_options = {};
        }

        var oldPostUpdate = form.submit_options.postUpdate ? form.submit_options.postUpdate : $.noop;

        form.submit_options.postUpdate = function () {
            oldPostUpdate();
            tempUpdates(form);
        };

        tempUpdates(form);
    });
});