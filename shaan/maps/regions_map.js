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
  let panX = 0;
  let panY = 0;
  container.style.transformOrigin = '0 0';
  container.style.willChange = 'transform';
  container.addEventListener('wheel', onWheel, { passive: false });

  // regions_file & defaultColors must be defined in html file.
  let currentColors = Object.assign({}, defaultColors);

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

  function drawRegions(colors) {
    if (!img.naturalWidth) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = getScale();
    for (const id in regions) {
      const pts = regions[id];
      ctx.beginPath();
      pts.forEach((p, i) => {
        const x = p[0] * scale, y = p[1] * scale;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath();
      if (colors && colors[id]) {
        ctx.fillStyle = getGradient(colors[id]);
      } else {
        ctx.fillStyle = defaultColors[id] || 'rgba(255,255,255,0.2)';
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
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
