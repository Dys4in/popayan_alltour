// Función para verificar si la pelota cae en la taza de café (solo para puntuar)
function checkCoffeeCupScore(ball) {
    // Verificar si la pelota está dentro del área de entrada de la taza
    const ballInCupX = ball.x >= coffeeCup.entryX && ball.x <= coffeeCup.entryX + coffeeCup.entryWidth;
    const ballInCupY = ball.y >= coffeeCup.entryY && ball.y <= coffeeCup.entryY + coffeeCup.entryHeight;
    
    // La pelota debe estar cayendo hacia abajo para contar como punto
    const isFalling = ball.dy > 0;
    
    // Verificar que no esté colisionando con los bordes (debe estar dentro limpiamente)
    let isInsideCleanly = true;
    coffeeCup.collisionBoxes.forEach(box => {
        const ballLeft = ball.x - ball.radius;
        const ballRight = ball.x + ball.radius;
        const ballTop = ball.y - ball.radius;
        const ballBottom = ball.y + ball.radius;
        
        // Si la pelota está tocando cualquier borde de colisión, no cuenta
        if (ballRight > box.x && ballLeft < box.x + box.width && 
            ballBottom > box.y && ballTop < box.y + box.height) {
            isInsideCleanly = false;
        }
    });
    
    return ballInCupX && ballInCupY && isFalling && isInsideCleanly;
}// Configuración del canvas
const canvas = document.getElementById('gameCanvas');
canvas.width = 1362;
canvas.height = 720;

const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const notification = document.getElementById('notification');

let score = 0;
let currentLevel = 1;
let totalShots = 0;
let successfulShots = 0;
let angle = 0;
let isCharging = false;
let power = 0;
let maxPower = 100;

// Sistema de colisiones de límites
const boundaries = {
    // Colisión de nube en la parte superior
    cloudBoundary: {
        points: [], // Se generará automáticamente
        height: 60
    },
    // Colisión de piso en la parte inferior
    floorBoundary: {
        y: canvas.height - 40,
        height: 40
    }
};

// Generar puntos de nube para colisión superior
function generateCloudBoundary() {
    const points = [];
    const segments = 20; // Número de segmentos de la nube
    const baseHeight = 40;
    const variation = 20;
    
    for (let i = 0; i <= segments; i++) {
        const x = (canvas.width / segments) * i;
        // Crear forma ondulada usando seno y coseno para simular nubes
        const waveHeight = Math.sin(i * 0.8) * 10 + Math.cos(i * 1.2) * 8;
        const y = baseHeight + variation * Math.sin((i / segments) * Math.PI * 4) + waveHeight;
        points.push({ x, y });
    }
    
    boundaries.cloudBoundary.points = points;
}

// Generar puntos de nube para colisión superior
function generateCloudBoundary() {
    const points = [];
    const segments = 20; // Número de segmentos de la nube
    const baseHeight = 40;
    const variation = 20;
    
    for (let i = 0; i <= segments; i++) {
        const x = (canvas.width / segments) * i;
        // Crear forma ondulada usando seno y coseno para simular nubes
        const waveHeight = Math.sin(i * 0.8) * 10 + Math.cos(i * 1.2) * 8;
        const y = baseHeight + variation * Math.sin((i / segments) * Math.PI * 4) + waveHeight;
        points.push({ x, y });
    }
    
    boundaries.cloudBoundary.points = points;
}

// Función para dibujar la nube superior
function drawCloudBoundary() {
    if (boundaries.cloudBoundary.points.length === 0) return;
    
    ctx.save();
    
    // Crear gradiente para la nube
    const gradient = ctx.createLinearGradient(0, 0, 0, boundaries.cloudBoundary.height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.5, 'rgba(200, 220, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(150, 180, 255, 0.5)');
    
    // Dibujar la forma de nube
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, boundaries.cloudBoundary.points[0].y);
    
    // Dibujar curva suave a través de los puntos de la nube
    for (let i = 0; i < boundaries.cloudBoundary.points.length - 1; i++) {
        const current = boundaries.cloudBoundary.points[i];
        const next = boundaries.cloudBoundary.points[i + 1];
        const controlX = (current.x + next.x) / 2;
        const controlY = (current.y + next.y) / 2;
        
        ctx.quadraticCurveTo(current.x, current.y, controlX, controlY);
    }
    
    // Completar la forma
    const lastPoint = boundaries.cloudBoundary.points[boundaries.cloudBoundary.points.length - 1];
    ctx.lineTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(canvas.width, 0);
    ctx.closePath();
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Agregar borde sutil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
}

