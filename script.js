// require([
//   "esri/map",
//   "esri/layers/FeatureLayer",
//   "esri/toolbars/draw",
//   "esri/symbols/SimpleMarkerSymbol",
//   "esri/graphic",
//   "esri/layers/GraphicsLayer",
//   "esri/Color",
//   "esri/symbols/SimpleLineSymbol",
//   "dojo/dom",
//   "dojo/on",
//   "esri/layers/Field",
//   "dojo/domReady!",
// ], function (
//   Map,
//   FeatureLayer,
//   Draw,
//   SimpleMarkerSymbol,
//   Graphic,
//   GraphicsLayer,
//   Color,
//   SimpleLineSymbol,
//   dom,
//   on,
//   Field
// ) {
//   const map = new Map("map", {
//     basemap: "topo-vector",
//     center: [31, 31],
//     zoom: 3,
//   });
//   let tb;
//   let featureLayer = new FeatureLayer(
//     "https://services5.arcgis.com/5pvruAhhfPtfSCnL/ArcGIS/rest/services/schoolsMap_WFL1/FeatureServer/0",
//     {
//       outFields: ["*"],
//     }
//   );

//   map.addLayer(featureLayer);

//   ///Tool bar
//   map.on("load", initToolbar);

//   document.getElementById("Add").addEventListener("click", (evt) => {
//     activateToolbar(evt);
//   });

//   function activateToolbar(evt) {
//     console.log(evt.target.id);
//     if (evt.target.id == "Add") {
//       var tool = "point";
//       tb.activate(tool);
//     }
//   }
//   // markerSymbol is used for point and multipoint, see http://raphaeljs.com/icons/#talkq for more examples
//   var markerSymbol = new SimpleMarkerSymbol(
//     SimpleMarkerSymbol.STYLE_SQUARE,
//     10,
//     new SimpleLineSymbol(
//       SimpleLineSymbol.STYLE_SOLID,
//       new Color([255, 255, 0]),
//       1
//     ),
//     new Color([0, 255, 0, 0.25])
//   );

//   function initToolbar() {
//     tb = new Draw(map);
//     tb.on("draw-end", addGraphic);
//   }

//   function addGraphic(evt) {
//     var symbol;
//     if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
//       symbol = markerSymbol;
//     }
//     let graphic = new Graphic(evt.geometry, symbol);
//     let graphicLayer = new GraphicsLayer();
//     console.log("fresh graph", graphic);
//     featureLayer.add(graphic);
//     featureLayer.templates[0].prototype.attributes.City = "HHH";
//     console.log(featureLayer);
//     map.addLayer(featureLayer);

//   }
// });

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

  document.getElementById("Add").addEventListener("click", (evt) => {
    document.querySelector(".enableDataEntry").style.display = "block";
    if (name.value && city.value && grade.value) {
      console.log("fullfilled");
      activateToolbar("point");
    } else {
      console.log("Pls enter the data");
    }
  });

  document.getElementById("Update").addEventListener("click", () => {
    // Implement code for updating features
  });

  document.getElementById("Delete").addEventListener("click", () => {
    // Implement code for deleting features
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
});
