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
  let tb;
  let featureLayer = new FeatureLayer(
    "https://services5.arcgis.com/5pvruAhhfPtfSCnL/ArcGIS/rest/services/schoolsMap_WFL1/FeatureServer/0",
    {
      outFields: ["*"],
    }
  );

  map.addLayer(featureLayer);
  ///Tool bar
  map.on("load", initToolbar);

  document.getElementById("Add").addEventListener("click", (evt) => {
    activateToolbar(evt);
  });

  function activateToolbar(evt) {
    console.log(evt.target.id);
    if (evt.target.id == "Add") {
      var tool = "point";
      tb.activate(tool);
    }
  }
  // markerSymbol is used for point and multipoint, see http://raphaeljs.com/icons/#talkq for more examples
  var markerSymbol = new SimpleMarkerSymbol(
    SimpleMarkerSymbol.STYLE_SQUARE,
    10,
    new SimpleLineSymbol(
      SimpleLineSymbol.STYLE_SOLID,
      new Color([255, 255, 0]),
      1
    ),
    new Color([0, 255, 0, 0.25])
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
    let graphic = new Graphic(evt.geometry, symbol);
    let graphicLayer = new GraphicsLayer();
    console.log("fresh graph", graphic);
    featureLayer.add(graphic);
    featureLayer.templates[0].prototype.attributes.City = "HHH";
    console.log(featureLayer);
    map.addLayer(featureLayer);
    //  console.log(featureLayer.getSelectedFeatures()[0]);
    //   var targetGraphic = firePerimeterFL.getSelectedFeatures()[0].setGeometry(reshapedGeometry);
    //   firePerimeterFL.applyEdits(null, [targetGraphic], null);
    // console.log(
    //   featureLayer._graphicsVal[featureLayer._graphicsVal.length - 1]
    // );
    // console.log(
    //   "index 2",
    //   featureLayer._graphicsVal[featureLayer._graphicsVal.length - 1]
    // );
    // let objId = new Field({
    //   type: "esriFieldTypeOID",
    // });
    // console.log("OOOOOOOOO", objId);
    // featureLayer._graphicsVal[featureLayer._graphicsVal.length - 1].attributes =
    //   {
    //     City: "NNNb",
    //     Grade: "fmfmf",
    //     Name: "mrmrmrrm",
    //   };
    // featureLayer._graphicsVal.map((graph) => {
    //   console.log(graph);
    // });
  }
});
