// Configuration
const CONFIG = {
    particleCount: 150,
    targetName: 'YÊU EM', // Thay đổi tên người bạn yêu ở đây
    newYearDate: new Date('2026-01-01T00:00:00').getTime(),
    photos: [
        // Thêm ảnh của bạn ở đây - format: { url: 'đường_dẫn_ảnh', memory: 'lời nhắn' }
        { url: 'My Documents [31-12-2025 23_26]/b67f62e9723ffd61a42e1.jpg', memory: 'Khoảnh khắc đẹp đẽ của chúng ta ❤️' },
        { url: 'My Documents [31-12-2025 23_26]/fe5ea3c8b31e3c40650f2.jpg', memory: 'Nụ cười em luôn làm anh tan chảy 💕' },
        { url: 'My Documents [31-12-2025 23_26]/045adbdfcb0944571d183.jpg', memory: 'Ngày đầu tiên chúng ta gặp nhau... Anh sẽ không bao giờ quên ✨' },
        { url: 'My Documents [31-12-2025 23_26]/ebaba2f4b3223c7c65334.jpg', memory: 'Em đẹp nhất khi em cười 😊' },
        { url: 'My Documents [31-12-2025 23_26]/eda034e42532aa6cf3235.jpg', memory: 'Kỷ niệm đáng nhớ bên em 💫' },
        { url: 'My Documents [31-12-2025 23_26]/e74c567047a6c8f891b76.jpg', memory: 'Những giây phút hạnh phúc nhất của anh 🌟' },
        { url: 'My Documents [31-12-2025 23_26]/e65c406d51bbdee587aa7.jpg', memory: 'Mỗi khoảnh khắc bên em đều quý giá 💖' },
        { url: 'My Documents [31-12-2025 23_26]/8215f439e5ef6ab133fe8.jpg', memory: 'Yêu em nhiều lắm! 💗' },
        { url: 'My Documents [31-12-2025 23_26]/67e7a40db5db3a8563ca9.jpg', memory: 'Chuyến đi đáng nhớ cùng em 🌸' },
        { url: 'My Documents [31-12-2025 23_26]/c670919e80480f16565910.jpg', memory: 'Em là ánh sáng trong cuộc đời anh ☀️' },
        { url: 'My Documents [31-12-2025 23_26]/8f04e0d7f1017e5f271011.jpg', memory: 'Những phút giây tuyệt vời bên em 🌺' },
        { url: 'My Documents [31-12-2025 23_26]/5c7e76b9676fe831b17e12.jpg', memory: 'Hạnh phúc là được ở bên em 💝' },
        { url: 'My Documents [31-12-2025 23_26]/46805a3b4bedc4b39dfc13.jpg', memory: 'Kỷ niệm ngọt ngào của đôi ta 🎀' },
        { url: 'My Documents [31-12-2025 23_26]/7b4800e011369e68c72714.jpg', memory: 'Mãi yêu em như ngày đầu tiên 💞' },
        { url: 'My Documents [31-12-2025 23_26]/2536b280a3562c08754715.jpg', memory: 'Em là người anh yêu nhất ❣️' },
        { url: 'My Documents [31-12-2025 23_26]/0b1cf39fe2496d17345816.jpg', memory: 'Cùng nhau tạo nên kỷ niệm đẹp 🌹' },
        { url: 'My Documents [31-12-2025 23_26]/9397e8fdfe2b7175283a17.jpg', memory: 'Hoàng hôn cùng em thật lãng mạn 🌅' },
        { url: 'My Documents [31-12-2025 23_26]/15e20c8e1a589506cc4918.jpg', memory: 'Tay trong tay, trái tim gần nhau 💏' },
    ]
};

// Three.js Scene Setup
let scene, camera, renderer, particles = [];
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let isForming = false;
let heartPositions = [];
let namePositions = [];
let currentMode = 'scatter'; // 'scatter', 'heart', 'name'
let fireworksTriggered = false;
let clickCount = 0; // Đếm số lần click
let heartBeatScale = 1; // Hiệu ứng tim đập

const canvas = document.getElementById('canvas');

