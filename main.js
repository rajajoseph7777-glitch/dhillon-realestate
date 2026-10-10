/* Dhillon Real Estate & Builders — site script
 * Edit CONFIG and PROJECTS below to update business details. Everything else is presentation.
 */
const CONFIG = {
  name: 'Dhillon Real Estate & Builders',
  shortName: 'Dhillon',
  since: '2005',
  // REPLACE with the client's real contact details before going live.
  phoneDisplay: '+91 98765 43210',
  phone: '+919876543210',
  whatsapp: '919876543210', // country code + number, digits only
  email: 'info@dhillonbuilders.com',
  address: 'Sector 82, Mohali, Punjab',
  hours: 'Mon – Sun · 9:30 AM – 7:00 PM',
};

const PROJECTS = [
  { name: 'Dhillon Royal Villas', loc: 'Sector 82, Mohali', type: 'residential', status: 'Ready to Move', price: '₹1.45 Cr*', size: '3,200 sq.ft', config: '4 BHK Villa', hue: 38 },
  { name: 'Dhillon Heights', loc: 'Airport Road, Zirakpur', type: 'residential', status: 'Under Construction', price: '₹68 L*', size: '1,650 sq.ft', config: '3 BHK Apt', hue: 210 },
  { name: 'Dhillon Business Square', loc: 'Kharar Highway', type: 'commercial', status: 'Booking Open', price: '₹95 L*', size: '1,200 sq.ft', config: 'SCO / Showroom', hue: 265 },
  { name: 'Green Acres Enclave', loc: 'New Chandigarh', type: 'plots', status: 'Possession Ready', price: '₹42 L*', size: '200 sq.yd', config: 'Residential Plot', hue: 140 },
  { name: 'Dhillon Grand Floors', loc: 'Sector 115, Mohali', type: 'residential', status: 'Booking Open', price: '₹82 L*', size: '1,900 sq.ft', config: '3 BHK Floor', hue: 15 },
  { name: 'Dhillon Trade Centre', loc: 'Landran Road', type: 'commercial', status: 'Under Construction', price: '₹55 L*', size: '650 sq.ft', config: 'Office Space', hue: 190 },
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ---------- Config binding ---------- */
document.querySelectorAll('[data-cfg]').forEach((el) => { el.textContent = CONFIG[el.dataset.cfg] || ''; });
document.querySelectorAll('[data-cfg-href="tel"]').forEach((el) => { el.href = 'tel:' + CONFIG.phone; });
document.querySelectorAll('[data-cfg-href="mail"]').forEach((el) => { el.href = 'mailto:' + CONFIG.email; });
document.getElementById('year').textContent = new Date().getFullYear();
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
document.getElementById('waFloat').href = waLink(`Hi ${CONFIG.shortName} team, I'd like to know more about your projects.`);

/* ---------- Nav ---------- */
const nav = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
document.getElementById('navToggle').addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.addEventListener('click', (e) => { if (e.target.tagName === 'A') navLinks.classList.remove('open'); });

/* ---------- Projects ---------- */
function skylineSVG(seed, hue) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let bars = '';
  let windows = '';
  let x = 0;
  while (x < 400) {
    const w = 28 + rnd() * 40;
    const h = 60 + rnd() * 130;
    const y = 210 - h;
    bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="hsl(${hue},35%,${14 + rnd() * 10}%)"/>`;
    for (let wy = y + 10; wy < 200; wy += 14) {
      for (let wx = x + 6; wx < x + w - 8; wx += 10) {
        if (rnd() > 0.55) windows += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="4" height="6" fill="#f3d58a" opacity="${(0.5 + rnd() * 0.5).toFixed(2)}"/>`;
      }
    }
    x += w + 4;
  }
  return `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs><linearGradient id="g${seed}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="hsl(${hue},60%,45%)"/><stop offset="1" stop-color="hsl(${hue},45%,12%)"/></linearGradient></defs>
    <rect width="400" height="210" fill="url(#g${seed})"/>
    <circle cx="320" cy="50" r="22" fill="#f3d58a" opacity=".85"/>${bars}${windows}</svg>`;
}

