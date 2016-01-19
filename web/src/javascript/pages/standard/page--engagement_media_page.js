jQuery(function($){
    var $metricCon = $(".metric-media-entities");

    $metricCon.each(function(idx, metricCon){
        var $metrics = $(metricCon).find(".metric-media-file");

        $metrics.each(function(idx, metric) {
            var $metric = $(metric);

            function getMediaData() {
                return {
                    fileSize: $metric.data('filesize'),
                    fileName: $metric.data('filename'),
                    filePath: $metric.data('filepath'),
                    fileCreateTime: $metric.data('filecreatetime')
                };
            }

            function renderMediaHTML(data){
                var $metricHtml = $('<div class="metric-wrap"></div>');
                var $imgHtml = $('<div class="metric-image" style="background-image: url(' + data.filePath + ')"></div>');
                var $fileInfoHtml = $('<div class="metric-info">' +
                    '<div class="filename">' + data.fileName + '</div>' +
                    '<div class="filesize">' + data.fileSize + '</div>' +
                    '<div class="filecreatetime">' + data.fileCreateTime + '</div>' +
                    '</div>');
                $metricHtml.append($imgHtml);
                $metricHtml.append($fileInfoHtml);

                $metric.prepend($metricHtml);
            }


            var data = getMediaData(metric);
            renderMediaHTML(data);
        });

    });


});