function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 500;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create particles
    createParticles();

    // Generate heart positions
    heartPositions = generateHeartShape(CONFIG.particleCount);
    console.log('Số vị trí trái tim:', heartPositions.length);

    // Generate name positions
    namePositions = generateNameShape(CONFIG.targetName, CONFIG.particleCount);
    console.log('Số vị trí tên:', namePositions.length);
    console.log('Tổng số particles:', CONFIG.particleCount);

    // Event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onMouseClick);
    window.addEventListener('resize', onWindowResize);

    // Start countdown
    startCountdown();

    // Setup modals
    setupModals();

    // Animation loop
    animate();
}

function createParticles() {
    const textureLoader = new THREE.TextureLoader();

    for (let i = 0; i < CONFIG.particleCount; i++) {
        let particle;

        // Assign photo if available - TẠO HÌNH ẢNH THẬT
        if (i < CONFIG.photos.length) {
            // Responsive: ảnh nhỏ hơn trên mobile
            const isMobile = window.innerWidth < 768;
            const photoSize = isMobile ? 25 : 40; // Mobile: 25, Desktop: 40

            // Tạo plane geometry để hiển thị ảnh
            const geometry = new THREE.PlaneGeometry(photoSize, photoSize);

            // Load texture từ ảnh
            const texture = textureLoader.load(
                CONFIG.photos[i].url,
                // onLoad callback
                function(loadedTexture) {
                    console.log('Đã load ảnh:', CONFIG.photos[i].url);
                },
                // onProgress callback
                undefined,
                // onError callback
                function(err) {
                    console.error('Lỗi load ảnh:', CONFIG.photos[i].url, err);
                }
            );

            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide
            });

            particle = new THREE.Mesh(geometry, material);

            particle.userData.photo = CONFIG.photos[i];
            particle.userData.hasPhoto = true;
            particle.userData.isPhotoSprite = true;
        } else {
            // Các ngôi sao còn lại - hình cầu nhỏ
            const geometry = new THREE.SphereGeometry(2, 8, 8);
            const colors = [0xffd97d, 0xe8b4a0, 0xffc2d1, 0xffffff, 0x6c98e8];
            const color = colors[Math.floor(Math.random() * colors.length)];

            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            });

            particle = new THREE.Mesh(geometry, material);
        }

        // Random starting position
        particle.position.x = (Math.random() - 0.5) * 1000;
        particle.position.y = (Math.random() - 0.5) * 1000;
        particle.position.z = (Math.random() - 0.5) * 400;

        // Store original position
        particle.userData.originalPos = {
            x: particle.position.x,
            y: particle.position.y,
            z: particle.position.z
        };

        // Random velocity
        particle.userData.velocity = {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5,
            z: (Math.random() - 0.5) * 0.5
        };

        scene.add(particle);
        particles.push(particle);
    }
}

function generateHeartShape(count) {
    const positions = [];
    // Responsive: nhỏ hơn trên mobile
    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 15 : 25; // Mobile: 15, Desktop: 25

    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;

        // Heart equation
        const x = scale * 16 * Math.pow(Math.sin(t), 3);
        const y = scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        positions.push({
            x: x,
            y: y - 20,
            z: (Math.random() - 0.5) * 30
        });
    }

    // Đảm bảo đủ vị trí cho tất cả particles
    while (positions.length < count) {
        positions.push({
            x: 0,
            y: 0,
            z: 0
        });
    }

    return positions;
}

function generateNameShape(text, count) {
    const positions = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 200;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = [];

    for (let y = 0; y < canvas.height; y += 3) {
        for (let x = 0; x < canvas.width; x += 3) {
            const index = (y * canvas.width + x) * 4;
            const brightness = imageData.data[index];

            if (brightness > 128) {
                // Responsive: điều chỉnh theo màn hình
                const isMobile = window.innerWidth < 768;
                const scale = isMobile ? 0.25 : 0.45; // Mobile: 0.25 (nhỏ hơn), Desktop: 0.45

                pixels.push({
                    x: (x - canvas.width / 2) * scale,
                    y: -(y - canvas.height / 2) * scale,
                    z: (Math.random() - 0.5) * 30
                });
            }
        }
    }

    // Sample to match particle count
    const sampledPositions = [];
    const step = Math.max(1, Math.floor(pixels.length / count));

    for (let i = 0; i < count; i++) {
        const index = (i * step) % pixels.length;
        sampledPositions.push(pixels[index] || pixels[0]);
    }

    return sampledPositions;
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    targetX = mouseX * 200;
    targetY = mouseY * 200;

    // KHÔNG tự động tạo hình khi di chuột
    // Chỉ cập nhật vị trí chuột để raycasting
}

