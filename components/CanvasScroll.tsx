


// "use client"
// import { useRef, useEffect, useState, useCallback } from "react";
// import * as THREE from "three";
// import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// // import { RoundedBoxGeometry } from "three-stdlib";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Projects from "../components/Projects";

// if (typeof window !== "undefined") {
//     gsap.registerPlugin(ScrollTrigger);
// }

// export default function InteractiveOldPC() {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const videoRef = useRef<HTMLVideoElement | null>(null);
//     const screenMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
//     const isScrollingRef = useRef(false);
//     const videoPlaybackRequestedRef = useRef(false);
//     const fullscreenVideoTriggeredRef = useRef(false);

//     // State for video overlay
//     const [showVideo, setShowVideo] = useState(false);
//     const videoContainerRef = useRef<HTMLDivElement>(null);
//     const overlayVideoRef = useRef<HTMLVideoElement>(null);
//     const [showProjects, setShowProjects] = useState(false);

//     // Create video element with better error handling
//     const createVideoElement = useCallback(() => {
//         const video = document.createElement("video");
//         video.src = "/video.mp4";
//         video.loop = false;
//         video.muted = true;
//         video.playsInline = true;
//         video.preload = "auto";
//         video.crossOrigin = "anonymous";

//         video.onerror = () => {
//             console.warn("Video failed to load, using fallback texture");
//         };

//         return video;
//     }, []);

//     // Initialize video playback
//     const initializeVideoPlayback = useCallback(async (video: HTMLVideoElement) => {
//         try {
//             const playPromise = video.play();
//             if (playPromise !== undefined) {
//                 await playPromise;
//                 videoPlaybackRequestedRef.current = true;
//             }
//         } catch (err) {
//             console.warn("Autoplay failed, waiting for user interaction:", err);
//         }
//     }, []);

//     // Resume video when user interacts with page
//     const resumeVideoOnInteraction = useCallback(() => {
//         if (videoRef.current && !videoPlaybackRequestedRef.current) {
//             videoRef.current.play().catch(() => { });
//             videoPlaybackRequestedRef.current = true;
//         }
//     }, []);

//     // Handle fullscreen video
//     const handleFullscreenVideo = useCallback(() => {
//         if (fullscreenVideoTriggeredRef.current) return;

//         fullscreenVideoTriggeredRef.current = true;

//         setShowVideo(true);
//     }, []);

//     // Handle video end
//     const handleVideoEnded = useCallback(() => {
//         setShowProjects(true); // Show projects immediately

//         if (!videoContainerRef.current) return;

//         gsap.to(videoContainerRef.current, {
//             opacity: 0,
//             duration: 1,
//             ease: "power2.out",
//             onComplete: () => {
//                 setShowVideo(false);
//                 // setShowProjects(true);
//             },
//         });
//     }, []);
//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, []);
//     useEffect(() => {
//         document.body.style.overflow = showVideo ? "hidden" : "";
//         return () => {
//             document.body.style.overflow = "";
//         };
//     }, [showVideo]);

//     useEffect(() => {
//         const container = containerRef.current;
//         if (!container) return;

//         document.addEventListener("click", resumeVideoOnInteraction);
//         document.addEventListener("touchstart", resumeVideoOnInteraction);
//         document.addEventListener("keydown", resumeVideoOnInteraction);

//         /* -------------------- Scene -------------------- */
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0x4A4A4A);

//         /* -------------------- Camera -------------------- */
//         const camera = new THREE.PerspectiveCamera(
//             50,
//             window.innerWidth / window.innerHeight,
//             0.1,
//             100
//         );
//         camera.position.set(0, 0.3, 3);

//         /* -------------------- Renderer -------------------- */
//         const renderer = new THREE.WebGLRenderer({
//             antialias: true,
//             alpha: true,
//             powerPreference: "high-performance"
//         });
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//         renderer.shadowMap.enabled = true;
//         renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//         container.appendChild(renderer.domElement);

//         /* -------------------- Lights -------------------- */
//         scene.add(new THREE.AmbientLight(0xffffff, 0.6));

//         const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
//         mainLight.position.set(3, 5, 2);
//         mainLight.castShadow = true;
//         mainLight.shadow.mapSize.width = 1024;
//         mainLight.shadow.mapSize.height = 1024;
//         scene.add(mainLight);

//         const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
//         fillLight.position.set(-3, 2, -2);
//         scene.add(fillLight);

//         /* -------------------- CRT Monitor Body -------------------- */
//         const monitorWidth = 0.6;
//         const monitorHeight = 0.5;
//         const monitorDepth = 0.35;

//         const monitorMesh = new THREE.Mesh(
//             new RoundedBoxGeometry(monitorWidth, monitorHeight, monitorDepth, 8, 0.02),
//             new THREE.MeshStandardMaterial({
//                 color: 0x404040,
//                 metalness: 0.1,
//                 roughness: 0.9,
//             })
//         );
//         monitorMesh.position.y = 0;
//         monitorMesh.castShadow = true;
//         monitorMesh.receiveShadow = true;
//         scene.add(monitorMesh);

//         /* -------------------- Screen Bezel -------------------- */
//         const bezelThickness = 0.02;
//         const bezelGeometry = new THREE.BoxGeometry(
//             monitorWidth - 0.04,
//             monitorHeight - 0.15,
//             0.001
//         );
//         const bezelMaterial = new THREE.MeshStandardMaterial({
//             color: 0x1a1a1a,
//             metalness: 0.05,
//             roughness: 0.95,
//         });
//         const bezel = new THREE.Mesh(bezelGeometry, bezelMaterial);
//         bezel.position.z = monitorDepth / 2 + 0.02;
//         monitorMesh.add(bezel);

//         /* -------------------- CRT Screen (Curved) -------------------- */
//         const screenWidth = monitorWidth - 0.1;
//         const screenHeight = monitorHeight - 0.2;
//         const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight, 64, 64);

