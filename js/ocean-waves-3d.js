// ==========================================================================
// 3D Interactive Ocean Waves Canvas
// Hazal Sıla Yılmaz - GMT 458 Web GIS Portfolio
// Mathematical 3D Perspective Wave Mesh with Click Ripple Effects
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('ocean3dCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;

  // Configuration
  const rows = 36;
  const cols = 52;
  let waveTime = 0;
  const ripples = [];
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Mouse interaction for subtle 3D camera tilt
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX - width / 2) * 0.0003;
    mouse.targetY = (e.clientY - height / 2) * 0.0003;
  });

  // Click / Touch ripple generation
  function addRipple(x, y) {
    ripples.push({
      x: x,
      y: y,
      radius: 0,
      maxRadius: Math.max(width, height) * 0.65,
      strength: 32,
      decay: 0.985
    });
  }

  canvas.addEventListener('click', (e) => {
    addRipple(e.clientX, e.clientY);
  });

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      addRipple(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // 3D Projector function (Isometric / Perspective transform)
  function project(x, y, z) {
    const fov = 420;
    const eyeZ = 550;
    const rotX = 0.88 + mouse.y;
    const rotY = 0.0 + mouse.x;

    // Rotate Y
    const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
    const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);

    // Rotate X
    const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
    const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

    const scale = fov / (eyeZ + z2);
    const screenX = width / 2 + x1 * scale;
    const screenY = height * 0.58 + y2 * scale;

    return { x: screenX, y: screenY, scale: scale, depth: z2 };
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Deep ocean gradient background
    const bgGrad = ctx.createRadialGradient(
      width / 2, height * 0.35, 50,
      width / 2, height * 0.6, Math.max(width, height)
    );
    bgGrad.addColorStop(0, '#041d3d');
    bgGrad.addColorStop(0.5, '#020e21');
    bgGrad.addColorStop(1, '#010610');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Update smooth camera tilt
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Update Ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rip = ripples[i];
      rip.radius += 5.5;
      rip.strength *= rip.decay;
      if (rip.strength < 0.2 || rip.radius > rip.maxRadius) {
        ripples.splice(i, 1);
      }
    }

    waveTime += 0.024;

    // Grid coordinates
    const spacingX = 28;
    const spacingZ = 24;
    const startX = -((cols - 1) * spacingX) / 2;
    const startZ = -((rows - 1) * spacingZ) / 2;

    const points = [];

    for (let r = 0; r < rows; r++) {
      points[r] = [];
      const z = startZ + r * spacingZ;

      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacingX;

        // Base 3D ocean swell equations
        let waveHeight = 
          Math.sin(x * 0.012 + waveTime * 1.4) * 16 +
          Math.cos(z * 0.018 - waveTime * 1.8) * 18 +
          Math.sin((x + z) * 0.008 + waveTime * 0.8) * 10;

        // Add interactive ripple influences
        for (let rip of ripples) {
          const dx = x - (rip.x - width / 2);
          const dz = z - (rip.y - height * 0.6);
          const dist = Math.sqrt(dx * dx + dz * dz);
          const diff = dist - rip.radius;
          if (Math.abs(diff) < 90) {
            waveHeight += Math.cos(diff * 0.08) * rip.strength * 1.2;
          }
        }

        const proj = project(x, -waveHeight, z);
        points[r][c] = proj;
      }
    }

    // Render 3D Ocean Wave Mesh Lines
    for (let r = 0; r < rows; r++) {
      ctx.beginPath();
      const alpha = 0.15 + (r / rows) * 0.75;
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.55})`;
      ctx.lineWidth = 1 + (r / rows) * 1.2;

      for (let c = 0; c < cols; c++) {
        const pt = points[r][c];
        if (c === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.stroke();
    }

    // Connect vertical mesh lines for 3D water surface feel
    ctx.lineWidth = 0.8;
    for (let c = 0; c < cols; c += 2) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(20, 184, 166, 0.22)`;
      for (let r = 0; r < rows; r++) {
        const pt = points[r][c];
        if (r === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.stroke();
    }

    // Draw bright crest nodes on active peaks
    for (let r = 4; r < rows; r += 3) {
      for (let c = 4; c < cols; c += 3) {
        const pt = points[r][c];
        const distFromCenter = Math.abs(c - cols / 2);
        if (distFromCenter < 18) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.8 * pt.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(94, 234, 212, 0.85)`;
          ctx.fill();
        }
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
});
