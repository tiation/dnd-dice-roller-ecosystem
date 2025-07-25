import { RollResult, RollType } from './types';

export class DiceAnimator {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private particles: Particle[] = [];
    private readonly particleCount = 50;
    private readonly particleLifetime = 1000; // milliseconds

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.setupCanvas();
    }

    private setupCanvas() {
        // Make canvas fill its container
        const resizeCanvas = () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    }

    public animateRoll(result: RollResult) {
        // Clear existing particles
        this.particles = [];

        // Create particles based on roll result
        const isCritical = result.criticalSuccess || result.criticalFailure;
        const color = result.criticalSuccess ? '#00ff00' : 
                     result.criticalFailure ? '#ff0000' : 
                     '#ffffff';

        // Create more particles for critical rolls
        const particleCount = isCritical ? this.particleCount * 2 : this.particleCount;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(
                this.canvas.width / 2,
                this.canvas.height / 2,
                color,
                isCritical
            ));
        }

        // Trigger animation
        this.animate();

        // Play sound effect
        this.playSound(result);
    }

    private animate(timestamp = 0) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            particle.update();
            particle.draw(this.ctx);
            return particle.isAlive();
        });

        // Continue animation if there are active particles
        if (this.particles.length > 0) {
            requestAnimationFrame(timestamp => this.animate(timestamp));
        }
    }

    private playSound(result: RollResult) {
        const audio = new Audio();
        
        if (result.criticalSuccess) {
            audio.src = '/sounds/critical-success.mp3';
        } else if (result.criticalFailure) {
            audio.src = '/sounds/critical-failure.mp3';
        } else {
            audio.src = '/sounds/dice-roll.mp3';
        }

        audio.play().catch(e => console.warn('Sound playback failed:', e));
    }
}

class Particle {
    private x: number;
    private y: number;
    private vx: number;
    private vy: number;
    private color: string;
    private alpha: number;
    private lifetime: number;
    private startTime: number;
    private isCritical: boolean;

    constructor(x: number, y: number, color: string, isCritical: boolean) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isCritical = isCritical;
        this.alpha = 1;
        this.lifetime = 1000; // 1 second
        this.startTime = Date.now();

        // Random velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = isCritical ? 10 : 5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }

    update() {
        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Add gravity effect
        this.vy += 0.1;

        // Fade out
        const elapsed = Date.now() - this.startTime;
        this.alpha = 1 - (elapsed / this.lifetime);

        // Add special effects for critical rolls
        if (this.isCritical) {
            this.vx *= 0.99; // Add air resistance
            this.vy *= 0.99;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.isCritical ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isAlive(): boolean {
        return Date.now() - this.startTime < this.lifetime;
    }
}