const grid = document.getElementById('projectGrid');
grid.innerHTML = PROJECTS.map((p, i) => `
  <article class="project reveal" data-type="${p.type}">
    <div class="project-img">${skylineSVG(i + 3, p.hue)}
      <span class="badge">${p.type}</span><span class="badge status">${p.status}</span></div>
    <div class="project-body">
      <h3>${p.name}</h3>
      <p class="loc">📍 ${p.loc}</p>
      <div class="project-meta">
        <div><b>${p.price}</b>Starting</div>
        <div><b>${p.config}</b>Type</div>
        <div><b>${p.size}</b>Area</div>
      </div>
    </div>
  </article>`).join('');

document.getElementById('filters').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#filters button').forEach((b) => b.classList.toggle('active', b === btn));
  const f = btn.dataset.filter;
  grid.querySelectorAll('.project').forEach((card) => card.classList.toggle('hide', f !== 'all' && card.dataset.type !== f));
});

/* ---------- 3D tilt on cards ---------- */
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.project, .tilt').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg) translateZ(10px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* ---------- Reveal on scroll ---------- */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('visible'); revealObs.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

/* ---------- Counters ---------- */
function runCounters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = +el.dataset.count;
    const start = performance.now();
    const dur = 1800;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))).toLocaleString('en-IN');
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ---------- EMI calculator ---------- */
const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const amt = document.getElementById('amt');
const rate = document.getElementById('rate');
const yrs = document.getElementById('yrs');
function calcEMI() {
  const P = +amt.value;
  const r = +rate.value / 12 / 100;
  const n = +yrs.value * 12;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  document.getElementById('amtOut').textContent = P >= 1e7 ? `₹${(P / 1e7).toFixed(2)} Cr` : `₹${(P / 1e5).toFixed(1)} L`;
  document.getElementById('rateOut').textContent = (+rate.value).toFixed(2) + '%';
  document.getElementById('yrsOut').textContent = yrs.value + ' yrs';
  document.getElementById('emiOut').textContent = inr(emi);
  document.getElementById('intOut').textContent = inr(total - P);
  document.getElementById('totOut').textContent = inr(total);
  document.getElementById('emiBar').style.width = ((P / total) * 100).toFixed(1) + '%';
}
[amt, rate, yrs].forEach((el) => el.addEventListener('input', calcEMI));
calcEMI();

/* ---------- Testimonials ---------- */
const testis = [...document.querySelectorAll('.testi')];
const dots = document.getElementById('testiDots');
let testiIdx = 0;
testis.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', `Testimonial ${i + 1}`);
  b.addEventListener('click', () => showTesti(i));
  dots.appendChild(b);
});
function showTesti(i) {
  testiIdx = i;
  testis.forEach((t, j) => t.classList.toggle('active', j === i));
  [...dots.children].forEach((d, j) => d.classList.toggle('active', j === i));
}
showTesti(0);
setInterval(() => showTesti((testiIdx + 1) % testis.length), 6000);

/* ---------- Contact form → WhatsApp ---------- */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const d = new FormData(e.target);
  const msg = `New enquiry from website\nName: ${d.get('name')}\nPhone: ${d.get('phone')}\nInterested in: ${d.get('interest')}\n${d.get('budget')}` +
    (d.get('message') ? `\nMessage: ${d.get('message')}` : '');
  window.open(waLink(msg), '_blank', 'noopener');
  e.target.reset();
});

/* ---------- Shared helpers for Three.js scenes ---------- */
function fitRenderer(renderer, camera, canvas) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (canvas.width !== Math.floor(w * renderer.getPixelRatio()) || canvas.height !== Math.floor(h * renderer.getPixelRatio())) {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
}
function whenVisible(el, cb) {
  new IntersectionObserver((entries) => cb(entries[0].isIntersecting), { threshold: 0 }).observe(el);
}

