jQuery(function($) {

    //These pull in the standard dashboard functionality that will be needed.
    //=include config/dashboard/dashboard--main-config.js
    //=include config/dashboard/dashboard--numeric-renderer.js

    //TODO implement rendering functions
    function exampleRendering1($section, data) {
        //TODO render the stuff.
        /* If you need to get some highcharts options for certain charts, you can use defaultOptions.chart_type.
           It's included in main-config.js */
    }

    /**
     * This is the standard function that will be called when data is loaded for a section.
     *
     * @param $section The section we are rendering.
     * @param collectionName The collection name for the section.
     * @param chartData The data returned for the section.
     */
    function populateSection($section, collectionName, chartData) {
        switch (collectionName) {
            case "collection1":
                //TODO Render Something
                break;
            default:
                break;
        }
    }

});