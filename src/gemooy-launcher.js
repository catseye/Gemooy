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
    "yoob/controller.js",
    "yoob/playfield.js",
    "yoob/playfield-canvas-view.js",
    "yoob/cursor.js",
    "yoob/preset-manager.js",
    "yoob/source-manager.js"
  ], function() {
    loadThese(["gemooy.js"], function() {
      container.innerHTML =
        '<div id="control_panel"></div>' +
        '<div>example source: <select id="select_source"></select></div>' +
        '<div id="canvas_viewport"><canvas id="canvas" width="400" height="400"></canvas></div>' +
        '<textarea id="editor" rows="25" cols="40"></textarea>';

      var controlPanel = document.getElementById('control_panel');
      var display = document.getElementById('canvas_viewport');
      var selectSource = document.getElementById('select_source');

      var v = new yoob.PlayfieldCanvasView;
      v.init({
          canvas: document.getElementById('canvas')
      });
      v.setCellDimensions(undefined, 20);

      var c = (new GemooyController()).init({
          panelContainer: controlPanel,
          view: v
      });

      var sourceManager = (new yoob.SourceManager()).init({
          panelContainer: controlPanel,
          editor: document.getElementById('editor'),
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
