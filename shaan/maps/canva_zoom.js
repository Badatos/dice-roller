let zoomLevel = 1;
const minZoom = 1;
const maxZoom = 4;

function getScale(img) {
  const imgW = img.naturalWidth || 1;
  const rect = img.getBoundingClientRect();
  return rect.width / zoomLevel / imgW;
}

function setZoom(newZoom, panY){
  zoomLevel = newZoom;
  const img = document.getElementById('map-bg');
  if (!img) return;
  const container = img.parentElement;
  if (!container) return;
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
