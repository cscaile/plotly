
//build info graphics
function buildInfographic(sample) {
    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
      // console.log(data.metadata)
      var resultsarray= metadata.filter(sampleobject => sampleobject.id == sample);
      var result= resultsarray[0]
      var PANEL = d3.select("#sample-metadata");
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
      });

          
    });
  }


function buildPlots(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json("samples.json").then((data) => {
    var samples= data.samples;
    var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
    var result= resultsarray[0]

    var ids = result.otu_ids;
    // console.log(ids)
    var labels = result.otu_labels;
    var count = result.sample_values;
    //console.log(labels)
    //console.log(count)



    // Build a Bubble Chart using the sample data
    var bubble_layout = {
      margin: { t: 0 },
      xaxis: { title: "Id's" },
      hovermode: "closest",
      };

      var bubble_data = [
      {
        x: ids,
        y: count,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: count,
          }
      }
    ];

    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    //  Build a bar Chart
    
    var bar_data =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:count.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
        

      }
    ];

    var bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", bar_data, bar_layout);
  });
}
   
 
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildPlots(firstSample);
    buildInfographic(firstSample);
    });
  }

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildPlots(newSample);
  buildInfographic(newSample);
}

// Initialize the dashboard
init();