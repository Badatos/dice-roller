(function () {
  const img = document.getElementById('map-bg');
  if (!img) return;
  const container = img.parentElement;
  if (!container) return;

  if (typeof Konva === 'undefined') {
    console.warn('Konva is not loaded. Please include Konva before this script.');
    return;
  }

  const tooltip = createTooltip();
  let regions = {};
  let regionShapes = {};
  let hoveredRegion = null;
  let highlightedRegions = [];
  // defaultColors must be defined in html file.
  let currentColors = Object.assign({}, defaultColors);

  // Crée un conteneur pour Konva (overlay au-dessus de l'image)
  let konvaDiv = container.querySelector('.konva-stage');
  if (!konvaDiv) {
    konvaDiv = document.createElement('div');
    konvaDiv.className = 'konva-stage';
    konvaDiv.style.position = 'absolute';
    konvaDiv.style.top = '0';
    konvaDiv.style.left = '0';
    konvaDiv.style.width = '100%';
    konvaDiv.style.height = '100%';
    konvaDiv.style.zIndex = 2;
    konvaDiv.style.pointerEvents = 'auto';
    container.style.position = container.style.position || 'relative';
    container.appendChild(konvaDiv);
  }

  const stage = new Konva.Stage({
    container: konvaDiv,
    width: 100,
    height: 100,
  });
  const calqueRegions = new Konva.Layer();
  stage.add(calqueRegions);
  const calqueHover = new Konva.Layer();
  stage.add(calqueHover);

  // Crée un tooltip à afficher au dessus de la souris
  function createTooltip() {
    const tip = document.createElement('div');
    tip.style.position = 'fixed';
    tip.style.zIndex = 9999;
    tip.style.pointerEvents = 'none';
    tip.style.padding = '5px 8px';
    tip.style.background = 'rgba(0,0,0,0.75)';
    tip.style.color = '#fff';
    tip.style.borderRadius = '0.25rem';
    tip.style.fontSize = '0.85rem';
    tip.style.whiteSpace = 'nowrap';
    tip.style.transition = 'opacity 120ms ease';
    tip.style.opacity = '0';
    tip.style.transform = 'translate(-50%, -110%)';
    document.body.appendChild(tip);
    return tip;
  }

  // Affiche le tooltip, adapté à la région survolée.
  function showTooltip(regionId, clientX, clientY) {
    const label = (typeof regionLabels !== 'undefined' && regionLabels[regionId]) ? regionLabels[regionId] : regionId;
    tooltip.textContent = label;
    tooltip.style.left = `${clientX}px`;
    tooltip.style.top = `${clientY}px`;
    tooltip.style.opacity = '1';
  }

  // Masque le tooltip
  function hideTooltip() {
    tooltip.style.opacity = '0';
  }

  // Charge le fichier json avec le contour des régions
  function fetchJSONData() {
    // regions_file must be defined in html file.
    fetch(regions_file)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        regions = data;
        buildShapes();
        resizeStage();
      })
      .catch(err => console.error('Failed to fetch regions:', err));
  }
  fetchJSONData();

  /*function updateHighlightStyles(){
    for(const id in regionShapes){
      const shape = regionShapes[id];
      shape.strokeWidth(highlightedRegions.includes(id) ? 2 : 1);
      if (highlightedRegions.includes(id)){
        shape.fill('rgba(255,255,255,0.25)');
        shape.stroke('rgba(36, 90, 54, 0.85)');
      } else {
        const fillInfo = getFillStyle(id, currentColors);
        applyFillToShape(shape, fillInfo);
        shape.stroke('rgba(0,0,0,0.35)');
      }
    }
    calqueRegions.batchDraw();
  }*/

  function resizeStage(){
    const rect = img.getBoundingClientRect();
    const unscaledWidth = rect.width / zoomLevel;
    const unscaledHeight = rect.height / zoomLevel;
    const dpr = window.devicePixelRatio || 1;
    const width = Math.round(unscaledWidth);
    const height = Math.round(unscaledHeight);
    stage.width(width);
    stage.height(height);
    // Rebuild shapes so that points are recalculated according to new scale
    buildShapes();
  }

  // Indique le style de couleur à appliquer (couleur ou gradient)
  function getFillStyle(id, colors){
    if (colors && colors[id]){
      const value = colors[id];
      if (Array.isArray(value)){
        // convert to Konva gradient stops: [0, c0, 1, c1, ...]
        const stops = [];

        if (value.length === 2) {
          // Pour un rendu hachuré simple, on alterne les deux couleurs plusieurs fois.
          const stripes = 48;
          const totalStops = stripes * 2;
          for (let i = 0; i < totalStops; i += 1) {
            const color = value[i % 2];
            stops.push(i / totalStops);
            stops.push(color);
            stops.push((i+1) / totalStops);
            stops.push(color);
          }
        } else {
          const n = value.length;
          value.forEach((c, i) => {
            stops.push(i / (n-1));
            stops.push(c);
          });
        }
        // apply a simple linear gradient via color stops on shapes when built
        // but Konva expects the stops array as [0, 'red', 1, 'blue'] on the shape
        return { gradient: true, stops };
      }
      return value;
    }
    return defaultColors[id] || 'rgba(255,255,255,0.5)';
  }

  // When building shapes, handle gradient fill objects
  function applyFillToShape(shape, fillInfo){
    if (!fillInfo) return;
    if (typeof fillInfo === 'object' && fillInfo.gradient){
      shape.fillLinearGradientStartPoint({ x: 0, y: 0 });
      shape.fillLinearGradientEndPoint({ x: stage.width(), y: stage.height() });
      shape.fillLinearGradientColorStops(fillInfo.stops);
    } else {
      shape.fill(fillInfo);
    }
  }

  // Build Shapes and applyFillToShape where needed
  function buildShapes(){
    calqueRegions.destroyChildren();
    regionShapes = {};
    const scale = getScale(img);
    for (const id in regions) {
      const pts = regions[id];
      const flat = [];
      pts.forEach(p => flat.push(p[0] * scale, p[1] * scale));
      const shape = new Konva.Line({
        points: flat,
        closed: true,
        stroke: 'rgba(0,0,0,0.35)',
        strokeWidth: highlightedRegions.includes(id) ? 2 : 1,
        listening: true,
        opacity: 0.5
      });
      const fillInfo = getFillStyle(id, currentColors);
      applyFillToShape(shape, fillInfo);

      // hover handlers
      (function(regionId, s){
        s.on('mousemove', (evt) => {
          const clientX = evt.evt.clientX;
          const clientY = evt.evt.clientY;
          showTooltip(regionId, clientX, clientY);
        });
        s.on('mouseenter', () => {
          document.body.style.cursor = 'help';
          //s.fill('rgba(255,255,255,0.25)');
          s.opacity(0.75);
          s.stroke('rgba(36, 90, 54, 0.85)');
          //updateHighlightStyles();
        });
        s.on('mouseleave', () => {
          document.body.style.cursor = '';
          hideTooltip();
          s.stroke('rgba(0,0,0,0.35)');
          s.opacity(0.5);
          // updateHighlightStyles();
          //applyFillToShape(shape, fillInfo);
        });
      })(id, shape);

      regionShapes[id] = shape;
      calqueRegions.add(shape);
    }
    calqueRegions.draw();
  }

  // Zoom sur la molette souris
  function onWheel(e){
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.08 : 1 / 1.08;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel * delta));
    const rect = container.getBoundingClientRect();
    const pointerY = e.clientY - rect.top;
    const scaleRatio = newZoom / zoomLevel;
    const panY = pointerY - (pointerY - 0) * scaleRatio;
    setZoom(newZoom, panY);
    resizeStage();
  }
  container.addEventListener('wheel', onWheel, { passive: false });

  if (img.complete) resizeStage();
  window.addEventListener('resize', resizeStage);
})();
