let zoomLevel = 1;
const minZoom = 1;
const maxZoom = 4;

const canvas = document.getElementById('map-canvas');
const container = canvas ? canvas.parentElement : null;

(function () {
  const img = document.getElementById('map-bg');
  if (!img || !canvas || !container) return;
  const ctx = canvas.getContext('2d');
  let regions = {};
  let regionPaths = {};
  let hoveredRegion = null;
  let highlightedRegions = [];
  let panX = 0;
  let panY = 0;
  container.style.transformOrigin = '0 0';
  container.style.willChange = 'transform';
  container.addEventListener('wheel', onWheel, { passive: false });
  container.addEventListener('mousemove', onPointerMove);
  container.addEventListener('mouseleave', onPointerLeave);

  // regions_file & defaultColors must be defined in html file.
  let currentColors = Object.assign({}, defaultColors);
  const tooltip = createTooltip();

  btns = document.getElementsByClassName("highlight-btn");
  for (var i=0; i<btns.length; i++) {
    // console.log(btn);
  }

  // Génère un gradient adapté à la taille du canvas et aux couleurs fournies.
  function getGradient(colors) {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const gradient = ctx.createLinearGradient(0, 0, width, height);

    if (!Array.isArray(colors) || colors.length === 0) {
      return colors;
    }

    if (colors.length === 1) {
      return colors[0];
    }

    if (colors.length === 2) {
      // Pour un rendu hachuré simple, on alterne les deux couleurs plusieurs fois.
      const stripes = 64;
      const totalStops = stripes * 2;
      for (let i = 0; i < totalStops; i += 1) {
        const color = colors[i % 2];
        gradient.addColorStop(i / totalStops, color);
        gradient.addColorStop((i + 1) / totalStops, color);
      }
      return gradient;
    }

    const n = colors.length - 1;
    colors.forEach((color, index) => {
      gradient.addColorStop(index / n, color);
    });
    return gradient;
  }

  // Crée un tooltip à afficher au dessus de la souris
  function createTooltip() {
    const tip = document.createElement('div');
    tip.style.position = 'fixed';
    tip.style.zIndex = 9999;
    tip.style.pointerEvents = 'none';
    tip.style.padding = '5px 8px';
    tip.style.background = 'rgba(0, 0, 0, 0.75)';
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
    const label = regionLabels[regionId] || regionId;
    tooltip.textContent = label;
    tooltip.style.left = `${clientX}px`;
    tooltip.style.top = `${clientY}px`;
    tooltip.style.opacity = '1';
  }

  // Masque le tooltip
  function hideTooltip() {
    tooltip.style.opacity = '0';
  }

  function fetchJSONData() {
    fetch(regions_file)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        regions = data;
        resizeCanvas();
      })
      .catch(error => console.error('Failed to fetch data:', error));
  }
  fetchJSONData();

  function getScale() {
    const imgW = img.naturalWidth || 1;
    const rect = img.getBoundingClientRect();
    return rect.width / zoomLevel / imgW;
  }

  function resizeCanvas() {
    const rect = img.getBoundingClientRect();
    const unscaledWidth = rect.width / zoomLevel;
    const unscaledHeight = rect.height / zoomLevel;
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = unscaledWidth + 'px';
    canvas.style.height = unscaledHeight + 'px';
    canvas.width = Math.round(unscaledWidth * dpr);
    canvas.height = Math.round(unscaledHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawRegions(currentColors);
  }

  // Indique le style de couleur à appliquer (couleur ou gradient)
  function getFillStyle(id, colors) {
    if (colors && colors[id]) {
      const value = colors[id];
      if (Array.isArray(value)) {
        return getGradient(value);
      }
      return value;
    }
    return defaultColors[id] || 'rgba(255,255,255,0.2)';
  }

  function drawRegions(colors) {
    if (!img.naturalWidth) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = getScale();
    regionPaths = {};
    for (const id in regions) {
      const pts = regions[id];
      const path = new Path2D();
      pts.forEach((p, i) => {
        const x = p[0] * scale;
        const y = p[1] * scale;
        if (i === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      });
      path.closePath();
      regionPaths[id] = path;

      ctx.fillStyle = getFillStyle(id, colors);
      ctx.fill(path);
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = highlightedRegions.includes(id) ? 2 : 1;
      ctx.stroke(path);
    }

    // On replace une nouvelle zone blanche par dessus chaque région à surligner.
    highlightedRegions.forEach((highlighted, i) => {
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fill(regionPaths[highlighted]);
      ctx.strokeStyle = 'rgba(36, 90, 54, 0.85)';
      ctx.lineWidth = 1;
      ctx.stroke(regionPaths[highlighted]);
    })
  }

  // Indique quelle région se trouve au coordonnées fournies
  function getRegionAtPoint(clientX, clientY) {
    if (!regions || !Object.keys(regions).length) return null;
    const rect = container.getBoundingClientRect();
    const x = (clientX - rect.left) / zoomLevel;
    const y = (clientY - rect.top) / zoomLevel;
    for (const id in regionPaths) {
      if (ctx.isPointInPath(regionPaths[id], x, y)) {
        return id;
      }
    }
    return null;
  }

  // Actions lorsque la souris passe sur la carte
  function onPointerMove(e) {
    const found = getRegionAtPoint(e.clientX, e.clientY);
    // Lorsqu'on survole une nouvelle région
    if (found !== hoveredRegion) {
      hoveredRegion = found;
      highlightedRegions = [found];
      // Redessine les régions
      drawRegions(currentColors);
    }
    if (found) {
      showTooltip(found, e.clientX, e.clientY);
    } else {
      hideTooltip();
    }
  }

  // Actions lorsqu la souris quitte la zone
  function onPointerLeave() {
    hoveredRegion = null;
    highlightedRegions = [];
    drawRegions(currentColors);
    hideTooltip();
  }

  window.addEventListener('resize', resizeCanvas);

  // Zoom sur la molette souris
  function onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.08 : 1 / 1.08;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel * delta));
    const rect = container.getBoundingClientRect();
    const pointerY = e.clientY - rect.top;
    const scaleRatio = newZoom / zoomLevel;
    panY = pointerY - (pointerY - panY) * scaleRatio;
    setZoom(newZoom, panY);
    resizeCanvas();
  }

  window.setRegionColors = function (colors) {
    currentColors = Object.assign({}, defaultColors, colors || {});
    drawRegions(currentColors);
  };

  if (img.complete) resizeCanvas();
})();

function setZoom(newZoom, panY){
  zoomLevel = newZoom;
  container.style.transform = `translate(0px, ${panY}px) scale(${zoomLevel})`;
}

function zoomIn(){
  const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel *1.1));
  setZoom(newZoom, 0);
}
function zoomOut(){
  const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel *0.9));
  setZoom(newZoom, 0);
}
function zoomReset(){
  setZoom(1, 0);
}
