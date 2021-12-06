var data;
var selector = d3.select('#selDataset');

var sample_names = [];
const file = 'samples.json';

function init() {  
    d3.json(file).then((json_data) => {  
         data = json_data;
         console.log("init():", data);
         sample_names = data.names;

         sample_names.forEach((sample) => { 
             selector
             .append("option")        
             .text(sample)        
             .property("value", sample);   
    });

    var sample_id = sample_names[0];
    buildCharts(sample_id);
    buildDemographicInfo(sample_id);

    });
};

function optionChanged(sample_id) {
    buildCharts(sample_id);
    buildDemographicInfo(sample_id);
};

function buildCharts(sample_id) {
    info_data = data.metadata;
    console.log('buildDemographicInfo():', sample_id);
    var sample_metadata = d3.select('#sample_metadata');
    sample_metadata.selectAll('p').remove();

    info_data.forEach(row => {
        if (row.id === parseInt(sample_id)) {
             Object.entries(row).forEach(([key, value]) => {
                  sample_metadata.append("p").text(key + ": " + value);
             })
        }
    })
};

function buildCharts(sample_id) {
    var sample = data.samples.filter(sample => sample.id === sample_id)[0];
    var cut = sample.sample_values.length;
    if (cut > 10) {
        cut = 10;
    }
    var barChart = [{
        x: sample.sample_values.slice(0, cut).reverse(),
        y: sample.otu_ids.slice(0, cut).map(id => "otu " + id).reverse(),
        text: sample.otu_labels.slice(0, cut).reverse(),
        type: 'bar',
        orientation: 'h'
    }];

    var barLayout = {
        title: 'Top 10 OTUs from Sample',
        margin: {
            l: 75,
            r: 75,
            t: 75,
            b: 50
        } 
    };

    Plotly.newPlot('bar', barChart, barLayout)

    var bubblePlot = [{
        x: sample.sample_values,
        y: sample.otu_ids,
        text: sample.otu_labels.slice(0, cut).reverse(),
        mode: 'markers',
        marker: {
            color: sample.otu_ids,
            size: sample.sample_values
        }
    }];

    var bubbleLayout = {
        title: 'OTU Bubble Plot',
    };

    Plotly.newPlot('bubble', bubblePlot, bubbleLayout)
};

init();