//         const video = createVideoElement();
//         videoRef.current = video;

//         const videoTexture = new THREE.VideoTexture(video);
//         videoTexture.colorSpace = THREE.SRGBColorSpace;
//         videoTexture.minFilter = THREE.LinearFilter;
//         videoTexture.magFilter = THREE.LinearFilter;

//         const scanlineCanvas = document.createElement('canvas');
//         scanlineCanvas.width = 512;
//         scanlineCanvas.height = 512;
//         const ctx = scanlineCanvas.getContext('2d')!;
//         ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
//         for (let y = 0; y < scanlineCanvas.height; y += 2) {
//             ctx.fillRect(0, y, scanlineCanvas.width, 1);
//         }
//         const scanlineTexture = new THREE.CanvasTexture(scanlineCanvas);

//         const screenMaterial = new THREE.ShaderMaterial({
//             uniforms: {
//                 videoTexture: { value: videoTexture },
//                 scanlineTexture: { value: scanlineTexture },
//                 time: { value: 0 },
//                 emissiveIntensity: { value: 0.1 }
//             },
//             vertexShader: `
//                 varying vec2 vUv;
//                 void main() {
//                     vUv = uv;
//                     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//                 }
//             `,
//             fragmentShader: `
//                 uniform sampler2D videoTexture;
//                 uniform sampler2D scanlineTexture;
//                 uniform float time;
//                 uniform float emissiveIntensity;
//                 varying vec2 vUv;

//                 void main() {
//                     vec4 videoColor = texture2D(videoTexture, vUv);
//                     vec4 scanline = texture2D(scanlineTexture, vec2(vUv.x, vUv.y + time * 0.1));

//                     float gray = dot(videoColor.rgb, vec3(0.299, 0.587, 0.114));
//                     vec3 crtColor = vec3(gray * 0.8, gray * 0.9, gray * 0.7);

//                     crtColor *= (0.9 + 0.1 * scanline.r);

//                     float dist = distance(vUv, vec2(0.5, 0.5));
//                     float vignette = 1.0 - dist * 0.5;
//                     crtColor *= vignette;

//                     crtColor += crtColor * emissiveIntensity;

//                     gl_FragColor = vec4(crtColor, 1.0);
//                 }
//             `,
//             transparent: false
//         });

//         screenMaterialRef.current = screenMaterial;

//         const screen = new THREE.Mesh(screenGeometry, screenMaterial);
//         screen.position.z = monitorDepth / 2 + 0.022;
//         monitorMesh.add(screen);

//         /* -------------------- Monitor Base/Stand -------------------- */
//         const baseGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.05, 16);
//         const baseMaterial = new THREE.MeshStandardMaterial({
//             color: 0x303030,
//             metalness: 0.1,
//             roughness: 0.85,
//         });
//         const base = new THREE.Mesh(baseGeometry, baseMaterial);
//         base.position.y = -monitorHeight / 2 - 0.1;
//         base.castShadow = true;
//         monitorMesh.add(base);

//         const neckGeometry = new THREE.CylinderGeometry(0.04, 0.06, 0.12, 8);
//         const neck = new THREE.Mesh(neckGeometry, baseMaterial);
//         neck.position.y = -monitorHeight / 2 - 0.05;
//         neck.castShadow = true;
//         monitorMesh.add(neck);

//         /* -------------------- Detailed Buttons & Controls -------------------- */
//         const buttonMaterial = new THREE.MeshStandardMaterial({
//             color: 0x606060,
//             metalness: 0.2,
//             roughness: 0.6,
//         });

//         const darkerButtonMaterial = buttonMaterial.clone();
//         darkerButtonMaterial.color = new THREE.Color(0x505050);

//         const silverButtonMaterial = buttonMaterial.clone();
//         silverButtonMaterial.color = new THREE.Color(0xd0d0d0);
//         silverButtonMaterial.metalness = 0.3;

//         const powerButtonGeometry = new THREE.CylinderGeometry(0.018, 0.018, 0.02, 16);
//         const powerButton = new THREE.Mesh(powerButtonGeometry, silverButtonMaterial);
//         powerButton.rotation.x = Math.PI / 2;
//         powerButton.position.set(-monitorWidth / 2 + 0.08, -monitorHeight / 2 + 0.15, monitorDepth / 2 + 0.01);
//         monitorMesh.add(powerButton);

//         const ledGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.01, 8);
//         const ledMaterial = new THREE.MeshStandardMaterial({
//             color: 0x00ff00,
//             emissive: 0x003300,
//             emissiveIntensity: 0.5
//         });
//         const led = new THREE.Mesh(ledGeometry, ledMaterial);
//         led.position.set(-monitorWidth / 2 + 0.08, -monitorHeight / 2 + 0.18, monitorDepth / 2 + 0.01);
//         monitorMesh.add(led);

//         const knobGeometry = new THREE.CylinderGeometry(0.012, 0.012, 0.015, 16);
//         const knob = new THREE.Mesh(knobGeometry, darkerButtonMaterial);
//         knob.rotation.x = Math.PI / 2;
//         knob.position.set(monitorWidth / 2 - 0.1, -monitorHeight / 2 + 0.15, monitorDepth / 2 + 0.01);
//         monitorMesh.add(knob);

//         const brightnessKnob = knob.clone();
//         brightnessKnob.position.x = monitorWidth / 2 - 0.06;
//         monitorMesh.add(brightnessKnob);

//         const smallButtonGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.015, 12);
//         const buttonSpacing = 0.04;

//         for (let i = 0; i < 4; i++) {
//             const button = new THREE.Mesh(smallButtonGeometry, buttonMaterial);
//             button.rotation.x = Math.PI / 2;
//             button.position.set(
//                 monitorWidth / 2 - 0.15 + (i * buttonSpacing),
//                 -monitorHeight / 2 + 0.08,
//                 monitorDepth / 2 + 0.01
//             );
//             monitorMesh.add(button);
//         }

