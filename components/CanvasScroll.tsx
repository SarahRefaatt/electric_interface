

"use client"
import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Projects from "../components/Projects";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function InteractiveOldPC() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const screenMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
    const isScrollingRef = useRef(false);
    const videoPlaybackRequestedRef = useRef(false);
    const fullscreenVideoTriggeredRef = useRef(false);

    // State for video overlay
    const [showVideo, setShowVideo] = useState(false);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const overlayVideoRef = useRef<HTMLVideoElement>(null);
    const [showProjects, setShowProjects] = useState(false);

    // Create video element with better error handling
    const createVideoElement = useCallback(() => {
        const video = document.createElement("video");
        video.src = "/video.mp4";
        video.loop = false;
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";
        video.crossOrigin = "anonymous";

        video.onerror = () => {
            console.warn("Video failed to load, using fallback texture");
        };

        return video;
    }, []);

    // Initialize video playback
    const initializeVideoPlayback = useCallback(async (video: HTMLVideoElement) => {
        try {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                await playPromise;
                videoPlaybackRequestedRef.current = true;
            }
        } catch (err) {
            console.warn("Autoplay failed, waiting for user interaction:", err);
        }
    }, []);

    // Resume video when user interacts with page
    const resumeVideoOnInteraction = useCallback(() => {
        if (videoRef.current && !videoPlaybackRequestedRef.current) {
            videoRef.current.play().catch(() => { });
            videoPlaybackRequestedRef.current = true;
        }
    }, []);

    // Handle fullscreen video
    const handleFullscreenVideo = useCallback(() => {
        if (fullscreenVideoTriggeredRef.current) return;

        fullscreenVideoTriggeredRef.current = true;

        setShowVideo(true);
    }, []);

    // Handle video end
    const handleVideoEnded = useCallback(() => {
        setShowProjects(true); // Show projects immediately

        if (!videoContainerRef.current) return;

        gsap.to(videoContainerRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                setShowVideo(false);
            },
        });
    }, []);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        document.body.style.overflow = showVideo ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [showVideo]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        document.addEventListener("click", resumeVideoOnInteraction);
        document.addEventListener("touchstart", resumeVideoOnInteraction);
        document.addEventListener("keydown", resumeVideoOnInteraction);

        /* -------------------- Scene -------------------- */
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xF0F0F0); // Light grey background

        /* -------------------- Camera -------------------- */
        const camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        camera.position.set(0, 0.3, 3);

        /* -------------------- Renderer -------------------- */
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        /* -------------------- Lights -------------------- */
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(3, 5, 2);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-3, 2, -2);
        scene.add(fillLight);

        /* -------------------- CRT Monitor Body -------------------- */
        const monitorWidth = 0.6;
        const monitorHeight = 0.5;
        const monitorDepth = 0.35;

        const monitorMesh = new THREE.Mesh(
            new RoundedBoxGeometry(monitorWidth, monitorHeight, monitorDepth, 8, 0.02),
            new THREE.MeshStandardMaterial({
                color: 0xD0D0D0, // Light grey
                metalness: 0.1,
                roughness: 0.9,
            })
        );
        monitorMesh.position.y = 0;
        monitorMesh.castShadow = true;
        monitorMesh.receiveShadow = true;
        scene.add(monitorMesh);

        /* -------------------- Screen Bezel -------------------- */
        const bezelThickness = 0.02;
        const bezelGeometry = new THREE.BoxGeometry(
            monitorWidth - 0.04,
            monitorHeight - 0.15,
            0.001
        );
        const bezelMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080, // Medium grey
            metalness: 0.05,
            roughness: 0.95,
        });
        const bezel = new THREE.Mesh(bezelGeometry, bezelMaterial);
        bezel.position.z = monitorDepth / 2 + 0.02;
        monitorMesh.add(bezel);

        /* -------------------- CRT Screen (Curved) -------------------- */
        const screenWidth = monitorWidth - 0.1;
        const screenHeight = monitorHeight - 0.2;
        const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight, 64, 64);

        const video = createVideoElement();
        videoRef.current = video;

        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.colorSpace = THREE.SRGBColorSpace;
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;

        const scanlineCanvas = document.createElement('canvas');
        scanlineCanvas.width = 512;
        scanlineCanvas.height = 512;
        const ctx = scanlineCanvas.getContext('2d')!;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let y = 0; y < scanlineCanvas.height; y += 2) {
            ctx.fillRect(0, y, scanlineCanvas.width, 1);
        }
        const scanlineTexture = new THREE.CanvasTexture(scanlineCanvas);

        const screenMaterial = new THREE.ShaderMaterial({
            uniforms: {
                videoTexture: { value: videoTexture },
                scanlineTexture: { value: scanlineTexture },
                time: { value: 0 },
                emissiveIntensity: { value: 0.1 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D videoTexture;
                uniform sampler2D scanlineTexture;
                uniform float time;
                uniform float emissiveIntensity;
                varying vec2 vUv;
                
                void main() {
                    vec4 videoColor = texture2D(videoTexture, vUv);
                    vec4 scanline = texture2D(scanlineTexture, vec2(vUv.x, vUv.y + time * 0.1));
                    
                    float gray = dot(videoColor.rgb, vec3(0.299, 0.587, 0.114));
                    vec3 crtColor = vec3(gray * 0.8, gray * 0.9, gray * 0.7);
                    
                    crtColor *= (0.9 + 0.1 * scanline.r);
                    
                    float dist = distance(vUv, vec2(0.5, 0.5));
                    float vignette = 1.0 - dist * 0.5;
                    crtColor *= vignette;
                    
                    crtColor += crtColor * emissiveIntensity;
                    
                    gl_FragColor = vec4(crtColor, 1.0);
                }
            `,
            transparent: false
        });

        screenMaterialRef.current = screenMaterial;

        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = monitorDepth / 2 + 0.022;
        monitorMesh.add(screen);

        /* -------------------- Monitor Base/Stand -------------------- */
        const baseGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.05, 16);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0xB0B0B0, // Light grey
            metalness: 0.1,
            roughness: 0.85,
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -monitorHeight / 2 - 0.1;
        base.castShadow = true;
        monitorMesh.add(base);

        const neckGeometry = new THREE.CylinderGeometry(0.04, 0.06, 0.12, 8);
        const neck = new THREE.Mesh(neckGeometry, baseMaterial);
        neck.position.y = -monitorHeight / 2 - 0.05;
        neck.castShadow = true;
        monitorMesh.add(neck);

        /* -------------------- Detailed Buttons & Controls -------------------- */
        const buttonMaterial = new THREE.MeshStandardMaterial({
            color: 0xA0A0A0, // Light grey
            metalness: 0.2,
            roughness: 0.6,
        });

        const darkerButtonMaterial = buttonMaterial.clone();
        darkerButtonMaterial.color = new THREE.Color(0x909090); // Slightly darker grey

        const silverButtonMaterial = buttonMaterial.clone();
        silverButtonMaterial.color = new THREE.Color(0xE0E0E0); // Very light grey
        silverButtonMaterial.metalness = 0.3;

        const powerButtonGeometry = new THREE.CylinderGeometry(0.018, 0.018, 0.02, 16);
        const powerButton = new THREE.Mesh(powerButtonGeometry, silverButtonMaterial);
        powerButton.rotation.x = Math.PI / 2;
        powerButton.position.set(-monitorWidth / 2 + 0.08, -monitorHeight / 2 + 0.15, monitorDepth / 2 + 0.01);
        monitorMesh.add(powerButton);

        const ledGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.01, 8);
        const ledMaterial = new THREE.MeshStandardMaterial({
            color: 0xCCCCCC, // Light grey
            emissive: 0x999999, // Grey
            emissiveIntensity: 0.5
        });
        const led = new THREE.Mesh(ledGeometry, ledMaterial);
        led.position.set(-monitorWidth / 2 + 0.08, -monitorHeight / 2 + 0.18, monitorDepth / 2 + 0.01);
        monitorMesh.add(led);

        const knobGeometry = new THREE.CylinderGeometry(0.012, 0.012, 0.015, 16);
        const knob = new THREE.Mesh(knobGeometry, darkerButtonMaterial);
        knob.rotation.x = Math.PI / 2;
        knob.position.set(monitorWidth / 2 - 0.1, -monitorHeight / 2 + 0.15, monitorDepth / 2 + 0.01);
        monitorMesh.add(knob);

        const brightnessKnob = knob.clone();
        brightnessKnob.position.x = monitorWidth / 2 - 0.06;
        monitorMesh.add(brightnessKnob);

        const smallButtonGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.015, 12);
        const buttonSpacing = 0.04;

        for (let i = 0; i < 4; i++) {
            const button = new THREE.Mesh(smallButtonGeometry, buttonMaterial);
            button.rotation.x = Math.PI / 2;
            button.position.set(
                monitorWidth / 2 - 0.15 + (i * buttonSpacing),
                -monitorHeight / 2 + 0.08,
                monitorDepth / 2 + 0.01
            );
            monitorMesh.add(button);
        }

        const logoGeometry = new THREE.BoxGeometry(0.12, 0.03, 0.005);
        const logoMaterial = new THREE.MeshStandardMaterial({
            color: 0x707070, // Medium grey
            metalness: 0.4,
            roughness: 0.3,
        });
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.set(0, -monitorHeight / 2 + 0.05, monitorDepth / 2 + 0.01);
        monitorMesh.add(logo);

        /* -------------------- Keyboard -------------------- */
        const keyboardWidth = 0.5;
        const keyboardHeight = 0.02;
        const keyboardDepth = 0.2;

        const keyboardGeometry = new THREE.BoxGeometry(keyboardWidth, keyboardHeight, keyboardDepth);
        const keyboardMaterial = new THREE.MeshStandardMaterial({
            color: 0xC0C0C0, // Light grey
            metalness: 0.05,
            roughness: 0.9,
        });
        const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
        keyboard.position.set(0, -0.6, 0.3);
        keyboard.rotation.x = -0.1;
        keyboard.castShadow = true;
        keyboard.receiveShadow = true;
        scene.add(keyboard);

        const keyRows = 4;
        const keysPerRow = 12;
        const keyWidth = 0.03;
        const keyHeight = 0.01;
        const keyDepth = 0.01;
        const keySpacing = 0.035;
        const rowSpacing = 0.025;

        const keyGeometry = new THREE.BoxGeometry(keyWidth, keyHeight, keyDepth);
        const keyMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080, // Medium grey
            metalness: 0.1,
            roughness: 0.85,
        });

        for (let row = 0; row < keyRows; row++) {
            for (let col = 0; col < keysPerRow; col++) {
                const key = new THREE.Mesh(keyGeometry, keyMaterial);
                key.position.set(
                    (col - keysPerRow / 2 + 0.5) * keySpacing,
                    keyboard.position.y + keyboardHeight / 2 + keyHeight / 2 + 0.001,
                    keyboard.position.z + (row - keyRows / 2 + 0.5) * rowSpacing
                );
                key.castShadow = true;
                scene.add(key);
            }
        }

        const spacebarGeometry = new THREE.BoxGeometry(0.15, 0.008, 0.025);
        const spacebar = new THREE.Mesh(spacebarGeometry, keyMaterial);
        spacebar.position.set(0, keyboard.position.y + keyboardHeight / 2 + 0.008 / 2 + 0.001, keyboard.position.z + 0.08);
        spacebar.castShadow = true;
        scene.add(spacebar);

        /* -------------------- Mouse -------------------- */
        const mouseGeometry = new THREE.SphereGeometry(0.025, 16, 16);
        mouseGeometry.scale(1.5, 0.7, 1);
        const mouseMaterial = new THREE.MeshStandardMaterial({
            color: 0xB0B0B0, // Light grey
            metalness: 0.1,
            roughness: 0.85,
        });
        const mouse = new THREE.Mesh(mouseGeometry, mouseMaterial);
        mouse.position.set(0.3, -0.58, 0.15);
        mouse.castShadow = true;
        scene.add(mouse);

        const cableCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.3, -0.58, 0.15),
            new THREE.Vector3(0.2, -0.7, 0.1),
            new THREE.Vector3(0.1, -0.8, -0.1),
            new THREE.Vector3(0, -0.9, -0.3),
        ]);

        const cableGeometry = new THREE.TubeGeometry(cableCurve, 20, 0.005, 8, false);
        const cableMaterial = new THREE.MeshStandardMaterial({
            color: 0x707070, // Medium grey
            metalness: 0.05,
            roughness: 0.95,
        });
        const cable = new THREE.Mesh(cableGeometry, cableMaterial);
        scene.add(cable);

        /* -------------------- Desk Surface -------------------- */
        const deskWidth = 4;
        const deskDepth = 2;
        const deskThickness = 0.05;

        const deskGeometry = new THREE.BoxGeometry(deskWidth, deskThickness, deskDepth);
        const deskMaterial = new THREE.MeshStandardMaterial({
            color: 0xE0E0E0, // Very light grey
            metalness: 0,
            roughness: 0.7,
        });
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.set(0, -0.9, 0);
        desk.receiveShadow = true;
        scene.add(desk);

        const deskTextureCanvas = document.createElement('canvas');
        deskTextureCanvas.width = 256;
        deskTextureCanvas.height = 256;
        const deskCtx = deskTextureCanvas.getContext('2d')!;
        deskCtx.fillStyle = '#E0E0E0'; // Very light grey
        deskCtx.fillRect(0, 0, 256, 256);
        deskCtx.strokeStyle = 'rgba(180, 180, 180, 0.1)'; // Light grey
        deskCtx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 256;
            deskCtx.beginPath();
            deskCtx.moveTo(x, 0);
            deskCtx.bezierCurveTo(
                x + 20, 50,
                x - 20, 150,
                x, 256
            );
            deskCtx.stroke();
        }
        const deskTexture = new THREE.CanvasTexture(deskTextureCanvas);
        deskMaterial.map = deskTexture;

        /* -------------------- CRT Screen Glow Effect -------------------- */
        const screenGlowGeometry = new THREE.PlaneGeometry(screenWidth + 0.02, screenHeight + 0.02);
        const screenGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0xAAAAAA, // Light grey
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        const screenGlow = new THREE.Mesh(screenGlowGeometry, screenGlowMaterial);
        screenGlow.position.z = monitorDepth / 2 + 0.021;
        monitorMesh.add(screenGlow);

        /* -------------------- Scroll Animation -------------------- */
        const screenEmissiveIntensity = { value: 0.1 };
        let scrollTriggerInstance: ScrollTrigger | null = null;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "+=200%",
                scrub: 1.5,
                pin: container,
                pinSpacing: false,
                onEnter: () => {
                    isScrollingRef.current = true;
                    if (videoRef.current && videoRef.current.paused) {
                        videoRef.current.play().catch(() => { });
                    }
                },
                onLeaveBack: () => {
                    isScrollingRef.current = false;
                },
                onUpdate: (self) => {
                    if (
                        self.progress >= 0.999 &&
                        !fullscreenVideoTriggeredRef.current
                    ) {
                        handleFullscreenVideo();
                    }
                },

                onEnterBack: () => { },
            },
        });

        tl.to(camera.position, {
            z: 1.2,
            y: 0.1,
            ease: "power2.out"
        })
            .to(camera, {
                fov: 25,
                onUpdate: () => camera.updateProjectionMatrix(),
                ease: "power2.out"
            }, 0)
            .to(monitorMesh.rotation, {
                y: Math.PI * 0.2,
                x: -0.05,
                ease: "power2.out"
            }, 0)
            .to(screenEmissiveIntensity, {
                value: 0.3,
                ease: "power2.out"
            }, 0);

        const SCROLL_TRIGGER_ID = 'my-trigger';
        scrollTriggerInstance = ScrollTrigger.getById(SCROLL_TRIGGER_ID)!;

        /* -------------------- Mouse Interaction -------------------- */
        let mouseX = 0;
        let mouseY = 0;
        const onMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 0.2;
        };
        window.addEventListener("mousemove", onMouseMove);

        /* -------------------- Resize Handler -------------------- */
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", onResize);

        initializeVideoPlayback(video);

        /* -------------------- Animation Loop -------------------- */
        const clock = new THREE.Clock();
        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            monitorMesh.rotation.y += (mouseX - monitorMesh.rotation.y) * 0.05;
            monitorMesh.rotation.x += (-mouseY - monitorMesh.rotation.x) * 0.05;

            monitorMesh.position.y = Math.sin(time * 0.5) * 0.002;
            monitorMesh.rotation.z = Math.sin(time * 0.3) * 0.002;

            ledMaterial.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2;

            if (screenMaterialRef.current) {
                screenMaterialRef.current.uniforms.time.value = time;
                screenMaterialRef.current.uniforms.emissiveIntensity.value = screenEmissiveIntensity.value;
            }

            scanlineTexture.offset.y += delta * 0.5;

            camera.lookAt(monitorMesh.position);
            renderer.render(scene, camera);
        };
        animate();

        /* -------------------- Cleanup -------------------- */
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", onResize);
            document.removeEventListener("click", resumeVideoOnInteraction);
            document.removeEventListener("touchstart", resumeVideoOnInteraction);
            document.removeEventListener("keydown", resumeVideoOnInteraction);

            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.src = "";
                videoRef.current.load();
            }

            cancelAnimationFrame(animationId);
            renderer.dispose();

            if (scrollTriggerInstance) {
                scrollTriggerInstance.kill();
            }
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [createVideoElement, initializeVideoPlayback, resumeVideoOnInteraction, handleFullscreenVideo]);

    // Effect for handling overlay video
    useEffect(() => {
        if (!showVideo || !videoContainerRef.current) return;

        // Pause the 3D scene video when fullscreen video plays
        if (videoRef.current) {
            videoRef.current.pause();
        }

        // Fade in overlay - make video cover entire screen
        gsap.fromTo(
            videoContainerRef.current,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    if (overlayVideoRef.current) {
                        overlayVideoRef.current.play().catch(console.warn);
                    }
                }
            }
        );

        // Cleanup when video ends or component unmounts
        return () => {
            // Resume 3D scene video when overlay is closed
            if (videoRef.current && !fullscreenVideoTriggeredRef.current) {
                videoRef.current.play().catch(() => { });
            }
        };
    }, [showVideo]);

    return (
        <div className="relative w-full bg-gradient-to-b from-white to-gray-100">

            {/* Scroll space (controls how long the scroll is) */}
            <div className="h-[200vh]" />

            {/* PINNED SCENE */}
            <div ref={containerRef} className="fixed top-0 left-0 w-full h-screen" />

            {/* HUD */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-gray-600 text-sm font-mono z-10">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gray-500 mr-2 animate-pulse" />
                        <span>POWER</span>
                    </div>
                    <div className="text-gray-400">|</div>
                    <div>VGA DISPLAY ACTIVE</div>
                    <div className="text-gray-400">|</div>
                    <div>60Hz @ 800×600</div>
                </div>

                <div className="mt-4 text-center text-gray-500 text-xs animate-pulse">
                    ↓ SCROLL TO ACTIVATE FULLSCREEN ↓
                </div>
            </div>

            {/* 🔥 TRUE FULLSCREEN VIDEO OVERLAY */}
            {showVideo && (
                <div
                    ref={videoContainerRef}
                    className="fixed inset-0 z-[9999] bg-black w-[100dvw] h-[100dvh]"
                >
                    <video
                        ref={overlayVideoRef}
                        src="/glitch.mp4"
                        muted
                        autoPlay
                        playsInline
                        onEnded={handleVideoEnded}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <section className="relative z-0">
                {showProjects && <Projects />}
            </section>

        </div>
    );
}