/* global THREE, gsap */
const bgCanvas = document.getElementById("bgCanvas");
const skillsCanvas = document.getElementById("skillsCanvas");
const themeToggle = document.getElementById("themeToggle");

const themeKey = "portfolio-theme";
const savedTheme = localStorage.getItem(themeKey);
if (savedTheme) {
  document.body.dataset.theme = savedTheme;
  themeToggle.textContent = savedTheme === "light" ? "Dark Mode" : "Light Mode";
} else {
  document.body.dataset.theme = "dark";
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
  document.body.dataset.theme = nextTheme;
  localStorage.setItem(themeKey, nextTheme);
  themeToggle.textContent = nextTheme === "light" ? "Dark Mode" : "Light Mode";
});

const bgScene = new THREE.Scene();
const bgCamera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
bgCamera.position.set(0, 0, 10);

const bgRenderer = new THREE.WebGLRenderer({
  canvas: bgCanvas,
  antialias: true,
  alpha: true,
});
bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
bgRenderer.setSize(window.innerWidth, window.innerHeight);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
bgScene.add(ambient);
const glow = new THREE.PointLight(0x6aa9ff, 1.1, 60);
glow.position.set(6, 4, 8);
bgScene.add(glow);
const accent = new THREE.PointLight(0x8f7bff, 0.7, 40);
accent.position.set(-6, -3, 6);
bgScene.add(accent);

const coreMaterial = new THREE.MeshStandardMaterial({
  color: 0x142238,
  roughness: 0.25,
  metalness: 0.6,
});
const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 1), coreMaterial);
bgScene.add(orb);
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(3.4, 0.2, 32, 120),
  new THREE.MeshStandardMaterial({
    color: 0x6aa9ff,
    emissive: 0x1b2550,
    emissiveIntensity: 0.4,
    roughness: 0.35,
  })
);
ring.rotation.x = Math.PI / 4;
bgScene.add(ring);
const satellite = new THREE.Mesh(
  new THREE.SphereGeometry(0.6, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x8f7bff, roughness: 0.3 })
);
satellite.position.set(-4, 2.5, -1);
bgScene.add(satellite);

const miniScenes = [];

function createMiniScene(canvas, shape) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const light = new THREE.PointLight(0xffffff, 1.1, 20);
  light.position.set(4, 4, 6);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  let geometry;
  switch (shape) {
    case "knot":
      geometry = new THREE.TorusKnotGeometry(1.1, 0.32, 120, 16);
      break;
    case "sphere":
      geometry = new THREE.SphereGeometry(1.2, 32, 32);
      break;
    default:
      geometry = new THREE.TorusGeometry(1.3, 0.35, 24, 64);
  }

  const material = new THREE.MeshStandardMaterial({
    color: 0x6aa9ff,
    roughness: 0.3,
    metalness: 0.5,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  miniScenes.push({ canvas, scene, camera, renderer, mesh, speed: 0.6 });
  resizeMiniScene({ canvas, renderer, camera });
}

function resizeMiniScene({ canvas, renderer, camera }) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width === 0 || height === 0) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

document.querySelectorAll(".project-card").forEach((card) => {
  const canvas = card.querySelector(".card-canvas");
  const shape = canvas.dataset.shape;
  createMiniScene(canvas, shape);
  card.addEventListener("mouseenter", () => {
    const target = miniScenes.find((item) => item.canvas === canvas);
    if (target) target.speed = 1.4;
  });
  card.addEventListener("mouseleave", () => {
    const target = miniScenes.find((item) => item.canvas === canvas);
    if (target) target.speed = 0.6;
  });
});

const skillsScene = new THREE.Scene();
const skillsCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 30);
skillsCamera.position.set(0, 0, 7);
const skillsRenderer = new THREE.WebGLRenderer({
  canvas: skillsCanvas,
  antialias: true,
  alpha: true,
});
skillsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const skillsLight = new THREE.PointLight(0xffffff, 1, 25);
skillsLight.position.set(4, 4, 6);
skillsScene.add(skillsLight);
skillsScene.add(new THREE.AmbientLight(0xffffff, 0.5));

const skillsGroup = new THREE.Group();
const boxMaterial = new THREE.MeshStandardMaterial({
  color: 0x8f7bff,
  roughness: 0.3,
  metalness: 0.6,
});
for (let i = 0; i < 8; i += 1) {
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), boxMaterial);
  const angle = (i / 8) * Math.PI * 2;
  box.position.set(Math.cos(angle) * 2, Math.sin(angle) * 1.2, Math.sin(angle) * 1.5);
  skillsGroup.add(box);
}
skillsScene.add(skillsGroup);

function resizeSkillsScene() {
  const width = skillsCanvas.clientWidth;
  const height = skillsCanvas.clientHeight;
  if (width === 0 || height === 0) return;
  skillsRenderer.setSize(width, height, false);
  skillsCamera.aspect = width / height;
  skillsCamera.updateProjectionMatrix();
}

resizeSkillsScene();

const pointer = { x: 0, y: 0 };
window.addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
});

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const status = contactForm.querySelector(".form-status");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const action = contactForm.getAttribute("action");
    const formData = new FormData(contactForm);

    status.textContent = "Sending...";
    status.style.color = "inherit";

    try {
      const response = await fetch(action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.textContent = "Message sent successfully.";
        status.style.color = "var(--accent)";
        contactForm.reset();
      } else {
        status.textContent = "Could not send. Please try again.";
        status.style.color = "#f97316";
      }
    } catch (error) {
      status.textContent = "Network error. Please try again later.";
      status.style.color = "#f97316";
    }

    gsap.fromTo(
      contactForm,
      { scale: 1 },
      { scale: 1.02, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" }
    );
  });
}

gsap.from(".hero__content", { opacity: 0, y: 30, duration: 1.1, ease: "power3.out" });
const sections = document.querySelectorAll(".section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        });
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

sections.forEach((section) => {
  section.style.opacity = 0;
  section.style.transform = "translateY(20px)";
  observer.observe(section);
});

function animate() {
  requestAnimationFrame(animate);

  orb.rotation.y += 0.003;
  orb.rotation.x += 0.0015;
  ring.rotation.z += 0.002;
  satellite.position.x = -4 + Math.sin(Date.now() * 0.0006) * 0.6;
  satellite.position.y = 2.5 + Math.cos(Date.now() * 0.0008) * 0.4;

  bgCamera.position.x = pointer.x * 0.6;
  bgCamera.position.y = pointer.y * 0.4;
  bgCamera.lookAt(0, 0, 0);
  bgRenderer.render(bgScene, bgCamera);

  miniScenes.forEach((item) => {
    item.mesh.rotation.x += 0.01 * item.speed;
    item.mesh.rotation.y += 0.012 * item.speed;
    item.renderer.render(item.scene, item.camera);
  });

  skillsGroup.rotation.x += 0.004;
  skillsGroup.rotation.y += 0.006;
  skillsRenderer.render(skillsScene, skillsCamera);
}

animate();

window.addEventListener("resize", () => {
  bgCamera.aspect = window.innerWidth / window.innerHeight;
  bgCamera.updateProjectionMatrix();
  bgRenderer.setSize(window.innerWidth, window.innerHeight);
  miniScenes.forEach((item) => resizeMiniScene(item));
  resizeSkillsScene();
});