//         const logoGeometry = new THREE.BoxGeometry(0.12, 0.03, 0.005);
//         const logoMaterial = new THREE.MeshStandardMaterial({
//             color: 0x202020,
//             metalness: 0.4,
//             roughness: 0.3,
//         });
//         const logo = new THREE.Mesh(logoGeometry, logoMaterial);
//         logo.position.set(0, -monitorHeight / 2 + 0.05, monitorDepth / 2 + 0.01);
//         monitorMesh.add(logo);

//         /* -------------------- Keyboard -------------------- */
//         const keyboardWidth = 0.5;
//         const keyboardHeight = 0.02;
//         const keyboardDepth = 0.2;

//         const keyboardGeometry = new THREE.BoxGeometry(keyboardWidth, keyboardHeight, keyboardDepth);
//         const keyboardMaterial = new THREE.MeshStandardMaterial({
//             color: 0x353535,
//             metalness: 0.05,
//             roughness: 0.9,
//         });
//         const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
//         keyboard.position.set(0, -0.6, 0.3);
//         keyboard.rotation.x = -0.1;
//         keyboard.castShadow = true;
//         keyboard.receiveShadow = true;
//         scene.add(keyboard);

//         const keyRows = 4;
//         const keysPerRow = 12;
//         const keyWidth = 0.03;
//         const keyHeight = 0.01;
//         const keyDepth = 0.01;
//         const keySpacing = 0.035;
//         const rowSpacing = 0.025;

//         const keyGeometry = new THREE.BoxGeometry(keyWidth, keyHeight, keyDepth);
//         const keyMaterial = new THREE.MeshStandardMaterial({
//             color: 0x252525,
//             metalness: 0.1,
//             roughness: 0.85,
//         });

//         for (let row = 0; row < keyRows; row++) {
//             for (let col = 0; col < keysPerRow; col++) {
//                 const key = new THREE.Mesh(keyGeometry, keyMaterial);
//                 key.position.set(
//                     (col - keysPerRow / 2 + 0.5) * keySpacing,
//                     keyboard.position.y + keyboardHeight / 2 + keyHeight / 2 + 0.001,
//                     keyboard.position.z + (row - keyRows / 2 + 0.5) * rowSpacing
//                 );
//                 key.castShadow = true;
//                 scene.add(key);
//             }
//         }

//         const spacebarGeometry = new THREE.BoxGeometry(0.15, 0.008, 0.025);
//         const spacebar = new THREE.Mesh(spacebarGeometry, keyMaterial);
//         spacebar.position.set(0, keyboard.position.y + keyboardHeight / 2 + 0.008 / 2 + 0.001, keyboard.position.z + 0.08);
//         spacebar.castShadow = true;
//         scene.add(spacebar);

//         /* -------------------- Mouse -------------------- */
//         const mouseGeometry = new THREE.SphereGeometry(0.025, 16, 16);
//         mouseGeometry.scale(1.5, 0.7, 1);
//         const mouseMaterial = new THREE.MeshStandardMaterial({
//             color: 0x303030,
//             metalness: 0.1,
//             roughness: 0.85,
//         });
//         const mouse = new THREE.Mesh(mouseGeometry, mouseMaterial);
//         mouse.position.set(0.3, -0.58, 0.15);
//         mouse.castShadow = true;
//         scene.add(mouse);

//         const cableCurve = new THREE.CatmullRomCurve3([
//             new THREE.Vector3(0.3, -0.58, 0.15),
//             new THREE.Vector3(0.2, -0.7, 0.1),
//             new THREE.Vector3(0.1, -0.8, -0.1),
//             new THREE.Vector3(0, -0.9, -0.3),
//         ]);

//         const cableGeometry = new THREE.TubeGeometry(cableCurve, 20, 0.005, 8, false);
//         const cableMaterial = new THREE.MeshStandardMaterial({
//             color: 0x202020,
//             metalness: 0.05,
//             roughness: 0.95,
//         });
//         const cable = new THREE.Mesh(cableGeometry, cableMaterial);
//         scene.add(cable);

//         /* -------------------- Desk Surface -------------------- */
//         const deskWidth = 4;
//         const deskDepth = 2;
//         const deskThickness = 0.05;

//         const deskGeometry = new THREE.BoxGeometry(deskWidth, deskThickness, deskDepth);
//         const deskMaterial = new THREE.MeshStandardMaterial({
//             color: 0x404040,
//             metalness: 0,
//             roughness: 0.7,
//         });
//         const desk = new THREE.Mesh(deskGeometry, deskMaterial);
//         desk.position.set(0, -0.9, 0);
//         desk.receiveShadow = true;
//         scene.add(desk);

//         const deskTextureCanvas = document.createElement('canvas');
//         deskTextureCanvas.width = 256;
//         deskTextureCanvas.height = 256;
//         const deskCtx = deskTextureCanvas.getContext('2d')!;
//         deskCtx.fillStyle = '#404040';
//         deskCtx.fillRect(0, 0, 256, 256);
//         deskCtx.strokeStyle = 'rgba(50, 50, 50, 0.1)';
//         deskCtx.lineWidth = 1;
//         for (let i = 0; i < 20; i++) {
//             const x = Math.random() * 256;
//             deskCtx.beginPath();
//             deskCtx.moveTo(x, 0);
//             deskCtx.bezierCurveTo(
//                 x + 20, 50,
//                 x - 20, 150,
//                 x, 256
//             );
//             deskCtx.stroke();
//         }
//         const deskTexture = new THREE.CanvasTexture(deskTextureCanvas);
//         deskMaterial.map = deskTexture;

//         /* -------------------- CRT Screen Glow Effect -------------------- */
//         const screenGlowGeometry = new THREE.PlaneGeometry(screenWidth + 0.02, screenHeight + 0.02);
//         const screenGlowMaterial = new THREE.MeshBasicMaterial({
//             color: 0x888888,
//             transparent: true,
//             opacity: 0.1,
//             side: THREE.DoubleSide
//         });
//         const screenGlow = new THREE.Mesh(screenGlowGeometry, screenGlowMaterial);
//         screenGlow.position.z = monitorDepth / 2 + 0.021;
//         monitorMesh.add(screenGlow);