/* ---------- Hero: 3D night city ---------- */
function initCity() {
  const canvas = document.getElementById('cityCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1220);
  scene.fog = new THREE.FogExp2(0x0b1220, 0.0065);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.5, 600);

  scene.add(new THREE.AmbientLight(0x44557a, 0.9));
  const moon = new THREE.DirectionalLight(0x9fb4ff, 0.7);
  moon.position.set(-60, 120, 40);
  scene.add(moon);

  // Facade textures: colour map + emissive map (lit windows only)
  function facadeTextures(litRatio) {
    const make = () => { const c = document.createElement('canvas'); c.width = c.height = 128; return c; };
    const cMap = make(); const cEm = make();
    const m = cMap.getContext('2d'); const em = cEm.getContext('2d');
    m.fillStyle = '#1a2335'; m.fillRect(0, 0, 128, 128);
    em.fillStyle = '#000'; em.fillRect(0, 0, 128, 128);
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 4; col++) {
        const x = col * 32 + 6; const y = row * 16 + 4;
        if (Math.random() < litRatio) {
          const warm = Math.random() > 0.25 ? '#ffd27a' : '#bfe3ff';
          m.fillStyle = warm; em.fillStyle = warm;
          m.fillRect(x, y, 20, 9); em.fillRect(x, y, 20, 9);
        } else {
          m.fillStyle = '#2a3a58'; m.fillRect(x, y, 20, 9);
        }
      }
    }
    const tMap = new THREE.CanvasTexture(cMap);
    const tEm = new THREE.CanvasTexture(cEm);
    [tMap, tEm].forEach((t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; });
    return new THREE.MeshStandardMaterial({ map: tMap, emissiveMap: tEm, emissive: 0xffffff, emissiveIntensity: 0.9, roughness: 0.8, metalness: 0.2 });
  }
  const materials = [0.25, 0.35, 0.45, 0.55, 0.3, 0.4].map(facadeTextures);

  // Scale side-face UVs so windows keep a constant size regardless of building dimensions
  function buildingGeometry(w, h, d) {
    const g = new THREE.BoxGeometry(w, h, d);
    const uv = g.attributes.uv;
    const extents = [d, d, 0, 0, w, w]; // +x, -x, +y, -y, +z, -z
    for (let f = 0; f < 6; f++) {
      for (let v = 0; v < 4; v++) {
        const i = f * 4 + v;
        if (extents[f] === 0) uv.setXY(i, 0.01, 0.99); // roof/floor → plain facade colour
        else uv.setXY(i, uv.getX(i) * (extents[f] / 6), uv.getY(i) * (h / 12));
      }
    }
    return g;
  }

  const city = new THREE.Group();
  scene.add(city);
  const CELL = 9;
  for (let i = -11; i <= 11; i++) {
    for (let j = -11; j <= 11; j++) {
      if (i % 3 === 0 || j % 3 === 0) continue; // streets
      if ((i === 1 || i === 2) && (j === 1 || j === 2)) continue; // signature tower plot
      const x = i * CELL; const z = j * CELL;
      const dist2 = x * x + z * z;
      const h = (5 + Math.random() * 16) * (1 + 2.6 * Math.exp(-dist2 / 1400));
      const w = 5 + Math.random() * 2.5; const d = 5 + Math.random() * 2.5;
      const mesh = new THREE.Mesh(buildingGeometry(w, h, d), materials[(Math.random() * materials.length) | 0]);
      mesh.position.set(x, h / 2, z);
      city.add(mesh);
    }
  }

  // Signature tower
  const towerPos = new THREE.Vector3(13.5, 0, 13.5);
  const towerH = 92;
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4a64a, emissive: 0x6b4a10, metalness: 0.8, roughness: 0.3 });
  const glassMat = facadeTextures(0.7);
  const tower = new THREE.Group();
  tower.position.copy(towerPos);
  const tiers = [[14, 40], [11, 30], [8, 22]];
  let y = 0;
  tiers.forEach(([s, h]) => {
    const m = new THREE.Mesh(buildingGeometry(s, h, s), glassMat);
    m.position.y = y + h / 2;
    tower.add(m);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(s, h, s)), new THREE.LineBasicMaterial({ color: 0xf3d58a }));
    edges.position.y = m.position.y;
    tower.add(edges);
    const band = new THREE.Mesh(new THREE.BoxGeometry(s + 0.8, 0.8, s + 0.8), goldMat);
    band.position.y = y + h;
    tower.add(band);
    y += h;
  });
  const spire = new THREE.Mesh(new THREE.ConeGeometry(1.2, 14, 8), goldMat);
  spire.position.y = towerH + 7;
  tower.add(spire);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffe9a8 }));
  beacon.position.y = towerH + 14.5;
  tower.add(beacon);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(10, 0.25, 8, 64), new THREE.MeshBasicMaterial({ color: 0xf3d58a, transparent: true, opacity: 0.7 }));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = towerH + 2;
  tower.add(ring);
  const glow = new THREE.PointLight(0xffc96b, 2.2, 120, 2);
  glow.position.y = towerH;
  tower.add(glow);
  scene.add(tower);

  // Ground + street lines
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshStandardMaterial({ color: 0x0a101c, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  const streetMat = new THREE.MeshBasicMaterial({ color: 0x1d2a44 });
  for (let k = -3; k <= 3; k++) {
    const a = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 210), streetMat);
    a.rotation.x = -Math.PI / 2; a.position.set(k * 27, 0.02, 0); scene.add(a);
    const b = a.clone(); b.rotation.z = Math.PI / 2; b.position.set(0, 0.02, k * 27); scene.add(b);
  }

  // Moving traffic lights
  const cars = [];
  const carGeo = new THREE.BoxGeometry(0.6, 0.3, 1.4);
  const carMats = [new THREE.MeshBasicMaterial({ color: 0xffe2a0 }), new THREE.MeshBasicMaterial({ color: 0xff5a5a })];
  for (let n = 0; n < 90; n++) {
    const car = new THREE.Mesh(carGeo, carMats[n % 2]);
    const lane = ((Math.random() * 7) | 0) - 3;
    const alongX = Math.random() > 0.5;
    car.userData = { alongX, lane: lane * 27 + (n % 2 ? 0.6 : -0.6), pos: Math.random() * 210 - 105, speed: (12 + Math.random() * 14) * (n % 2 ? 1 : -1) };
    if (alongX) car.rotation.y = Math.PI / 2;
    cars.push(car); scene.add(car);
  }

  // Stars
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(900 * 3);
  for (let i = 0; i < 900; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 600;
    starPos[i * 3 + 1] = 80 + Math.random() * 200;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 600;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.7 })));

  // Interaction
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => {
    mouse.tx = e.clientX / window.innerWidth - 0.5;
    mouse.ty = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  let visible = true;
  whenVisible(canvas, (v) => { visible = v; });
  const target = new THREE.Vector3(towerPos.x, 42, towerPos.z);
  const clock = new THREE.Clock();
  let angle = 0.6;

  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible) return;
    fitRenderer(renderer, camera, canvas);
    if (!reduceMotion) angle += dt * 0.06;
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1);
    const isMobile = canvas.clientWidth < 760;
    const radius = (isMobile ? 200 : 185) - scroll * 40;
    // Offset the orbit so the tower sits right-of-centre on desktop (text lives on the left)
    const a = angle + mouse.x * 0.35;
    camera.position.set(target.x + Math.cos(a) * radius, 50 + scroll * 60 - mouse.y * 20, target.z + Math.sin(a) * radius);
    const look = target.clone();
    if (!isMobile) {
      const right = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a));
      look.addScaledVector(right, 28);
    }
    camera.lookAt(look);

    ring.rotation.z += dt * 0.6;
    beacon.material.color.setHSL(0.12, 1, 0.65 + Math.sin(clock.elapsedTime * 3) * 0.2);
    cars.forEach((c) => {
      const u = c.userData;
      u.pos += u.speed * dt;
      if (u.pos > 105) u.pos = -105; else if (u.pos < -105) u.pos = 105;
      if (u.alongX) c.position.set(u.pos, 0.2, u.lane); else c.position.set(u.lane, 0.2, u.pos);
    });
    renderer.render(scene, camera);
  }
  frame();
}

