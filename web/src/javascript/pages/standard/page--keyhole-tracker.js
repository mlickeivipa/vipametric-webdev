jQuery(function($) {
    var $socialContainer;

    var API_KEY = 'a417ee49d987911d',
        TRACKER = 'vv8Vqk',
        API_URL = 'http://api.keyhole.co/1.1/get';

    var pollCount = 0;

    function pollForSocial() {
        setTimeout(function(){
            if ($(".social-analytics").length || pollCount > 500) {
                $socialContainer = $(".social-analytics");
                getData();
            }
            else {
                pollForSocial();
            }
        },50);
        pollCount++;
    }

    function aggregateCounts(data) {
        var $counts = {};

        var instagramData = data.results.instagram;
        var twitterData = data.results.twitter;

        $counts.posts = parseNum(instagramData.total_tweets + twitterData.total_tweets);
        $counts.users = parseNum(instagramData.total_tweeters + twitterData.total_tweeters);
        $counts.reach = parseNum(instagramData.total_reach + twitterData.total_reach);
        $counts.impressions = parseNum(instagramData.total_impressions + twitterData.total_impressions);

        displayCounts($counts);
    }

    function displayCounts(obj) {
        var $counts = obj;

        $.each($counts, function(key, value){
            var $value = $("<div />").addClass("value").text(value);
            var $wrap = $('<div class="social-category"><div class="title">' + key + '</div>');
            $wrap.prepend($value);
            $socialContainer.append($wrap);
        });
    }

    function parseNum(num)
    {
        num += '';
        x = num.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    function getData() {
        $.ajax(API_URL, {
            crossDomain: true,
            dataType: "json",
            data: {
                access_token: API_KEY,
                track: TRACKER,
                type: "timeline",
                range: 30
            },
            success: function(data) {
                aggregateCounts(data);
            }
        });
    }

    pollForSocial();
});