//         /* -------------------- Scroll Animation -------------------- */
//         const screenEmissiveIntensity = { value: 0.1 };
//         let scrollTriggerInstance: ScrollTrigger | null = null;

//         const tl = gsap.timeline({
//             scrollTrigger: {
//                 trigger: document.body,
//                 start: "top top",
//                 end: "+=200%",
//                 scrub: 1.5,
//                 pin: container,
//                 pinSpacing: false,
//                 onEnter: () => {
//                     isScrollingRef.current = true;
//                     if (videoRef.current && videoRef.current.paused) {
//                         videoRef.current.play().catch(() => { });
//                     }
//                 },
//                 onLeaveBack: () => {
//                     isScrollingRef.current = false;
//                 },
//                 onUpdate: (self) => {
//                     if (
//                         self.progress >= 0.999 &&
//                         !fullscreenVideoTriggeredRef.current
//                     ) {
//                         handleFullscreenVideo();
//                     }
//                 },

//                 onEnterBack: () => { },
//             },
//         });

//         tl.to(camera.position, {
//             z: 1.2,
//             y: 0.1,
//             ease: "power2.out"
//         })
//             .to(camera, {
//                 fov: 25,
//                 onUpdate: () => camera.updateProjectionMatrix(),
//                 ease: "power2.out"
//             }, 0)
//             .to(monitorMesh.rotation, {
//                 y: Math.PI * 0.2,
//                 x: -0.05,
//                 ease: "power2.out"
//             }, 0)
//             .to(screenEmissiveIntensity, {
//                 value: 0.3,
//                 ease: "power2.out"
//             }, 0);

//         // scrollTriggerInstance = ScrollTrigger.getById(tl.scrollTrigger!.id)!;
//         const SCROLL_TRIGGER_ID = 'my-trigger';

//         scrollTriggerInstance = ScrollTrigger.getById(SCROLL_TRIGGER_ID)!;


//         /* -------------------- Mouse Interaction -------------------- */
//         let mouseX = 0;
//         let mouseY = 0;
//         const onMouseMove = (e: MouseEvent) => {
//             mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
//             mouseY = (e.clientY / window.innerHeight - 0.5) * 0.2;
//         };
//         window.addEventListener("mousemove", onMouseMove);

//         /* -------------------- Resize Handler -------------------- */
//         const onResize = () => {
//             camera.aspect = window.innerWidth / window.innerHeight;
//             camera.updateProjectionMatrix();
//             renderer.setSize(window.innerWidth, window.innerHeight);
//             ScrollTrigger.refresh();
//         };
//         window.addEventListener("resize", onResize);

//         initializeVideoPlayback(video);

//         /* -------------------- Animation Loop -------------------- */
//         const clock = new THREE.Clock();
//         let animationId: number;

//         const animate = () => {
//             animationId = requestAnimationFrame(animate);

//             const delta = clock.getDelta();
//             const time = clock.getElapsedTime();

//             monitorMesh.rotation.y += (mouseX - monitorMesh.rotation.y) * 0.05;
//             monitorMesh.rotation.x += (-mouseY - monitorMesh.rotation.x) * 0.05;

//             monitorMesh.position.y = Math.sin(time * 0.5) * 0.002;
//             monitorMesh.rotation.z = Math.sin(time * 0.3) * 0.002;

//             ledMaterial.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2;

//             if (screenMaterialRef.current) {
//                 screenMaterialRef.current.uniforms.time.value = time;
//                 screenMaterialRef.current.uniforms.emissiveIntensity.value = screenEmissiveIntensity.value;
//             }

//             scanlineTexture.offset.y += delta * 0.5;

//             camera.lookAt(monitorMesh.position);
//             renderer.render(scene, camera);
//         };
//         animate();

//         /* -------------------- Cleanup -------------------- */
//         return () => {
//             window.removeEventListener("mousemove", onMouseMove);
//             window.removeEventListener("resize", onResize);
//             document.removeEventListener("click", resumeVideoOnInteraction);
//             document.removeEventListener("touchstart", resumeVideoOnInteraction);
//             document.removeEventListener("keydown", resumeVideoOnInteraction);

//             if (videoRef.current) {
//                 videoRef.current.pause();
//                 videoRef.current.src = "";
//                 videoRef.current.load();
//             }

//             cancelAnimationFrame(animationId);
//             renderer.dispose();

//             if (scrollTriggerInstance) {
//                 scrollTriggerInstance.kill();
//             }
//             ScrollTrigger.getAll().forEach(trigger => trigger.kill());

//             if (container.contains(renderer.domElement)) {
//                 container.removeChild(renderer.domElement);
//             }
//         };
//     }, [createVideoElement, initializeVideoPlayback, resumeVideoOnInteraction, handleFullscreenVideo]);

//     // Effect for handling overlay video
//     useEffect(() => {
//         if (!showVideo || !videoContainerRef.current) return;

//         // Pause the 3D scene video when fullscreen video plays
//         if (videoRef.current) {
//             videoRef.current.pause();
//         }

//         // Fade in overlay - make video cover entire screen
//         gsap.fromTo(
//             videoContainerRef.current,
//             { opacity: 0 },
//             {
//                 opacity: 1,
//                 duration: 1,
//                 ease: "power2.out",
//                 onComplete: () => {
//                     if (overlayVideoRef.current) {
//                         overlayVideoRef.current.play().catch(console.warn);
//                     }
//                 }
//             }
//         );

//         // Cleanup when video ends or component unmounts
//         return () => {
//             // Resume 3D scene video when overlay is closed
//             if (videoRef.current && !fullscreenVideoTriggeredRef.current) {
//                 videoRef.current.play().catch(() => { });
//             }
//         };
//     }, [showVideo]);