// Función para dibujar el piso
function drawFloorBoundary() {
    ctx.save();
    
    // Crear gradiente para el piso
    const gradient = ctx.createLinearGradient(0, boundaries.floorBoundary.y, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(101, 67, 33, 0.9)'); // Marrón oscuro
    gradient.addColorStop(0.3, 'rgba(139, 69, 19, 0.8)'); // Marrón medio
    gradient.addColorStop(1, 'rgba(160, 82, 45, 0.9)'); // Marrón claro
    
    // Dibujar el piso base
    ctx.fillStyle = gradient;
    ctx.fillRect(0, boundaries.floorBoundary.y, canvas.width, boundaries.floorBoundary.height);
    
    // Agregar textura de madera al piso
    ctx.strokeStyle = 'rgba(101, 67, 33, 0.5)';
    ctx.lineWidth = 1;
    
    // Líneas horizontales para simular tablones
    for (let i = 1; i < 4; i++) {
        const y = boundaries.floorBoundary.y + (boundaries.floorBoundary.height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Líneas verticales para simular separaciones entre tablones
    for (let x = 0; x < canvas.width; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, boundaries.floorBoundary.y);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Borde superior del piso
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, boundaries.floorBoundary.y);
    ctx.lineTo(canvas.width, boundaries.floorBoundary.y);
    ctx.stroke();
    
    ctx.restore();
}

// Función mejorada para verificar colisión con la nube superior
function checkCloudCollision(ball) {
    if (boundaries.cloudBoundary.points.length === 0) return false;
    
    // Encontrar el punto de la nube más cercano horizontalmente
    const ballX = ball.x;
    let leftPoint = boundaries.cloudBoundary.points[0];
    let rightPoint = boundaries.cloudBoundary.points[boundaries.cloudBoundary.points.length - 1];
    
    // Encontrar los dos puntos entre los que está la pelota
    for (let i = 0; i < boundaries.cloudBoundary.points.length - 1; i++) {
        const current = boundaries.cloudBoundary.points[i];
        const next = boundaries.cloudBoundary.points[i + 1];
        
        if (ballX >= current.x && ballX <= next.x) {
            leftPoint = current;
            rightPoint = next;
            break;
        }
    }
    
    // Interpolar la altura de la nube en la posición x de la pelota
    const t = (ballX - leftPoint.x) / (rightPoint.x - leftPoint.x);
    const cloudY = leftPoint.y + (rightPoint.y - leftPoint.y) * t;
    
    // Verificar colisión
    if (ball.y - ball.radius <= cloudY) {
        // Ajustar posición de la pelota
        ball.y = cloudY + ball.radius;
        
        // Invertir velocidad vertical con amortiguación
        if (ball.dy < 0) {
            ball.dy = -ball.dy * 0.6;
            
            // Agregar un poco de velocidad horizontal aleatoria para efecto de rebote
            ball.dx += (Math.random() - 0.5) * 2;
        }
        
        return true;
    }
    
    return false;
}

// Función para verificar colisión con el piso
function checkFloorCollision(ball) {
    if (ball.y + ball.radius >= boundaries.floorBoundary.y) {
        // Ajustar posición
        ball.y = boundaries.floorBoundary.y - ball.radius;
        
        // Rebote con amortiguación
        ball.dy = -ball.dy * 0.7;
        ball.dx *= 0.9; // Fricción horizontal
        
        // Si la velocidad es muy baja, detener el movimiento vertical
        if (Math.abs(ball.dy) < 1) {
            ball.dy = 0;
        }
        
        return true;
    }
    
    return false;
}

// Cañón
const cannon = {
    x: 50,
    y: canvas.height - 50,
    width: 70,
    height: 50,
    image: new Image()
};
cannon.image.src= '/static/img/cañon.png';

//bola de pandebono
// Imagen de bagel para las pelotas
const bagelImage = new Image();
bagelImage.src = '/static/img/pandebono.png'; // placeholder, reemplaza con tu imagen


// Balones y taza de café
const balls = [];
const coffeeCup = {
    x: canvas.width - 200,
    y: canvas.height / 2 - 50,
    width: 150,
    height: 130,
    // Área de entrada de la taza (interior donde debe caer la pelota)
    entryX: canvas.width - 187,
    entryY: canvas.height / 2 - 15,
    entryWidth: 95,
    entryHeight: 12, // Área del interior de la taza
    // Colisiones físicas de la taza (bordes sólidos)
    collisionBoxes: [
        // Borde izquierdo
        { x: canvas.width - 197, y: canvas.height / 2 - 27, width: 8, height: 106 },
        // Borde derecho  
        { x: canvas.width - 90, y: canvas.height / 2 - 27, width: 8, height: 106 },
        // Base de la taza
        { x: canvas.width - 190, y: canvas.height / 2 + 77, width: 98, height: 10 },
        // Borde superior izquierdo (parte del borde)
        { x: canvas.width - 197, y: canvas.height / 2 - 37, width: 14, height: 8 },
        // Borde superior derecho (parte del borde)
        { x: canvas.width - 96, y: canvas.height / 2 - 37, width: 14, height: 8 }
    ],
    image: new Image()
};

// Cargar la imagen de la taza desde archivo
coffeeCup.image.src = '/static/img/tasa_aro.png'; // Cambia 'taza.png' por el nombre de tu imagen

// Función para dibujar la taza de café usando imagen
function drawCoffeeCup() {
    // Verificar si la imagen está cargada
    if (coffeeCup.image.complete && coffeeCup.image.naturalWidth !== 0) {
        // Dibujar la imagen de la taza
        ctx.drawImage(coffeeCup.image, coffeeCup.x, coffeeCup.y, coffeeCup.width, coffeeCup.height);
    } else {
        // Si la imagen no está cargada, usar un rectángulo de respaldo
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(coffeeCup.x, coffeeCup.y, coffeeCup.width, coffeeCup.height);
        
        // Dibujar texto indicativo
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('TAZA', coffeeCup.x + coffeeCup.width/2, coffeeCup.y + coffeeCup.height/2);
    }
        
    // Opcional: Dibujar áreas de colisión para debug (descomenta para ver las colisiones)
/*     
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    coffeeCup.collisionBoxes.forEach(box => {
        ctx.strokeRect(box.x, box.y, box.width, box.height);
    });
    
    // Dibujar área de entrada
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.strokeRect(coffeeCup.entryX, coffeeCup.entryY, coffeeCup.entryWidth, coffeeCup.entryHeight);
     */
}



// Obstáculos base
const obstacleImage = new Image();
obstacleImage.src = '/static/img/madera.png';

// Sistema de niveles predefinidos
const levelConfigurations = [
    // Nivel 1 - Tutorial básico
    {
        name: "Primer Tiro al Café",
        obstacles: [
            { x: 400, y: 500, width: 20, height: 100, image: obstacleImage }
        ],
        description: "¡Bienvenido! Mete la pelota en la taza de café."
    },
    
    // Nivel 2 - Obstáculo simple
    {
        name: "Café con Obstáculos",
        obstacles: [
            { x: 300, y: 200, width: 120, height: 20, image: obstacleImage, angle: Math.PI / 6 },
            { x: 500, y: 400, width: 30, height: 150, image: obstacleImage }
        ],
        description: "Evita los obstáculos para llegar al café."
    },
    
    // Nivel 3 - Primer obstáculo giratorio
    {
        name: "Molino Cafetero",
        obstacles: [
            { x: 400, y: 250, width: 20, height: 120, image: obstacleImage, rotating: true, rotationSpeed: 0.03 },
            { x: 600, y: 450, width: 80, height: 15, image: obstacleImage, angle: -Math.PI / 4 }
        ],
        description: "¡Cuidado con el molino giratorio!"
    },
    
    // Nivel 4 - Laberinto simple
    {
        name: "Laberinto de la Cafetería",
        obstacles: [
            { x: 250, y: 100, width: 20, height: 200, image: obstacleImage },
            { x: 450, y: 300, width: 20, height: 200, image: obstacleImage },
            { x: 650, y: 150, width: 20, height: 250, image: obstacleImage },
            { x: 350, y: 50, width: 100, height: 20, image: obstacleImage }
        ],
        description: "Navega hasta la mesa del café."
    },
    
    // Nivel 5 - Obstáculos giratorios múltiples
    {
        name: "Doble Molinillo",
        obstacles: [
            { x: 300, y: 200, width: 15, height: 100, image: obstacleImage, rotating: true, rotationSpeed: 0.04 },
            { x: 500, y: 350, width: 15, height: 120, image: obstacleImage, rotating: true, rotationSpeed: -0.035 },
            { x: 700, y: 150, width: 100, height: 20, image: obstacleImage, angle: Math.PI / 3 }
        ],
        description: "Dos molinillos de café sincronizados, ¡ten cuidado!"
    },
    
    // Nivel 6 - Túnel estrecho
    {
        name: "Pasillo de la Cafetería",
        obstacles: [
            { x: 400, y: 0, width: 25, height: 250, image: obstacleImage },
            { x: 400, y: 350, width: 25, height: 370, image: obstacleImage },
            { x: 600, y: 0, width: 25, height: 200, image: obstacleImage },
            { x: 600, y: 400, width: 25, height: 320, image: obstacleImage }
        ],
        description: "Pasa por el estrecho pasillo de la cafetería."
    },
    
    // Nivel 7 - Obstáculos en cascada
    {
        name: "Escalones del Bar",
        obstacles: [
            { x: 200, y: 500, width: 80, height: 15, image: obstacleImage, rotating: true, rotationSpeed: 0.02 },
            { x: 350, y: 400, width: 80, height: 15, image: obstacleImage, rotating: true, rotationSpeed: -0.025 },
            { x: 500, y: 300, width: 80, height: 15, image: obstacleImage, rotating: true, rotationSpeed: 0.03 },
            { x: 650, y: 200, width: 80, height: 15, image: obstacleImage, rotating: true, rotationSpeed: -0.02 }
        ],
        description: "Escalones giratorios en el bar de café."
    },
    
    // Nivel 8 - Cruz giratoria
    {
        name: "Batidor Gigante",
        obstacles: [
            { x: 450, y: 280, width: 200, height: 15, image: obstacleImage, rotating: true, rotationSpeed: 0.025 },
            { x: 450, y: 280, width: 15, height: 200, image: obstacleImage, rotating: true, rotationSpeed: 0.025 },
            { x: 250, y: 150, width: 60, height: 20, image: obstacleImage, angle: Math.PI / 4 },
            { x: 700, y: 450, width: 60, height: 20, image: obstacleImage, angle: -Math.PI / 4 }
        ],
        description: "Un gran batidor de café bloquea el camino."
    },
    
    // Nivel 9 - Caos controlado
    {
        name: "Caos Cafetero",
        obstacles: [
            { x: 200, y: 300, width: 15, height: 80, image: obstacleImage, rotating: true, rotationSpeed: 0.05 },
            { x: 350, y: 150, width: 60, height: 15, image: obstacleImage, rotating: true, rotationSpeed: -0.04 },
            { x: 500, y: 450, width: 15, height: 100, image: obstacleImage, rotating: true, rotationSpeed: 0.035 },
            { x: 650, y: 250, width: 80, height: 15, image: obstacleImage, rotating: true, rotationSpeed: -0.045 },
            { x: 750, y: 100, width: 20, height: 150, image: obstacleImage },
            { x: 100, y: 100, width: 20, height: 200, image: obstacleImage }
        ],
        description: "¡Múltiples obstáculos en la máquina de café!"
    },
    
    // Nivel 10 - Nivel maestro
    {
        name: "Maestro Barista",
        obstacles: [
            // Gran cruz central giratoria
            { x: 400, y: 280, width: 250, height: 20, image: obstacleImage, rotating: true, rotationSpeed: 0.02 },
            { x: 400, y: 280, width: 20, height: 250, image: obstacleImage, rotating: true, rotationSpeed: 0.02 },
            
            // Molinos laterales
            { x: 150, y: 200, width: 15, height: 120, image: obstacleImage, rotating: true, rotationSpeed: 0.06 },
            { x: 750, y: 350, width: 15, height: 120, image: obstacleImage, rotating: true, rotationSpeed: -0.055 },
            
            // Obstáculos fijos estratégicos
            { x: 600, y: 100, width: 100, height: 25, image: obstacleImage, angle: Math.PI / 6 },
            { x: 550, y: 500, width: 100, height: 25, image: obstacleImage, angle: -Math.PI / 6 },
            
            // Barreras adicionales
            { x: 300, y: 50, width: 25, height: 100, image: obstacleImage },
            { x: 850, y: 450, width: 25, height: 150, image: obstacleImage }
        ],
        description: "¡El desafío final! ¿Serás el maestro barista?"
    }
];

let obstacles = [];
let mousePos = { x: 0, y: 0 };

// Inicializar nivel
function initializeLevel(levelNumber) {
    if (levelNumber > levelConfigurations.length) {
        levelNumber = levelConfigurations.length;
    }
    
    const levelConfig = levelConfigurations[levelNumber - 1];
    obstacles = [...levelConfig.obstacles]; // Copia profunda de los obstáculos
    
    // Reinicializar ángulos de rotación
    obstacles.forEach(obstacle => {
        if (obstacle.rotating) {
            obstacle.rotationAngle = 0;
        }
    });
    
    showNotification(`Nivel ${levelNumber}: ${levelConfig.name}`);
    levelDisplay.textContent = `Nivel: ${levelNumber} - ${levelConfig.name}`;
    
    // Limpiar pelotas existentes
    balls.length = 2;
}

// Dibujo
function drawCannon() {
    ctx.save();
    ctx.translate(cannon.x, cannon.y);
    ctx.rotate(angle);
    ctx.drawImage(cannon.image, -cannon.width / 20, -cannon.height / 20, cannon.width, cannon.height);
    ctx.restore();
}

function drawBalls() {
    balls.forEach(ball => {
        // Verificar si la imagen del bagel está cargada
        if (bagelImage.complete && bagelImage.naturalWidth !== 0) {
            // Dibujar la imagen del bagel centrada en la posición de la pelota
            const imageSize = ball.radius * 5; // El tamaño de la imagen será el diámetro de la pelota
            ctx.drawImage(
                bagelImage, 
                ball.x - ball.radius,  // Posición X (centrada)
                ball.y - ball.radius,  // Posición Y (centrada)
                imageSize,             // Ancho
                imageSize              // Alto
            );
        } else {
            // Si la imagen no está cargada, usar el círculo naranja como respaldo
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 5);
            ctx.fillStyle = 'orange';
            ctx.fill();
            ctx.closePath();
        }
    });
}

/* function drawCoffeeCup() {
    ctx.drawImage(coffeeCup.image, coffeeCup.x, coffeeCup.y, coffeeCup.width, coffeeCup.height);
    
    // Dibujar áreas de colisión para debug (opcional - descomenta para ver las colisiones)
/*     
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    coffeeCup.collisionBoxes.forEach(box => {
        ctx.strokeRect(box.x, box.y, box.width, box.height);
    });
    
    // Dibujar área de entrada
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.strokeRect(coffeeCup.entryX, coffeeCup.entryY, coffeeCup.entryWidth, coffeeCup.entryHeight);
     */

function drawObstacles() {
    obstacles.forEach(obstacle => {
        if (obstacle.image.complete) {
            ctx.save();
            ctx.translate(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
            if (obstacle.rotating) {
                obstacle.rotationAngle = (obstacle.rotationAngle || 0) + obstacle.rotationSpeed;
                ctx.rotate(obstacle.rotationAngle);
            } else if (obstacle.angle) {
                ctx.rotate(obstacle.angle);
            }
            ctx.drawImage(obstacle.image, -obstacle.width / 2, -obstacle.height / 2, obstacle.width, obstacle.height);
            ctx.restore();
        }
    });
}

// Función corregida de colisión
function checkCollision(ball, obstacle) {
    const centerX = obstacle.x + obstacle.width / 2;
    const centerY = obstacle.y + obstacle.height / 2;
    const rotationAngle = obstacle.rotating ? (obstacle.rotationAngle || 0) : (obstacle.angle || 0);

    // Calcular la distancia desde el centro de la pelota al centro del obstáculo
    const dx = ball.x - centerX;
    const dy = ball.y - centerY;
    
    // Rotar el punto de la pelota al sistema de coordenadas del obstáculo
    const rotatedX = dx * Math.cos(-rotationAngle) - dy * Math.sin(-rotationAngle);
    const rotatedY = dx * Math.sin(-rotationAngle) + dy * Math.cos(-rotationAngle);

    // Encontrar el punto más cercano en el rectángulo
    const closestX = Math.max(-obstacle.width / 2, Math.min(obstacle.width / 2, rotatedX));
    const closestY = Math.max(-obstacle.height / 2, Math.min(obstacle.height / 2, rotatedY));

    // Calcular la distancia desde el centro de la pelota al punto más cercano
    const distanceX = rotatedX - closestX;
    const distanceY = rotatedY - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    // Verificar si hay colisión
    if (distanceSquared < ball.radius * ball.radius) {
        // Calcular la normal de colisión en el sistema de coordenadas del obstáculo
        let normalX = distanceX;
        let normalY = distanceY;
        
        // Si la pelota está dentro del rectángulo, empujarla hacia afuera
        if (distanceSquared === 0) {
            // Determinar la dirección más corta para salir
            const overlapX = obstacle.width / 2 + ball.radius - Math.abs(rotatedX);
            const overlapY = obstacle.height / 2 + ball.radius - Math.abs(rotatedY);
            
            if (overlapX < overlapY) {
                normalX = rotatedX > 0 ? 1 : -1;
                normalY = 0;
            } else {
                normalX = 0;
                normalY = rotatedY > 0 ? 1 : -1;
            }
        } else {
            // Normalizar el vector normal
            const distance = Math.sqrt(distanceSquared);
            normalX /= distance;
            normalY /= distance;
        }

        // Rotar la normal de vuelta al sistema de coordenadas del mundo
        const worldNormalX = normalX * Math.cos(rotationAngle) - normalY * Math.sin(rotationAngle);
        const worldNormalY = normalX * Math.sin(rotationAngle) + normalY * Math.cos(rotationAngle);

        // Separar la pelota del obstáculo
        const penetration = ball.radius - Math.sqrt(distanceSquared);
        ball.x += worldNormalX * penetration;
        ball.y += worldNormalY * penetration;

        // Calcular la velocidad relativa
        const relativeVelocityX = ball.dx;
        const relativeVelocityY = ball.dy;

        // Calcular la velocidad relativa en la dirección normal
        const velocityAlongNormal = relativeVelocityX * worldNormalX + relativeVelocityY * worldNormalY;

        // No resolver si los objetos se están separando
        if (velocityAlongNormal > 0) return true;

        // Calcular el coeficiente de restitución
        const restitution = 0.7;

        // Calcular el impulso escalar
        const impulse = -(1 + restitution) * velocityAlongNormal;

        // Aplicar el impulso
        ball.dx += impulse * worldNormalX;
        ball.dy += impulse * worldNormalY;

        // Aplicar fricción
        const friction = 0.3;
        const tangentX = relativeVelocityX - velocityAlongNormal * worldNormalX;
        const tangentY = relativeVelocityY - velocityAlongNormal * worldNormalY;
        const tangentLength = Math.sqrt(tangentX * tangentX + tangentY * tangentY);
        
        if (tangentLength > 0) {
            const tangentNormalizedX = tangentX / tangentLength;
            const tangentNormalizedY = tangentY / tangentLength;
            const frictionImpulse = friction * Math.abs(impulse);
            
            ball.dx -= frictionImpulse * tangentNormalizedX;
            ball.dy -= frictionImpulse * tangentNormalizedY;
        }

        return true;
    }
    
    return false;
}

// Función para verificar colisión con un rectángulo simple
function checkRectangleCollision(ball, rect) {
    // Encontrar el punto más cercano en el rectángulo
    const closestX = Math.max(rect.x, Math.min(ball.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(ball.y, rect.y + rect.height));

    // Calcular la distancia desde el centro de la pelota al punto más cercano
    const distanceX = ball.x - closestX;
    const distanceY = ball.y - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    // Verificar si hay colisión
    if (distanceSquared < ball.radius * ball.radius) {
        // Calcular la normal de colisión
        let normalX = distanceX;
        let normalY = distanceY;
        
        // Si la pelota está dentro del rectángulo, empujarla hacia afuera
        if (distanceSquared === 0) {
            // Determinar la dirección más corta para salir
            const overlapX = rect.width / 2 + ball.radius - Math.abs(ball.x - (rect.x + rect.width / 2));
            const overlapY = rect.height / 2 + ball.radius - Math.abs(ball.y - (rect.y + rect.height / 2));
            
            if (overlapX < overlapY) {
                normalX = ball.x > (rect.x + rect.width / 2) ? 1 : -1;
                normalY = 0;
            } else {
                normalX = 0;
                normalY = ball.y > (rect.y + rect.height / 2) ? 1 : -1;
            }
        } else {
            // Normalizar el vector normal
            const distance = Math.sqrt(distanceSquared);
            normalX /= distance;
            normalY /= distance;
        }

        // Separar la pelota del obstáculo
        const penetration = ball.radius - Math.sqrt(distanceSquared);
        if (penetration > 0) {
            ball.x += normalX * penetration;
            ball.y += normalY * penetration;
        }

        // Calcular la velocidad relativa en la dirección normal
        const velocityAlongNormal = ball.dx * normalX + ball.dy * normalY;

        // No resolver si los objetos se están separando
        if (velocityAlongNormal > 0) return true;

        // Calcular el coeficiente de restitución
        const restitution = 0.6; // Un poco menos rebote para la taza

        // Calcular el impulso escalar
        const impulse = -(1 + restitution) * velocityAlongNormal;

        // Aplicar el impulso
        ball.dx += impulse * normalX;
        ball.dy += impulse * normalY;

        // Aplicar fricción
        const friction = 0.2;
        const tangentX = ball.dx - velocityAlongNormal * normalX;
        const tangentY = ball.dy - velocityAlongNormal * normalY;
        const tangentLength = Math.sqrt(tangentX * tangentX + tangentY * tangentY);
        
        if (tangentLength > 0) {
            const tangentNormalizedX = tangentX / tangentLength;
            const tangentNormalizedY = tangentY / tangentLength;
            const frictionImpulse = friction * Math.abs(impulse);
            
            ball.dx -= frictionImpulse * tangentNormalizedX;
            ball.dy -= frictionImpulse * tangentNormalizedY;
        }

        return true;
    }
    
    return false;
}

// Función para verificar colisión con la taza de café
function checkCoffeeCupCollision(ball) {
    let hasCollision = false;
    
    // Verificar colisión con cada caja de colisión de la taza
    coffeeCup.collisionBoxes.forEach(box => {
        if (checkRectangleCollision(ball, box)) {
            hasCollision = true;
        }
    });
    
    return hasCollision;
}

// Lógica principal de movimiento
function moveBalls() {
    balls.forEach((ball, index) => {
        ball.x += ball.dx;
        ball.y += ball.dy;
        ball.dy += 0.2; // Gravedad

        // Verificar colisión con los nuevos límites
        checkCloudCollision(ball);
        checkFloorCollision(ball);

        // Colisión con bordes del canvas
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.dx *= -0.8;
        }
        if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.dx *= -0.8;
        }

        // Si la pelota toca el suelo, eliminarla
        if (ball.y + ball.radius > canvas.height) {
            balls.splice(index, 1);
            return;
        }

        // Verificar colisiones con obstáculos
        obstacles.forEach(obstacle => {
            checkCollision(ball, obstacle);
        });

        // Verificar colisión con la taza de café (física)
        checkCoffeeCupCollision(ball);

        // Verificar si la pelota cae en la taza de café (puntuación)
        if (checkCoffeeCupScore(ball)) {
            score++;
            scoreDisplay.textContent = `Puntuación: ${score}`;
            balls.splice(index, 1);
            
            // Avanzar al siguiente nivel
            if (currentLevel < levelConfigurations.length) {
                currentLevel++;
                setTimeout(() => initializeLevel(currentLevel), 1000);
                showNotification(`¡Excelente! La pelota cayó en el café. Nivel ${currentLevel}`);
            } else {
                showNotification("¡Felicidades! ¡Has completado todos los niveles de la cafetería!");
            }
        }
    });
}

// Mostrar texto temporal
function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function drawPowerBar() {
    if (!isCharging) return;
    
    // Configuración de la barra
    const barWidth = 200;
    const barHeight = 20;
    const barX = canvas.width / 2 - barWidth / 2;
    const barY = 40;
    
    // Fondo de la barra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(barX - 5, barY - 5, barWidth + 10, barHeight + 10);
    
    // Borde de la barra
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Relleno de la barra (cambia de color según la potencia)
    const fillWidth = (power / maxPower) * barWidth;
    
    // Color dinámico basado en la potencia
    if (power < 30) {
        ctx.fillStyle = '#4CAF50'; // Verde
    } else if (power < 40) {
        ctx.fillStyle = '#FFEB3B'; // Amarillo
    } else if (power < 60) {
        ctx.fillStyle = '#FF9800'; // Naranja
    } else {
        ctx.fillStyle = '#F44336'; // Rojo
    }
    
    ctx.fillRect(barX, barY, fillWidth, barHeight);
    
    // Texto de potencia
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Potencia: ${Math.floor(power)}%`, canvas.width / 2, barY - 10);
    
    // Texto de instrucción
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Mantén presionado para cargar, suelta para disparar', canvas.width / 2, barY + barHeight + 20);
}

// Función para reiniciar nivel actual
function resetLevel() {
    initializeLevel(currentLevel);
}

// Función para ir a un nivel específico (útil para testing)
function goToLevel(levelNumber) {
    if (levelNumber >= 1 && levelNumber <= levelConfigurations.length) {
        currentLevel = levelNumber;
        initializeLevel(currentLevel);
    }
}

// Bucle principal
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCannon();
    drawPowerBar();
    drawBalls();
    drawCoffeeCup();
    drawObstacles();
    moveBalls();
    
    // Incrementar potencia mientras se mantiene presionado
    if (isCharging) {
        power = Math.min(power + 2, maxPower);
    }
    
    requestAnimationFrame(gameLoop);
}

// Eventos
document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
    angle = Math.atan2(mousePos.y - cannon.y, mousePos.x - cannon.x);
});

// Eventos de mouse
canvas.addEventListener('mousedown', (e) => {
    isCharging = true;
    power = 0;
});

canvas.addEventListener('mouseup', () => {
    if (isCharging) {
        // Disparar con la potencia acumulada
        const shootPower = power / 100 * 50; // Convertir porcentaje a velocidad
        
        balls.push({
            x: cannon.x + Math.cos(angle) * cannon.width,
            y: cannon.y + Math.sin(angle) * cannon.width,
            dx: Math.cos(angle) * shootPower,
            dy: Math.sin(angle) * shootPower,
            radius: 12
        });
        
        isCharging = false;
        power = 0;
    }
});

// Eventos de teclado para testing y navegación
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'r':
        case 'R':
            resetLevel();
            break;
        case 'n':
        case 'N':
            if (currentLevel < levelConfigurations.length) {
                currentLevel++;
                initializeLevel(currentLevel);
            }
            break;
        case 'p':
        case 'P':
            if (currentLevel > 1) {
                currentLevel--;
                initializeLevel(currentLevel);
            }
            break;
    }
});

document.getElementById('menuButton').addEventListener('click', () => {
    window.location.href = '/menu/';
});

// Inicializar el juego
initializeLevel(1);
gameLoop();