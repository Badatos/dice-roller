
let zoomLevel = 1;
const minScale = 0.12;
const maxScale = 4;
let stage;

function setZoom(newZoom, panX, panY){
  zoomLevel = newZoom;
  stage.scale({ x: newZoom, y: newZoom });
  stage.batchDraw();
  const newPos = {
      x: panX,
      y: panY,
  };
  stage.position(newPos);
}

function zoomIn(){
  const newZoom = Math.max(minScale, Math.min(maxScale, zoomLevel *1.1));
  setZoom(newZoom, 0, 0);
}

function zoomOut(){
  const newZoom = Math.max(minScale, Math.min(maxScale, zoomLevel *0.9));
  setZoom(newZoom, 0, 0);
}

function zoomReset(){
  setZoom(0.2, 0, 0);
}

(function () {
  const imgInput = document.getElementById('img-input');
  const drawBtn = document.getElementById('draw-btn');
  const closeBtn = document.getElementById('close-btn');
  const exportBtn = document.getElementById('export-btn');
  const importInput = document.getElementById('import-input');
  const containerId = 'stage-parent';

  let layer, bgImageNode, drawing = false, previewLine = null;
  let currentPoints = [];
  // polygons: array of { shape: Konva.Line, anchors: [Konva.Circle] }
  let polygons = [];
  let imgNaturalWidth = 0, imgNaturalHeight = 0;

  // Create stage (container for all layers) and layer
  function initStage(w, h) {
    if (stage) { stage.destroy(); }
    stage = new Konva.Stage({ container: containerId, width: w, height: h });
    layer = new Konva.Layer();
    stage.add(layer);
    stage.on('click tap', onStageClick);
    stage.on('wheel', onWheel);
  }

  // Load a background image
  function loadImageFromSource(src) {
    const img = new Image();
    img.onload = function () {
      imgNaturalWidth = img.naturalWidth;
      imgNaturalHeight = img.naturalHeight;
      initStage(img.width, img.height);
      const kimg = new Konva.Image({
        image: img,
        x: 0, y: 0,
        width: img.width,
        height: img.height
      });
      layer.add(kimg);
      bgImageNode = kimg;
      layer.draw();
    };
    img.src = src;
  }

  // default load
  loadImageFromSource('CarteHeossie_Legendes_HD.webp');

  // Change background image
  imgInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) loadImageFromSource(URL.createObjectURL(f));
  });

  // Handle click on stage and drawings
  function onStageClick(e) {
    if (!drawing) return;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return;
    currentPoints.push(pos.x, pos.y);
    if (!previewLine) {
      previewLine = new Konva.Line({
        points: currentPoints,
        stroke: 'red',
        strokeWidth: 2,
        closed: false,
        lineJoin: 'round'
      });
      layer.add(previewLine);
    } else {
      previewLine.points(currentPoints);
    }
    layer.draw();
    closeBtn.disabled = currentPoints.length < 6; // need at least 3 points
  }

  /* Zoom In/Out on Mouse Wheel */
  function onWheel(e) {
    e.evt.preventDefault();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const scaleBy = 1.05;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const scale = Math.max(minScale, Math.min(maxScale, newScale));
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const newPos = {
      x: pointer.x - mousePointTo.x * scale,
      y: pointer.y - mousePointTo.y * scale,
    };
    stage.position(newPos);
    stage.scale({ x: scale, y: scale });
    stage.batchDraw();
  }

  // Start drawing
  drawBtn.addEventListener('click', () => {
    drawing = !drawing;
    drawBtn.textContent = drawing ? 'Annuler dessin' : 'Dessiner polygone';
    if (!drawing) {
      // cancel
      currentPoints = [];
      if (previewLine) { previewLine.destroy(); previewLine = null; }
      closeBtn.disabled = true;
      layer.draw();
    }
  });

  // helper: create polygon + anchors from flat points array
  function createPolygonFromPoints(flatPoints) {
    const poly = new Konva.Line({
      points: flatPoints.slice(),
      fill: 'rgba(0,128,255,0.35)',
      stroke: '#007bff',
      strokeWidth: 1,
      closed: true,
      draggable: true
    });
    layer.add(poly);
    const polyObj = { shape: poly, anchors: [] };

    // Create anchor on each poly vertex
    function createAnchors() {
      // destroy existing anchors if any
      polyObj.anchors.forEach(a => a.destroy()); polyObj.anchors = [];
      const pts = poly.points();
      for (let i = 0; i < pts.length; i += 2) {
        const x = pts[i], y = pts[i + 1];
        (function(index){
          const anchor = new Konva.Circle(
            { x: x + (poly.x() || 0), y: y + (poly.y() || 0), radius: 6,
              fill: '#fff',
              stroke: '#333',
              strokeWidth: 1,
              draggable: true });
          anchor.on('dragmove', function () {
            const p = poly.points().slice();
            // anchors are absolute; convert to poly-local coords by subtracting poly.x/y
            p[index * 2] = anchor.x() - (poly.x() || 0); p[index * 2 + 1] = anchor.y() - (poly.y() || 0);
            poly.points(p);
            layer.batchDraw();
          });
          anchor.on('dblclick dbltap', function () {
            // remove this vertex
            const p = poly.points().slice();
            p.splice(index * 2, 2);
            if (p.length < 6) {
              // if less than 3 points, delete polygon
              polyObj.anchors.forEach(a => a.destroy()); polyObj.anchors = [];
              poly.destroy(); polygons = polygons.filter(x => x !== polyObj);
              layer.draw();
              return;
            }
            poly.points(p);
            createAnchors();
            layer.draw();
          });
          anchor.on('mouseover', function () { document.body.style.cursor = 'move'; });
          anchor.on('mouseout', function () { document.body.style.cursor = 'default'; });
          layer.add(anchor);
          polyObj.anchors.push(anchor);
        })(i / 2);
      }
    }

    // when polygon is double-clicked delete whole polygon
    poly.on('dblclick dbltap', function () { polyObj.anchors.forEach(a => a.destroy()); poly.destroy(); polygons = polygons.filter(x => x !== polyObj); layer.draw(); });

    // Change cursor on mouseover
    poly.on('mouseover', function () { document.body.style.cursor = 'move'; });
    poly.on('mouseout', function () { document.body.style.cursor = 'default'; });

    // synchronize anchors when polygon is dragged: recalc anchors from polygon points + offset
    poly.on('dragmove', function () {
      const pts = poly.points();
      const ox = poly.x() || 0;
      const oy = poly.y() || 0;
      for (let k = 0; k < polyObj.anchors.length; k++) {
        const ax = pts[k * 2] + ox;
        const ay = pts[k * 2 + 1] + oy;
        polyObj.anchors[k].x(ax);
        polyObj.anchors[k].y(ay);
      }
      layer.batchDraw();
    });

    // when polygon clicked: if click is near an edge, insert a new vertex; otherwise show anchors
    poly.on('click tap', function (evt) {
      const pos = stage.getRelativePointerPosition();
      if (!pos) { createAnchors(); layer.draw(); return; }
      const threshold = 8; // pixels
      const pts = poly.points();
      const ox = poly.x() || 0;
      const oy = poly.y() || 0;
      let inserted = false;
      for (let i = 0; i < pts.length; i += 2) {
        const x1 = pts[i] + ox, y1 = pts[i + 1] + oy;
        const j = (i + 2) % pts.length;
        const x2 = pts[j] + ox, y2 = pts[j + 1] + oy;
        const d = pointToSegmentDistance(pos.x, pos.y, x1, y1, x2, y2);
        if (d <= threshold) {
          // insert between i and j
          const localX = pos.x - ox;
          const localY = pos.y - oy;
          const newPts = pts.slice();
          newPts.splice(i + 2, 0, localX, localY);
          poly.points(newPts);
          createAnchors();
          layer.draw();
          inserted = true;
          break;
        }
      }
      if (!inserted) { createAnchors(); layer.draw(); }
    });

    // change cursor to a plus-like crosshair when pointer is near an edge
    poly.on('mousemove', function () {
      const pos = stage.getRelativePointerPosition();
      if (!pos) return;
      const threshold = 8;
      const pts = poly.points();
      const ox = poly.x() || 0;
      const oy = poly.y() || 0;
      for (let i = 0; i < pts.length; i += 2) {
        const x1 = pts[i] + ox, y1 = pts[i + 1] + oy;
        const j = (i + 2) % pts.length;
        const x2 = pts[j] + ox, y2 = pts[j + 1] + oy;
        const d = pointToSegmentDistance(pos.x, pos.y, x1, y1, x2, y2);
        if (d <= threshold) {
          stage.container().style.cursor = 'crosshair';
          return;
        }
      }
      // otherwise show move cursor over polygon
      stage.container().style.cursor = 'move';
    });
    poly.on('mouseout', function () { stage.container().style.cursor = 'default'; });
    // create anchors initially
    createAnchors();
    return polyObj;
  }

  // utility: distance from point to segment
  function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;
    let xx, yy;
    if (param < 0) { xx = x1; yy = y1; }
    else if (param > 1) { xx = x2; yy = y2; }
    else { xx = x1 + param * C; yy = y1 + param * D; }
    const dx = px - xx; const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Close drawing
  closeBtn.addEventListener('click', () => {
    if (currentPoints.length < 6) return;
    const ptsFlat = currentPoints.slice();
    const polyObj = createPolygonFromPoints(ptsFlat);
    polygons.push(polyObj);
    // finalize
    if (previewLine) { previewLine.destroy(); previewLine = null; }
    currentPoints = [];
    drawing = false;
    drawBtn.textContent = 'Dessiner polygone';
    closeBtn.disabled = true;
    layer.draw();
  });

  // Export regions
  exportBtn.addEventListener('click', () => {
    if (!bgImageNode) return alert('Image non chargée');
    const map = {};
    const scaleX = imgNaturalWidth / bgImageNode.width();
    const scaleY = imgNaturalHeight / bgImageNode.height();
    polygons.forEach((polyObj, i) => {
      const shape = polyObj.shape;
      const pts = shape.points();
      const offsetX = shape.x() || 0;
      const offsetY = shape.y() || 0;
      const pairs = [];
      for (let j = 0; j < pts.length; j += 2) {
        const absX = pts[j] + offsetX;
        const absY = pts[j + 1] + offsetY;
        pairs.push([Math.round(absX * scaleX), Math.round(absY * scaleY)]);
      }
      map['region' + (i + 1)] = pairs;
    });
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(map, null, 2));
    const a = document.createElement('a'); a.href = dataStr; a.download = 'regions.json'; a.click();
  });

  // Import regions
  importInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      try {
        const obj = JSON.parse(ev.target.result);
        // clear existing polygons
        polygons.forEach(p => { p.anchors.forEach(a => a.destroy()); p.shape.destroy(); }); polygons = [];
        // add from obj (assume arrays of [x,y] in natural img coords)
        const scaleX = bgImageNode ? (bgImageNode.width() / imgNaturalWidth) : 1;
        const scaleY = bgImageNode ? (bgImageNode.height() / imgNaturalHeight) : 1;
        Object.keys(obj).forEach(key => {
          const pts = obj[key];
          const flat = [];
          pts.forEach(p => { flat.push(p[0] * scaleX, p[1] * scaleY); });
          const polyObj = createPolygonFromPoints(flat);
          polygons.push(polyObj);
        });
        layer.draw();
      } catch (err) { alert('Import JSON invalide'); }
    };
    reader.readAsText(f);
  });

})();