//     return (
//         <div className="relative w-full bg-gradient-to-b from-gray-100 to-gray-0">

//             {/* Scroll space (controls how long the scroll is) */}
//             <div className="h-[200vh]" />

//             {/* PINNED SCENE */}
//             <div ref={containerRef} className="fixed top-0 left-0 w-full h-screen" />

//             {/* HUD */}
//             <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-sm font-mono z-10">
//                 <div className="flex items-center space-x-4">
//                     <div className="flex items-center">
//                         <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
//                         <span>POWER</span>
//                     </div>
//                     <div className="text-gray-500">|</div>
//                     <div>VGA DISPLAY ACTIVE</div>
//                     <div className="text-gray-500">|</div>
//                     <div>60Hz @ 800×600</div>
//                 </div>

//                 <div className="mt-4 text-center text-gray-500 text-xs animate-pulse">
//                     ↓ SCROLL TO ACTIVATE FULLSCREEN ↓
//                 </div>
//             </div>

//             {/* 🔥 TRUE FULLSCREEN VIDEO OVERLAY */}
//             {showVideo && (
//                 <div
//                     ref={videoContainerRef}
//                     className="fixed inset-0 z-[9999] bg-black w-[100dvw] h-[100dvh]"
//                 >
//                     <video
//                         ref={overlayVideoRef}
//                         src="/glitch.mp4"
//                         muted
//                         autoPlay
//                         playsInline
//                         onEnded={handleVideoEnded}
//                         className="w-full h-full object-cover"
//                     />
//                 </div>
//             )}
//             <section className="relative z-0">
//                 {showProjects && <Projects />}
//             </section>

//         </div>
//     );

// }



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

// Enhanced CRT Shader
const crtVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    // Create screen curvature effect
    vec3 pos = position;
    if (abs(normal.z) > 0.9) {
        float curveAmount = 0.1;
        float distanceFromCenter = length(uv - 0.5);
        pos.z += sin(distanceFromCenter * 3.14159) * curveAmount * 0.1;
    }
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const crtFragmentShader = `
uniform sampler2D videoTexture;
uniform float time;
uniform float emissiveIntensity;
uniform vec2 resolution;
uniform float curvature;
uniform float vignetteIntensity;
uniform float scanlineIntensity;
uniform vec3 phosphorMask;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

// Phosphor mask pattern
vec3 applyPhosphorMask(vec2 uv, vec3 color) {
    vec2 pixelSize = 1.0 / resolution;
    vec2 pixelCoord = floor(uv * resolution);
    float maskPattern = mod(pixelCoord.x + pixelCoord.y, 3.0);
    
    if (maskPattern < 1.0) return color * vec3(phosphorMask.x, 0.0, 0.0);
    else if (maskPattern < 2.0) return color * vec3(0.0, phosphorMask.y, 0.0);
    else return color * vec3(0.0, 0.0, phosphorMask.z);
}

// Scanlines with variation
float getScanlines(vec2 uv, float time) {
    float scanline = sin(uv.y * resolution.y * 3.14159 * 0.5) * 0.5 + 0.5;
    scanline = pow(scanline, 10.0);
    
    // Add subtle horizontal motion
    float motion = sin(time * 0.5 + uv.y * 10.0) * 0.002;
    float scanline2 = sin((uv.y + motion) * resolution.y * 3.14159 * 0.7) * 0.5 + 0.5;
    scanline2 = pow(scanline2, 8.0);
    
    return mix(scanline, scanline2, 0.3);
}

// Screen curvature distortion
vec2 barrelDistortion(vec2 uv, float amount) {
    vec2 centered = uv - 0.5;
    float distance = dot(centered, centered);
    vec2 distorted = centered * (1.0 + amount * distance * distance);
    return distorted + 0.5;
}

void main() {
    // Apply screen curvature
    vec2 distortedUv = barrelDistortion(vUv, curvature);
    
    // Clamp to prevent sampling outside texture
    if (distortedUv.x < 0.0 || distortedUv.x > 1.0 || distortedUv.y < 0.0 || distortedUv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    // Get video color with subtle horizontal hold effect
    float horizontalHold = sin(time * 0.3 + distortedUv.y * 5.0) * 0.0001;
    vec4 videoColor = texture2D(videoTexture, vec2(distortedUv.x + horizontalHold, distortedUv.y));
    
    // Convert to CRT-style colors
    float gray = dot(videoColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 crtColor = vec3(
        gray * 0.85,
        gray * 0.92,
        gray * 0.78
    );
    
    // Apply phosphor mask
    crtColor = applyPhosphorMask(distortedUv, crtColor);
    
    // Apply scanlines
    float scanlines = getScanlines(distortedUv, time);
    crtColor *= mix(1.0, 0.7 + 0.3 * scanlines, scanlineIntensity);
    
    // Apply vignette
    float dist = distance(distortedUv, vec2(0.5, 0.5));
    float vignette = 1.0 - dist * vignetteIntensity;
    vignette = smoothstep(0.0, 1.0, vignette);
    crtColor *= vignette;
    
    // Add bloom/emissive effect
    crtColor += crtColor * emissiveIntensity * (0.5 + 0.5 * sin(time * 2.0)) * 0.2;
    
    // Add subtle noise
    float noise = fract(sin(dot(distortedUv + time * 0.1, vec2(12.9898, 78.233))) * 43758.5453) * 0.02;
    crtColor += noise;
    
    gl_FragColor = vec4(crtColor, 1.0);
}
`;