function onMouseClick(event) {
    // Raycasting to detect particle clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(mouseX, mouseY);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(particles);

    // Nếu click vào particle có ảnh, hiện modal
    if (intersects.length > 0) {
        const clickedParticle = intersects[0].object;
        if (clickedParticle.userData.hasPhoto) {
            showPhotoModal(clickedParticle.userData.photo);
            return; // Không toggle hình dạng nếu click vào ảnh
        }
    }

    // Click vào vũ trụ (không phải ảnh) -> Cycle qua 3 chế độ
    clickCount++;

    if (clickCount === 1) {
        // Click lần 1: Không làm gì, giữ nguyên vũ trụ
        console.log('Click 1: Vũ trụ ban đầu');
        document.getElementById('instruction').textContent = 'Click thêm 1 lần để xem trái tim đập ❤️';
    } else if (clickCount === 2) {
        // Click lần 2: Hiện trái tim đập
        isForming = true;
        currentMode = 'heart';
        console.log('Click 2: TRÁI TIM ĐẬP');
        document.getElementById('instruction').textContent = 'Click lần nữa để xem lời yêu ✨';
    } else if (clickCount === 3) {
        // Click lần 3: Hiện chữ YÊU EM
        isForming = true;
        currentMode = 'name';
        console.log('Click 3: CHỮ YÊU EM');
        document.getElementById('instruction').textContent = 'Click để quay lại vũ trụ 🌟';
    } else {
        // Click lần 4: Reset về vũ trụ
        isForming = false;
        currentMode = 'scatter';
        clickCount = 0;
        console.log('Click 4: Reset về vũ trụ');
        document.getElementById('instruction').textContent = 'Click để khám phá kỳ diệu ✨';
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Hiệu ứng tim đập - MẠNH HƠN VÀ NHIỀU HIỆU ỨNG HƠN
    if (currentMode === 'heart') {
        // Đập mạnh hơn: từ 0.7 đến 1.3 (thay vì 0.9 đến 1.1)
        const baseScale = 1 + Math.sin(Date.now() * 0.005) * 0.3;
        // Thêm hiệu ứng rung nhẹ
        const pulseEffect = Math.sin(Date.now() * 0.02) * 0.05;
        heartBeatScale = baseScale + pulseEffect;
    } else {
        heartBeatScale = 1;
    }

    particles.forEach((particle, index) => {
        if (isForming) {
            // Nếu là ảnh, ẩn đi khi tạo hình trái tim/chữ
            if (particle.userData.isPhotoSprite) {
                particle.visible = false;
            } else {
                // Chỉ các ngôi sao mới di chuyển tạo hình
                particle.visible = true;
                const targetPos = currentMode === 'heart' ? heartPositions[index] : namePositions[index];

                // Kiểm tra nếu có targetPos
                if (targetPos) {
                    particle.position.x += (targetPos.x - particle.position.x) * 0.05;
                    particle.position.y += (targetPos.y - particle.position.y) * 0.05;
                    particle.position.z += (targetPos.z - particle.position.z) * 0.05;

                    // Áp dụng hiệu ứng tim đập
                    if (currentMode === 'heart') {
                        particle.scale.set(heartBeatScale, heartBeatScale, heartBeatScale);

                        // Thêm hiệu ứng màu sắc đỏ/hồng khi đập
                        const colorIntensity = (heartBeatScale - 0.7) / 0.6; // 0 đến 1
                        particle.material.color.setRGB(
                            1, // Red luôn max
                            0.3 + colorIntensity * 0.4, // Green dao động
                            0.3 + colorIntensity * 0.4  // Blue dao động
                        );
                        particle.material.opacity = 0.8 + colorIntensity * 0.2;
                    } else {
                        particle.scale.set(1, 1, 1);
                        // Reset màu về ban đầu
                        particle.material.opacity = 0.8;
                    }
                }
            }
        } else {
            // Ở chế độ vũ trụ, hiện tất cả (cả ảnh và ngôi sao)
            particle.visible = true;

            // Float around randomly
            particle.position.x += particle.userData.velocity.x;
            particle.position.y += particle.userData.velocity.y;
            particle.position.z += particle.userData.velocity.z;

            // Bounce off edges
            if (Math.abs(particle.position.x) > 500) particle.userData.velocity.x *= -1;
            if (Math.abs(particle.position.y) > 500) particle.userData.velocity.y *= -1;
            if (Math.abs(particle.position.z) > 200) particle.userData.velocity.z *= -1;

            // Reset scale khi không đập
            if (particle.userData.isPhotoSprite) {
                particle.scale.set(1, 1, 1);
            } else {
                particle.scale.set(1, 1, 1);
            }
        }

        // Gentle rotation cho các ngôi sao (không phải ảnh)
        if (!particle.userData.isPhotoSprite) {
            particle.rotation.y += 0.01;
            particle.rotation.x += 0.005;
        } else {
            // Ảnh luôn quay về phía camera (billboard effect)
            particle.lookAt(camera.position);
        }
    });

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Regenerate shapes với kích thước mới
    heartPositions = generateHeartShape(CONFIG.particleCount);
    namePositions = generateNameShape(CONFIG.targetName, CONFIG.particleCount);
    console.log('Đã resize - Tạo lại shapes cho màn hình mới');
}

// Countdown Timer
function startCountdown() {
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = CONFIG.newYearDate - now;

        if (distance < 0 && !fireworksTriggered) {
            // New Year! Trigger fireworks
            triggerNewYear();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Modal Functions
function setupModals() {
    const photoModal = document.getElementById('photo-modal');
    const letterModal = document.getElementById('letter-modal');
    const closeBtn = document.querySelector('.close');

    closeBtn.onclick = function() {
        photoModal.classList.remove('show');
    };

    window.onclick = function(event) {
        if (event.target === photoModal) {
            photoModal.classList.remove('show');
        }
    };
}

function showPhotoModal(photo) {
    const modal = document.getElementById('photo-modal');
    const img = document.getElementById('modal-image');
    const memory = document.getElementById('modal-memory');

    img.src = photo.url;
    memory.textContent = photo.memory;

    modal.classList.add('show');
}

function showLetterModal() {
    const modal = document.getElementById('letter-modal');
    modal.classList.add('show');
}

// Fireworks
function triggerNewYear() {
    fireworksTriggered = true;

    // Hide countdown
    document.getElementById('countdown-container').style.transition = 'opacity 1s';
    document.getElementById('countdown-container').style.opacity = '0';

    // Explode particles
    particles.forEach(particle => {
        const force = 15;
        particle.userData.velocity = {
            x: (Math.random() - 0.5) * force,
            y: (Math.random() - 0.5) * force,
            z: (Math.random() - 0.5) * force
        };
    });

    isForming = false;

    // Start fireworks
    const fireworksCanvas = document.getElementById('fireworks');
    fireworksCanvas.style.display = 'block';
    startFireworks();

    // Show letter after 5 seconds
    setTimeout(() => {
        showLetterModal();
    }, 5000);
}

function startFireworks() {
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];
    const particles = [];

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height * 0.5;
            this.speed = Math.random() * 3 + 5;
            this.angle = Math.PI / 2;
            this.gravity = 0.02;
            this.opacity = 1;
            this.hue = Math.random() * 360;
        }

        update() {
            const dy = this.targetY - this.y;
            this.y += dy * 0.05;

            if (Math.abs(dy) < 5) {
                this.explode();
                return false;
            }
            return true;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
            ctx.fill();
        }

        explode() {
            const particleCount = 100;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(this.x, this.y, this.hue));
            }
        }
    }

    class Particle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.hue = hue + Math.random() * 30 - 15;
            this.velocity = {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8
            };
            this.gravity = 0.1;
            this.friction = 0.98;
            this.opacity = 1;
            this.decay = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.velocity.y += this.gravity;

            this.x += this.velocity.x;
            this.y += this.velocity.y;

            this.opacity -= this.decay;

            return this.opacity > 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
            ctx.fill();
        }
    }

    function animateFireworks() {
        ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.1) {
            fireworks.push(new Firework());
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
            if (!fireworks[i].update()) {
                fireworks.splice(i, 1);
            } else {
                fireworks[i].draw();
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            if (!particles[i].update()) {
                particles.splice(i, 1);
            } else {
                particles[i].draw();
            }
        }

        requestAnimationFrame(animateFireworks);
    }

    animateFireworks();
}

// Initialize on load
window.addEventListener('load', init);
