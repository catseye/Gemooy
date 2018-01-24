function launch(prefix, container, config) {
  if (typeof container === 'string') {
    container = document.getElementById(container);
  }
  config = config || {};

  function loadThese(deps, callback) {
    var loaded = 0;
    for (var i = 0; i < deps.length; i++) {
      var elem = document.createElement('script');
      elem.src = prefix + deps[i];
      elem.onload = function() {
        if (++loaded < deps.length) return;
        callback();
      }
      document.body.appendChild(elem);
    }
  }

  loadThese([
    "yoob/element-factory.js",
    "yoob/controller.js",
    "yoob/playfield.js",
    "yoob/playfield-canvas-view.js",
    "yoob/cursor.js",
    "yoob/preset-manager.js",
    "yoob/source-manager.js"
  ], function() {
    loadThese(["gemooy.js"], function() {
      var controlPanel = yoob.makeDiv(container);
      var subPanel = yoob.makeDiv(container);
      var selectSource = yoob.makeSelect(subPanel, 'example source:', []);
      var display = yoob.makeDiv(container);
      display.id = 'canvas_viewport';
      var canvas = yoob.makeCanvas(display, 400, 400);
      var editor = yoob.makeTextArea(container, 40, 25);

      var v = (new yoob.PlayfieldCanvasView()).init({ canvas: canvas });
      v.setCellDimensions(undefined, 20);

      var c = (new GemooyController()).init({
          panelContainer: controlPanel,
          view: v
      });

      var sourceManager = (new yoob.SourceManager()).init({
          panelContainer: controlPanel,
          editor: editor,
          hideDuringEdit: [display],
          disableDuringEdit: [c.panel],
          storageKey: 'gemooy.js',
          onDone: function() {
              c.performReset(this.getEditorText());
          }
      });
      
      var presetManager = (new yoob.PresetManager()).init({
        selectElem: selectSource
      });
      function makeCallback(sourceText) {
        return function(id) {
          sourceManager.loadSource(sourceText);
        }
      }
      for (var i = 0; i < examplePrograms.length; i++) {
        presetManager.add(examplePrograms[i][0], makeCallback(examplePrograms[i][1]));
      }
      presetManager.select('toggle-column.gemooy');
    });
  });
}