// Custom materials with enhanced realism
const createPlasticMaterial = (color: number, roughness: number, textureScale = 10) => {
    const material = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.0,
        roughness: roughness,
        clearcoat: 0.3,
        clearcoatRoughness: 0.1,
    });

    // Add subtle texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    // Add subtle noise
    ctx.globalAlpha = 0.02;
    for (let i = 0; i < 10000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillRect(x, y, 2, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(textureScale, textureScale);
    material.map = texture;

    return material;
};

const createWoodMaterial = (baseColor: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base color
    ctx.fillStyle = `#${baseColor.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, 1024, 1024);

    // Wood grain pattern
    ctx.strokeStyle = 'rgba(20, 20, 20, 0.2)';
    ctx.lineWidth = 20;

    for (let i = 0; i < 20; i++) {
        const x = 100 + i * 40 + Math.random() * 30;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        for (let y = 0; y <= 1024; y += 50) {
            const offset = Math.sin(y / 200) * 30 + Math.random() * 20;
            ctx.lineTo(x + offset, y);
        }
        ctx.stroke();
    }

    // Add subtle highlights
    ctx.strokeStyle = 'rgba(60, 60, 60, 0.1)';
    ctx.lineWidth = 10;
    for (let i = 0; i < 10; i++) {
        const x = 200 + i * 80 + Math.random() * 50;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        for (let y = 0; y <= 1024; y += 100) {
            const offset = Math.sin(y / 150) * 40 + Math.random() * 10;
            ctx.lineTo(x + offset, y);
        }
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.0,
        roughness: 0.7,
        bumpMap: texture,
        bumpScale: 0.02
    });

    return material;
};

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
        setShowProjects(true);

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
        scene.background = new THREE.Color(0x1a1a1a);

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
        renderer.shadowMap.autoUpdate = true;
        container.appendChild(renderer.domElement);

        /* -------------------- Enhanced Lighting -------------------- */
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xfff5e6, 1.0);
        mainLight.position.set(3, 5, 2);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 10;
        mainLight.shadow.camera.left = -5;
        mainLight.shadow.camera.right = 5;
        mainLight.shadow.camera.top = 5;
        mainLight.shadow.camera.bottom = -5;
        mainLight.shadow.bias = -0.0001;
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xa0c8ff, 0.3);
        fillLight.position.set(-3, 2, -2);
        fillLight.castShadow = true;
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
        rimLight.position.set(-2, 3, -3);
        scene.add(rimLight);

        /* -------------------- CRT Monitor Body (Dark Charcoal) -------------------- */
        const monitorWidth = 0.6;
        const monitorHeight = 0.5;
        const monitorDepth = 0.35;

        const monitorMesh = new THREE.Mesh(
            new RoundedBoxGeometry(monitorWidth, monitorHeight, monitorDepth, 8, 0.02),
            createPlasticMaterial(0x1a1a1a, 0.9, 8)
        );
        monitorMesh.position.y = 0;
        monitorMesh.castShadow = true;
        monitorMesh.receiveShadow = true;
        scene.add(monitorMesh);

        /* -------------------- Screen Bezel (Nearly Black Matte) -------------------- */
        const bezelThickness = 0.02;
        const bezelGeometry = new THREE.BoxGeometry(
            monitorWidth - 0.04,
            monitorHeight - 0.15,
            0.001
        );
        const bezelMaterial = createPlasticMaterial(0x0d0d0d, 0.95);
        bezelMaterial.clearcoat = 0.1;
        const bezel = new THREE.Mesh(bezelGeometry, bezelMaterial);
        bezel.position.z = monitorDepth / 2 + 0.02;
        monitorMesh.add(bezel);

        /* -------------------- Enhanced CRT Screen (Curved Geometry) -------------------- */
        const screenWidth = monitorWidth - 0.1;
        const screenHeight = monitorHeight - 0.2;
        const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight, 64, 64);

        // Create actual curvature in geometry
        const positions = screenGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const normalizedX = (x + screenWidth / 2) / screenWidth;
            const normalizedY = (y + screenHeight / 2) / screenHeight;
            const distanceFromCenter = Math.sqrt(
                Math.pow(normalizedX - 0.5, 2) +
                Math.pow(normalizedY - 0.5, 2)
            );
            const curveAmount = 0.02;
            positions.setZ(i, Math.sin(distanceFromCenter * Math.PI) * curveAmount);
        }
        screenGeometry.computeVertexNormals();

        const video = createVideoElement();
        videoRef.current = video;
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.colorSpace = THREE.SRGBColorSpace;
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;

        const screenMaterial = new THREE.ShaderMaterial({
            uniforms: {
                videoTexture: { value: videoTexture },
                time: { value: 0 },
                emissiveIntensity: { value: 0.1 },
                resolution: { value: new THREE.Vector2(800, 600) },
                curvature: { value: 0.3 },
                vignetteIntensity: { value: 0.8 },
                scanlineIntensity: { value: 0.6 },
                phosphorMask: { value: new THREE.Vector3(0.9, 1.0, 0.8) }
            },
            vertexShader: crtVertexShader,
            fragmentShader: crtFragmentShader,
            transparent: false,
            side: THREE.FrontSide
        });

        screenMaterialRef.current = screenMaterial;

        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = monitorDepth / 2 + 0.025;
        monitorMesh.add(screen);

        /* -------------------- Monitor Base/Stand -------------------- */
        const baseGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.05, 16);
        const baseMaterial = createPlasticMaterial(0x222222, 0.85);
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -monitorHeight / 2 - 0.1;
        base.castShadow = true;
        monitorMesh.add(base);

        const neckGeometry = new THREE.CylinderGeometry(0.04, 0.06, 0.12, 8);
        const neck = new THREE.Mesh(neckGeometry, baseMaterial);
        neck.position.y = -monitorHeight / 2 - 0.05;
        neck.castShadow = true;
        monitorMesh.add(neck);

        /* -------------------- Enhanced Buttons & Controls -------------------- */
        const createButtonMaterial = (color: number) => {
            return createPlasticMaterial(color, 0.6);
        };

        const powerButtonGeometry = new THREE.CylinderGeometry(0.018, 0.018, 0.02, 16);
        const powerButton = new THREE.Mesh(powerButtonGeometry, createButtonMaterial(0x333333));
        powerButton.rotation.x = Math.PI / 2;
        powerButton.position.set(-monitorWidth / 2 + 0.08, -monitorHeight / 2 + 0.15, monitorDepth / 2 + 0.01);
        monitorMesh.add(powerButton);

        // Enhanced LED with breathing effect
        const ledGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.01, 16);
        const ledMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.3
        });
        const led = new THREE.Mesh(ledGeometry, ledMaterial);
        led.position.set(-monitorWidth / 2 + 0.08, -monitorHeight / 2 + 0.18, monitorDepth / 2 + 0.01);
        monitorMesh.add(led);

        const knobGeometry = new THREE.CylinderGeometry(0.012, 0.012, 0.015, 16);
        const knob = new THREE.Mesh(knobGeometry, createButtonMaterial(0x3a3a3a));
        knob.rotation.x = Math.PI / 2;
        knob.position.set(monitorWidth / 2 - 0.1, -monitorHeight / 2 + 0.15, monitorDepth / 2 + 0.01);
        monitorMesh.add(knob);

        const brightnessKnob = knob.clone();
        brightnessKnob.material = createButtonMaterial(0x444444);
        brightnessKnob.position.x = monitorWidth / 2 - 0.06;
        monitorMesh.add(brightnessKnob);

        const smallButtonGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.015, 12);
        const buttonSpacing = 0.04;

        const buttonColors = [0x2a2a2a, 0x303030, 0x363636, 0x3c3c3c];
        for (let i = 0; i < 4; i++) {
            const button = new THREE.Mesh(smallButtonGeometry, createButtonMaterial(buttonColors[i]));
            button.rotation.x = Math.PI / 2;
            button.position.set(
                monitorWidth / 2 - 0.15 + (i * buttonSpacing),
                -monitorHeight / 2 + 0.08,
                monitorDepth / 2 + 0.01
            );
            monitorMesh.add(button);
        }

        const logoGeometry = new THREE.BoxGeometry(0.12, 0.03, 0.005);
        const logoMaterial = createPlasticMaterial(0x252525, 0.3);
        logoMaterial.metalness = 0.4;
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.set(0, -monitorHeight / 2 + 0.05, monitorDepth / 2 + 0.01);
        monitorMesh.add(logo);

        /* -------------------- Enhanced Keyboard (Dark Slate) -------------------- */
        const keyboardWidth = 0.5;
        const keyboardHeight = 0.02;
        const keyboardDepth = 0.2;

        const keyboardGeometry = new THREE.BoxGeometry(keyboardWidth, keyboardHeight, keyboardDepth);
        const keyboardMaterial = createPlasticMaterial(0x1e1e1e, 0.9);
        const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
        keyboard.position.set(0, -0.6, 0.3);
        keyboard.rotation.x = -0.1;
        keyboard.castShadow = true;
        keyboard.receiveShadow = true;
        scene.add(keyboard);

        // Sculpted keys with rounded edges
        const createKeyGeometry = (width: number, height: number, depth: number) => {
            return new RoundedBoxGeometry(width, height, depth, 4, 0.002);
        };

        const keyRows = 4;
        const keysPerRow = 12;
        const keyWidth = 0.03;
        const keyHeight = 0.008;
        const keyDepth = 0.012;
        const keySpacing = 0.035;
        const rowSpacing = 0.025;

        const keyGeometry = createKeyGeometry(keyWidth, keyHeight, keyDepth);
        const keyMaterial = createPlasticMaterial(0x2d2d2d, 0.7);

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

        // Special keys
        const spacebarGeometry = createKeyGeometry(0.15, 0.006, 0.025);
        const spacebar = new THREE.Mesh(spacebarGeometry, keyMaterial);
        spacebar.position.set(0, keyboard.position.y + keyboardHeight / 2 + 0.006 / 2 + 0.001, keyboard.position.z + 0.08);
        spacebar.castShadow = true;
        scene.add(spacebar);

        const enterKeyGeometry = createKeyGeometry(0.06, 0.008, 0.02);
        const enterKey = new THREE.Mesh(enterKeyGeometry, keyMaterial);
        enterKey.position.set(0.2, keyboard.position.y + keyboardHeight / 2 + 0.008 / 2 + 0.001, keyboard.position.z - 0.07);
        enterKey.castShadow = true;
        scene.add(enterKey);

        /* -------------------- Detailed Mouse -------------------- */
        const mouseBodyGeometry = new THREE.SphereGeometry(0.025, 32, 24);
        mouseBodyGeometry.scale(1.5, 0.7, 1);
        const mouseMaterial = createPlasticMaterial(0x2a2a2a, 0.8);
        const mouseBody = new THREE.Mesh(mouseBodyGeometry, mouseMaterial);
        mouseBody.position.set(0.3, -0.58, 0.15);
        mouseBody.castShadow = true;
        scene.add(mouseBody);

        // Mouse buttons
        const leftButtonGeometry = new THREE.BoxGeometry(0.03, 0.005, 0.015);
        const leftButton = new THREE.Mesh(leftButtonGeometry, createPlasticMaterial(0x222222, 0.6));
        leftButton.position.set(0.28, -0.565, 0.15);
        leftButton.rotation.x = -0.1;
        leftButton.castShadow = true;
        scene.add(leftButton);

        const rightButton = leftButton.clone();
        rightButton.position.x = 0.32;
        scene.add(rightButton);

        // Scroll wheel
        const scrollWheelGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.01, 16);
        const scrollWheel = new THREE.Mesh(scrollWheelGeometry, createPlasticMaterial(0x444444, 0.4));
        scrollWheel.rotation.x = Math.PI / 2;
        scrollWheel.position.set(0.3, -0.565, 0.15);
        scrollWheel.castShadow = true;
        scene.add(scrollWheel);

        // Enhanced cable with detailed geometry
        const cableCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.3, -0.58, 0.15),
            new THREE.Vector3(0.25, -0.65, 0.12),
            new THREE.Vector3(0.15, -0.75, 0.05),
            new THREE.Vector3(0.05, -0.85, -0.05),
            new THREE.Vector3(-0.05, -0.9, -0.2),
        ]);

        const cableGeometry = new THREE.TubeGeometry(cableCurve, 32, 0.006, 12, false);
        const cableMaterial = createPlasticMaterial(0x1a1a1a, 0.95);
        const cable = new THREE.Mesh(cableGeometry, cableMaterial);
        cable.castShadow = true;
        scene.add(cable);

        /* -------------------- Desk Surface with Wood Grain -------------------- */
        const deskWidth = 4;
        const deskDepth = 2;
        const deskThickness = 0.05;

        const deskGeometry = new THREE.BoxGeometry(deskWidth, deskThickness, deskDepth);
        const deskMaterial = createWoodMaterial(0x1a1a1a);
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.set(0, -0.9, 0);
        desk.receiveShadow = true;
        scene.add(desk);

        /* -------------------- Dynamic Screen Glow Effect -------------------- */
        const screenGlowGeometry = new THREE.PlaneGeometry(screenWidth + 0.02, screenHeight + 0.02);
        const screenGlowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                baseColor: { value: new THREE.Color(0x448844) },
                intensity: { value: 0.1 },
                time: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 baseColor;
                uniform float intensity;
                uniform float time;
                varying vec2 vUv;
                
                void main() {
                    float dist = distance(vUv, vec2(0.5, 0.5));
                    float pulse = sin(time * 2.0) * 0.5 + 0.5;
                    float glow = (1.0 - dist * 1.5) * intensity * (0.8 + 0.2 * pulse);
                    gl_FragColor = vec4(baseColor, glow * 0.3);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const screenGlow = new THREE.Mesh(screenGlowGeometry, screenGlowMaterial);
        screenGlow.position.z = monitorDepth / 2 + 0.021;
        monitorMesh.add(screenGlow);

        /* -------------------- Scroll Animation with Smooth Damping -------------------- */
        const screenEmissiveIntensity = { value: 0.1 };

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
                    if (self.progress >= 0.999 && !fullscreenVideoTriggeredRef.current) {
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

        /* -------------------- Enhanced Mouse Interaction -------------------- */
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;
        let currentRotationX = 0;
        let currentRotationY = 0;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            targetRotationY = mouseX * 0.15;
            targetRotationX = -mouseY * 0.1;
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

        /* -------------------- Enhanced Animation Loop -------------------- */
        const clock = new THREE.Clock();
        let animationId: number;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            // Smooth damping for mouse movement
            currentRotationY += (targetRotationY - currentRotationY) * 0.05;
            currentRotationX += (targetRotationX - currentRotationX) * 0.05;

            // Base rotation with damping
            monitorMesh.rotation.y = currentRotationY;
            monitorMesh.rotation.x = currentRotationX;

            // Idle animations (breathing/wobble)
            const idleWobble = Math.sin(time * 0.3) * 0.002;
            const idleBreath = Math.sin(time * 0.5) * 0.001;
            monitorMesh.position.y = idleBreath;
            monitorMesh.rotation.z = idleWobble;

            // LED breathing effect
            const ledPulse = 0.3 + Math.sin(time * 2) * 0.2;
            ledMaterial.emissiveIntensity = ledPulse;

            // Key press animations (subtle)
            if (Math.sin(time * 2) > 0.9) {
                spacebar.position.y = keyboard.position.y + keyboardHeight / 2 + 0.006 / 2 + 0.001 - 0.001;
            } else {
                spacebar.position.y = keyboard.position.y + keyboardHeight / 2 + 0.006 / 2 + 0.001;
            }

            // Update screen materials
            if (screenMaterialRef.current) {
                screenMaterialRef.current.uniforms.time.value = time;
                screenMaterialRef.current.uniforms.emissiveIntensity.value = screenEmissiveIntensity.value;
            }

            if (screenGlowMaterial.uniforms) {
                screenGlowMaterial.uniforms.time.value = time;
                screenGlowMaterial.uniforms.intensity.value = screenEmissiveIntensity.value * 0.5;
            }

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

            ScrollTrigger.getAll().forEach(trigger => trigger.kill());

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [createVideoElement, initializeVideoPlayback, resumeVideoOnInteraction, handleFullscreenVideo]);

    // Effect for handling overlay video
    useEffect(() => {
        if (!showVideo || !videoContainerRef.current) return;

        if (videoRef.current) {
            videoRef.current.pause();
        }

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

        return () => {
            if (videoRef.current && !fullscreenVideoTriggeredRef.current) {
                videoRef.current.play().catch(() => { });
            }
        };
    }, [showVideo]);

    return (
        <div className="relative w-full bg-gradient-to-b from-gray-900 to-black">
            {/* Scroll space */}
            <div className="h-[200vh]" />

            {/* Pinned Scene */}
            <div ref={containerRef} className="fixed top-0 left-0 w-full h-screen" />

            {/* Enhanced HUD */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-sm font-mono z-10">
                <div className="flex items-center space-x-4 backdrop-blur-sm bg-black/30 px-6 py-3 rounded-full">
                    <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                        <span>POWER</span>
                    </div>
                    <div className="text-gray-500">|</div>
                    <div className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 animate-pulse" />
                        <span>VGA ACTIVE</span>
                    </div>
                    <div className="text-gray-500">|</div>
                    <div>60Hz @ 800×600</div>
                    <div className="text-gray-500">|</div>
                    <div className="text-green-400">CRT_MODE</div>
                </div>

                <div className="mt-4 text-center text-gray-300 text-xs animate-pulse">
                    <span className="block mb-1">↓ SCROLL TO ACTIVATE FULLSCREEN ↓</span>
                    <span className="text-gray-500 text-xs">Move mouse to rotate monitor</span>
                </div>
            </div>

            {/* Fullscreen Video Overlay */}
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