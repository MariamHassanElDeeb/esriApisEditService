require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/toolbars/draw",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/graphic",
    "esri/layers/GraphicsLayer",
    "esri/Color",
    "esri/symbols/SimpleLineSymbol",
    "dojo/dom",
    "dojo/on",
    "esri/layers/Field",
    "dojo/domReady!",
  ], function (
    Map,
    FeatureLayer,
    Draw,
    SimpleMarkerSymbol,
    Graphic,
    GraphicsLayer,
    Color,
    SimpleLineSymbol,
    dom,
    on,
    Field
  ) {
    const map = new Map("map", {
      basemap: "topo-vector",
      center: [31, 31],
      zoom: 3,
    });
    let name = document.getElementById("Name");
    let city = document.getElementById("City");
    let grade = document.getElementById("Grade");
  
    let tb;
    let featureLayer = new FeatureLayer(
      "https://services5.arcgis.com/5pvruAhhfPtfSCnL/ArcGIS/rest/services/schoolsMap_WFL1/FeatureServer/0",
      {
        outFields: ["*"],
        mode: FeatureLayer.MODE_ONDEMAND, // Enable editing
      }
    );
  
    map.addLayer(featureLayer);
  
    map.on("load", initToolbar);
    const selectedFeature = map.infoWindow.getSelectedFeature();
  
    document.getElementById("Add").addEventListener("click", (evt) => {
      document.querySelector(".enableDataEntry").style.display = "block";
      if (name.value && city.value && grade.value) {
        console.log("fullfilled");
        activateToolbar("point");
      } else {
        console.log("Pls enter the data");
      }
    });
  
    // document.getElementById("Update").addEventListener("click", () => {
    //   // Implement code for updating features
    // });
  
    document.getElementById("Delete").addEventListener("click", () => {
        console.log("delete btn");
      deleteGraphic();
      map.infoWindow.hide();
    });
  
    function activateToolbar(tool) {
      tb.activate(tool);
    }
  
    var markerSymbol = new SimpleMarkerSymbol(
      SimpleMarkerSymbol.STYLE_CIRCLE,
      10,
      new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new Color([255, 255, 0]),
        1
      ),
      new Color("red")
    );
  
    function initToolbar() {
      tb = new Draw(map);
      tb.on("draw-end", addGraphic);
    }
  
    function addGraphic(evt) {
      var symbol;
      if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
        symbol = markerSymbol;
      }
  
      var graphic = new Graphic(evt.geometry, symbol);
      graphic.attributes = {
        City: "Test City",
        Name: "Test Name",
        Grade: "Test Grade",
      };
  
      // Add the graphic to the feature layer
      featureLayer.applyEdits([graphic], null, null, function (addResults) {
        console.log("result", addResults);
        if (addResults[0].success) {
          console.log("Feature added successfully.");
        } else {
          console.error("Error adding feature:", addResults[0].error);
        }
      });
    }

    // Add an event listener to the map for the "click" event.
map.on("click", function (evt) {
    // Identify the feature that was clicked.
    map.infoWindow.setFeatures([evt.graphic]);
    map.infoWindow.setTitle("schools");

    map.infoWindow.show(evt.graphic.geometry);
    // Capture the feature's attributes and populate the input fields.
    name.value = evt.graphic.attributes.Name;
    city.value = evt.graphic.attributes.City;
    grade.value = evt.graphic.attributes.Grade;
    map.infoWindow.setContent(`School Name: ${name.value}<br>City: ${city.value}<br>Grade: ${grade.value}`)
  });
  
  document.getElementById("Update").addEventListener("click", () => {
    update();
    // Get the selected feature (if any).
});
function update(){
      
      if (selectedFeature && name.value && city.value && grade.value) {
        // Update the feature's attributes.
        selectedFeature.attributes.Name = name.value;
        selectedFeature.attributes.City = city.value;
        selectedFeature.attributes.Grade = grade.value;
      
        // Use the FeatureLayer's applyEdits method to update the feature.
        featureLayer.applyEdits(null, [selectedFeature], null, function (updateResults) {
          if (updateResults[0].success) {
            console.log("Feature updated successfully.");
          } else {
            console.error("Error updating feature:", updateResults[0].error);
          }
        });
      
        // Clear the input fields.
        name.value = "";
        city.value = "";
        grade.value = "";
      }

  }

function deleteGraphic(){
  
       
        const selectedFeature = map.infoWindow.getSelectedFeature();

  if (selectedFeature) {
    // Use the FeatureLayer's applyEdits method to delete the feature.
    featureLayer.applyEdits(null, null, [selectedFeature], function (deleteResults) {
      if (deleteResults[0].success) {
        console.log("Feature deleted successfully.");
        map.infoWindow.hide();
      } else {
        console.error("Error deleting feature:", deleteResults[0].error);
      }
    });

    // Clear the input fields.
    
    name.value = "";
    city.value = "";
    grade.value = "";
  }
      
}
  
  });