/* ---------- Explore: interactive 3D villa ---------- */
function initVilla() {
  const canvas = document.getElementById('villaCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const daySky = new THREE.Color(0x9fd0ff);
  const nightSky = new THREE.Color(0x0b1424);
  scene.background = daySky.clone();
  scene.fog = new THREE.Fog(daySky.clone(), 80, 160);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.5, 400);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x4a6b3a, 0.7);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1d6, 1.1);
  sun.position.set(30, 45, 25);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 140 });
  scene.add(sun);

  const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, ...opts });
  const white = mat(0xf4f1ea);
  const stone = mat(0xcfc6b5);
  const wood = mat(0x8a5a34, { roughness: 0.6 });
  const dark = mat(0x2b2f36, { roughness: 0.5 });
  const glass = mat(0x7fb6d9, { roughness: 0.08, metalness: 0.4, transparent: true, opacity: 0.75, emissive: 0xffc56e, emissiveIntensity: 0 });
  const water = mat(0x2fa8d8, { roughness: 0.1, metalness: 0.3, emissive: 0x0a5f8a, emissiveIntensity: 0.2 });
  const lawn = mat(0x4a7d38, { roughness: 1 });
  const paving = mat(0xb9b3a8);

  const house = new THREE.Group();
  scene.add(house);
  function box(w, h, d, m, x, y, z, shadow = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = shadow; mesh.receiveShadow = true;
    house.add(mesh);
    return mesh;
  }

  // Site
  box(70, 0.4, 56, lawn, 0, -0.2, 0, false);
  box(6, 0.42, 22, paving, -14, -0.18, 17, false); // driveway
  box(26, 0.9, 16, stone, 0, 0.45, 0); // plinth

  // Ground floor
  box(20, 4.2, 12, white, 1, 3, -0.5);
  box(13, 3.4, 0.2, glass, 2.5, 3, 5.6);
  box(0.4, 4.2, 0.4, dark, -4.2, 3, 5.6);
  box(0.4, 4.2, 0.4, dark, 9.2, 3, 5.6);
  box(3, 3.6, 0.3, wood, -6.5, 2.7, 5.55); // main door panel
  box(23, 0.5, 14.5, white, 0, 5.35, 0.2); // first slab

  // First floor (cantilevered)
  box(17, 4, 11, white, -3, 7.6, -0.5);
  box(10, 3, 0.2, glass, -5, 7.6, 5.05);
  box(5, 4, 0.4, wood, 3.3, 7.6, 5.1); // wood cladding
  box(0.2, 3, 7, glass, -11.55, 7.6, -0.5);
  box(19, 0.5, 13, white, -3, 9.85, -0.2); // roof slab
  box(8, 1.4, 0.15, glass, 6, 6.3, 5.9); // terrace railing
  box(6, 0.2, 7, dark, 7.5, 10.2, -1); // solar panels on roof
  [-1, 2].forEach((dz) => box(0.15, 0.6, 0.15, dark, 7.5, 9.95, dz));

  // Pool + deck
  box(14, 0.3, 9, paving, 10, 0.15, 13);
  const pool = box(10, 0.32, 5.5, water, 10, 0.2, 13.2, false);

  // Boundary wall
  box(70, 1.6, 0.6, stone, 0, 0.8, -27.7);
  box(0.6, 1.6, 56, stone, -34.7, 0.8, 0);
  box(0.6, 1.6, 56, stone, 34.7, 0.8, 0);
  box(44, 1.6, 0.6, stone, 13, 0.8, 27.7);

  // Trees
  const trunk = mat(0x6b4a2e);
  const leaf = mat(0x2f6a30);
  [[-26, -18], [-24, 10], [24, -16], [27, 4], [-8, -20], [8, -21], [20, 22], [-27, 22]].forEach(([x, z], i) => {
    box(0.6, 3, 0.6, trunk, x, 1.5, z);
    const top = new THREE.Mesh(i % 2 ? new THREE.SphereGeometry(2.6, 16, 12) : new THREE.ConeGeometry(2.4, 6, 12), leaf);
    top.position.set(x, i % 2 ? 4.8 : 5.5, z);
    top.castShadow = true;
    house.add(top);
  });

  // Garden lamps
  const lampGlow = new THREE.MeshStandardMaterial({ color: 0xfff1c4, emissive: 0xffc56e, emissiveIntensity: 0 });
  const lampLights = [];
  [[-10, 9], [-18, 9], [-10, 24], [-18, 24], [3, 10]].forEach(([x, z], i) => {
    box(0.25, 2.2, 0.25, dark, x, 1.1, z);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), lampGlow);
    bulb.position.set(x, 2.4, z);
    house.add(bulb);
    if (i < 2) {
      const l = new THREE.PointLight(0xffc56e, 0, 22, 2);
      l.position.set(x, 2.6, z);
      scene.add(l); lampLights.push(l);
    }
  });
  const interior = new THREE.PointLight(0xffc56e, 0, 30, 2);
  interior.position.set(0, 5, 2);
  scene.add(interior);

  // Orbit controls (hand-rolled to avoid another dependency)
  const orbit = { theta: 0.7, phi: 1.12, radius: 58, tTheta: 0.7, tPhi: 1.12, tRadius: 58 };
  let dragging = false; let lastX = 0; let lastY = 0;
  let autoRotate = !reduceMotion;
  canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    orbit.tTheta -= (e.clientX - lastX) * 0.008;
    orbit.tPhi = Math.min(1.42, Math.max(0.35, orbit.tPhi - (e.clientY - lastY) * 0.006));
    lastX = e.clientX; lastY = e.clientY;
  });
  const endDrag = () => { dragging = false; };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    orbit.tRadius = Math.min(90, Math.max(28, orbit.tRadius + e.deltaY * 0.04));
  }, { passive: false });

  // Day / night
  let night = 0; let nightTarget = 0;
  const dnBtn = document.getElementById('dayNightBtn');
  dnBtn.addEventListener('click', () => {
    nightTarget = nightTarget ? 0 : 1;
    dnBtn.textContent = nightTarget ? '☀️ Day View' : '🌙 Night View';
  });
  const arBtn = document.getElementById('autoRotateBtn');
  arBtn.addEventListener('click', () => {
    autoRotate = !autoRotate;
    arBtn.textContent = autoRotate ? '⏸ Pause Rotation' : '▶ Auto Rotate';
  });
  if (!autoRotate) arBtn.textContent = '▶ Auto Rotate';

  let visible = false;
  whenVisible(canvas, (v) => { visible = v; });
  const clock = new THREE.Clock();
  const lookAt = new THREE.Vector3(0, 4, 2);

  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible) return;
    fitRenderer(renderer, camera, canvas);
    if (autoRotate && !dragging) orbit.tTheta += dt * 0.18;
    orbit.theta += (orbit.tTheta - orbit.theta) * 0.08;
    orbit.phi += (orbit.tPhi - orbit.phi) * 0.08;
    orbit.radius += (orbit.tRadius - orbit.radius) * 0.08;
    camera.position.set(
      lookAt.x + orbit.radius * Math.sin(orbit.phi) * Math.cos(orbit.theta),
      lookAt.y + orbit.radius * Math.cos(orbit.phi),
      lookAt.z + orbit.radius * Math.sin(orbit.phi) * Math.sin(orbit.theta),
    );
    camera.lookAt(lookAt);

    night += (nightTarget - night) * Math.min(1, dt * 2.5);
    scene.background.copy(daySky).lerp(nightSky, night);
    scene.fog.color.copy(scene.background);
    sun.intensity = 1.1 * (1 - night) + 0.08;
    hemi.intensity = 0.7 * (1 - night) + 0.15;
    glass.emissiveIntensity = night * 0.95;
    lampGlow.emissiveIntensity = night * 2;
    lampLights.forEach((l) => { l.intensity = night * 1.6; });
    interior.intensity = night * 1.4;
    water.emissiveIntensity = 0.2 + night * 0.8;
    pool.position.y = 0.2 + Math.sin(clock.elapsedTime * 2) * 0.02;
    renderer.render(scene, camera);
  }
  frame();
}

/* ---------- Boot ---------- */
let loaderDone = false;
function hideLoader() {
  if (loaderDone) return;
  loaderDone = true;
  document.getElementById('loader').classList.add('done');
  runCounters();
}
if (window.THREE) {
  try {
    initCity();
    initVilla();
  } catch (err) {
    console.error('3D init failed', err);
  }
} else {
  console.warn('Three.js failed to load; 3D scenes disabled.');
}
window.addEventListener('load', () => setTimeout(hideLoader, 400));
setTimeout(hideLoader, 4000); // safety net if some asset hangs
