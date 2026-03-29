"use client";

import React, { useRef, useState } from 'react';

const mapStyles = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Press+Start+2P&display=swap');

@keyframes lakeShimmer { 0%,100%{opacity:.55} 50%{opacity:.75} }
@keyframes snowGleam   { 0%,100%{opacity:.82} 50%{opacity:1} }
@keyframes riverFlow   { 0%{stroke-dashoffset:60} 100%{stroke-dashoffset:0} }
@keyframes mist        { 0%,100%{opacity:.18} 50%{opacity:.32} }
@keyframes playerPulse { 0%,100%{opacity:1; box-shadow: 0 0 5px #f0c040;} 50%{opacity:.6; box-shadow: 0 0 20px #f0c040;} }

.cinzel { font-family: 'Cinzel', serif; }
.pixel { font-family: 'Press Start 2P', monospace; }

.lake-anim { animation: lakeShimmer 3s ease-in-out infinite; }
.snow-gleam { animation: snowGleam 4s ease-in-out infinite; }
.river-flow { animation: riverFlow 2.5s linear infinite; }
.mist-anim { animation: mist 5s ease-in-out infinite; }
.player-pulse { animation: playerPulse 1.8s ease-in-out infinite; }
`;

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

interface WorldMapProps {
    onOpenBaseManager?: () => void;
}

export function WorldMap({ onOpenBaseManager }: WorldMapProps) {
    const router = useRouter();
    const { profile } = useAuthStore();
    
    // Drag Pan State
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    React.useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);

        // Center the camera on initial mount to offset the 130vw magnified CSS bounds
        if (containerRef.current) {
            const container = containerRef.current;
            requestAnimationFrame(() => {
                const maxScrollLeft = container.scrollWidth - container.clientWidth;
                const maxScrollTop = container.scrollHeight - container.clientHeight;
                
                if (maxScrollLeft > 0) {
                    container.scrollLeft = maxScrollLeft / 2 - 150; // Offset slightly left so Talamh Base aligns visually centering
                }
                if (maxScrollTop > 0) {
                    container.scrollTop = 0; // Lock to the top edge to keep Talamh Base visible
                }
            });
        }

        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    if (!profile) return null;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setStartY(e.pageY - containerRef.current.offsetTop);
        setScrollLeft(containerRef.current.scrollLeft);
        setScrollTop(containerRef.current.scrollTop);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const y = e.pageY - containerRef.current.offsetTop;
        const walkX = (x - startX) * 1.5;
        const walkY = (y - startY) * 1.5;
        containerRef.current.scrollLeft = scrollLeft - walkX;
        containerRef.current.scrollTop = scrollTop - walkY;
    };

    const handleTravel = (route: string, levelReq: number = 1, name: string = "") => {
        if (profile.level < levelReq) {
            toast.error(`Level ${levelReq} required to enter ${name}!`);
            return;
        }
        if (route === 'BASE_MODAL') {
            if (onOpenBaseManager) onOpenBaseManager();
        } else {
            router.push(route);
        }
    };

    return (
        <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            className={`font-pixel text-white ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#07111f', overflow: 'auto' }}
        >
            <style>{mapStyles}</style>
            <style>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                div::-webkit-scrollbar { display: none; }
                /* Hide scrollbar for IE, Edge and Firefox */
                div { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <svg 
                viewBox="0 0 1400 1000" 
                preserveAspectRatio="xMidYMid meet"
                style={{ width: 'max(1820px, 130vw)', height: 'max(1300px, 130vh)', display: 'block', overflow: 'visible' }}
            >
                <defs>
                    <radialGradient id="oceanGrad" cx="50%" cy="50%" r="70%">
                        <stop offset="0%" stopColor="#1a4060" />
                        <stop offset="60%" stopColor="#0d2840" />
                        <stop offset="100%" stopColor="#050f1c" />
                    </radialGradient>
                    <radialGradient id="shallowWater" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#205570" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#205570" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="granderyBg" cx="40%" cy="40%" r="70%">
                        <stop offset="0%" stopColor="#c87858" />
                        <stop offset="50%" stopColor="#9e5038" />
                        <stop offset="100%" stopColor="#6a2e18" />
                    </radialGradient>
                    <radialGradient id="forestBg" cx="50%" cy="50%" r="60%">
                        <stop offset="0%" stopColor="#446848" />
                        <stop offset="60%" stopColor="#2a4c30" />
                        <stop offset="100%" stopColor="#162a1a" />
                    </radialGradient>
                    <radialGradient id="asteriosBg" cx="60%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#307060" />
                        <stop offset="50%" stopColor="#1a5048" />
                        <stop offset="100%" stopColor="#0c3028" />
                    </radialGradient>
                    <radialGradient id="jarobaBg" cx="50%" cy="50%" r="60%">
                        <stop offset="0%" stopColor="#2c5a38" />
                        <stop offset="100%" stopColor="#122018" />
                    </radialGradient>
                    <radialGradient id="lakeGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#4a9ec0" />
                        <stop offset="60%" stopColor="#2878a0" />
                        <stop offset="100%" stopColor="#185880" />
                    </radialGradient>
                    <radialGradient id="snowPeak" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#eef4f8" />
                        <stop offset="50%" stopColor="#c8d8e4" />
                        <stop offset="100%" stopColor="#a0b8c8" />
                    </radialGradient>
                    <radialGradient id="desertBg" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#c89044" />
                        <stop offset="100%" stopColor="#8a5a22" />
                    </radialGradient>
                    <filter id="mistBlur">
                        <feGaussianBlur stdDeviation="6" />
                    </filter>
                </defs>

                {/* Infinite Ocean Background (Expands to cover full screen letterboxing) */}
                <rect x="-2000" y="-2000" width="6000" height="6000" fill="url(#oceanGrad)" />

                {/* Depth contour rings */}
                <ellipse cx="700" cy="410" rx="600" ry="350" stroke="#2a6080" strokeWidth="2" fill="none" opacity="0.12" />
                <ellipse cx="700" cy="410" rx="800" ry="450" stroke="#2a6080" strokeWidth="2" fill="none" opacity="0.12" />

                {/* Wave texture lines */}
                <path d="M 0 150 Q 50 130 100 150 T 200 150 T 300 150 T 400 150 T 500 150 T 600 150 T 700 150 T 800 150 T 900 150 T 1000 150 T 1100 150 T 1200 150 T 1300 150 T 1400 150" fill="none" stroke="#1d4a6a" strokeWidth="0.7" opacity="0.32" />
                <path d="M 0 400 Q 50 380 100 400 T 200 400 T 300 400 T 400 400 T 500 400 T 600 400 T 700 400 T 800 400 T 900 400 T 1000 400 T 1100 400 T 1200 400 T 1300 400 T 1400 400" fill="none" stroke="#1d4a6a" strokeWidth="0.7" opacity="0.32" />
                <path d="M 0 650 Q 50 630 100 650 T 200 650 T 300 650 T 400 650 T 500 650 T 600 650 T 700 650 T 800 650 T 900 650 T 1000 650 T 1100 650 T 1200 650 T 1300 650 T 1400 650" fill="none" stroke="#1d4a6a" strokeWidth="0.7" opacity="0.32" />

                {/* Sea creature silhouette */}
                <path d="M 1150 700 Q 1170 680 1190 700 T 1230 700 Q 1240 720 1220 710 T 1190 730 Q 1170 710 1150 700 Z" fill="#2a5080" opacity="0.8" />
                <path d="M 1210 695 Q 1220 670 1230 695 Z" fill="#2a5080" opacity="0.8" /> 

                {/* 3 Boats */}
                <Boat x={380} y={680} />
                <Boat x={950} y={150} />
                <Boat x={680} y={280} />

                {/* COASTAL SHALLOWS (opacity 0.55) */}
                <ellipse cx="350" cy="350" rx="360" ry="280" fill="url(#shallowWater)" />
                <ellipse cx="800" cy="450" rx="250" ry="180" fill="url(#shallowWater)" />
                <ellipse cx="1200" cy="500" rx="280" ry="250" fill="url(#shallowWater)" />
                <ellipse cx="650" cy="730" rx="280" ry="120" fill="url(#shallowWater)" />

                {/* COASTAL REEF FOAM DASHES */}
                <path d="M 30 200 Q 200 50 450 150 T 600 300 Q 650 500 500 650 T 200 650 Q 50 500 30 200 Z" fill="none" stroke="#5ab0d0" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.2" transform="scale(1.05) translate(-10, -15)" />
                <path d="M 680 320 Q 800 250 900 300 T 950 520 Q 850 620 750 580 T 680 320 Z" fill="none" stroke="#5ab0d0" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.2" transform="scale(1.05) translate(-30, -20)" />

                {/* === LANDMASSES === */}

                {/* 1. GRANDERY (Western) */}
                <path d="M 50 250 Q 200 100 450 150 T 600 350 Q 550 550 400 650 T 150 630 Q 50 500 50 250 Z" fill="url(#granderyBg)" />
                <path d="M 400 650 T 150 630 Q 50 500 50 250" fill="none" stroke="#dcb484" strokeWidth="12" opacity="0.6" strokeLinecap="round" />

                {/* Desert Basin */}
                <ellipse cx="250" cy="550" rx="120" ry="70" fill="url(#desertBg)" />
                <path d="M 180 530 Q 200 500 230 520 T 280 510" fill="none" stroke="#8a5a22" strokeWidth="1.5" opacity="0.5" />
                <path d="M 220 570 Q 250 550 270 580" fill="none" stroke="#8a5a22" strokeWidth="1.5" opacity="0.5" />
                <ellipse cx="200" cy="520" rx="4" ry="2" fill="#6a3e12" />
                <ellipse cx="320" cy="560" rx="6" ry="3" fill="#6a3e12" />

                {/* Cherry Trees (Grandery) */}
                <CherryTree x={180} y={320} />
                <CherryTree x={220} y={350} />
                <CherryTree x={150} y={380} />
                <CherryTree x={320} y={280} />
                <CherryTree x={300} y={300} />

                {/* 2. FOREST ZONE (Center-right) */}
                <path d="M 600 350 Q 750 250 880 300 T 930 520 Q 850 650 720 580 T 600 350 Z" fill="url(#forestBg)" />
                
                {/* Conifers */}
                {Array.from({length: 20}).map((_, i) => (
                    <Conifer key={`conf-${i}`} x={650 + (i*37)%200} y={380 + (i*13)%150} />
                ))}

                {/* Dark Tower */}
                <g transform="translate(780, 480)">
                    <rect x="-15" y="-40" width="30" height="40" fill="#1a1a24" />
                    <rect x="-16" y="-45" width="8" height="5" fill="#1a1a24" />
                    <rect x="-4" y="-45" width="8" height="5" fill="#1a1a24" />
                    <rect x="8" y="-45" width="8" height="5" fill="#1a1a24" />
                    <rect x="-3" y="-25" width="6" height="10" fill="#f0c060" className="lake-anim" />
                    <circle cx="0" cy="-55" r="6" fill="#e03030" opacity="0.9" />
                    <circle cx="0" cy="-55" r="3" fill="#ff6060" className="lake-anim" />
                </g>

                {/* 3. ASTERIOS (Right Island) */}
                <path d="M 1000 250 Q 1150 150 1350 300 T 1300 650 Q 1150 750 1000 600 T 1000 250 Z" fill="url(#asteriosBg)" />
                
                {/* Exotic Fauna */}
                <AlienPlant x={1080} y={320} />
                <AlienPlant x={1120} y={350} />
                <AlienPlant x={1050} y={380} />
                <AlienPlant x={1200} y={450} />

                {/* Cauldron Dome */}
                <g transform="translate(1200, 420)">
                    <ellipse cx="0" cy="0" rx="40" ry="20" fill="#12241c" />
                    <ellipse cx="0" cy="-5" rx="30" ry="15" fill="#1a382c" />
                    <ellipse cx="0" cy="-10" rx="20" ry="10" fill="#245040" />
                    <ellipse cx="0" cy="-12" rx="10" ry="5" fill="#30705a" />
                </g>

                {/* 4. NORTHERN FORTRESS ISLAND */}
                <ellipse cx="780" cy="100" rx="80" ry="40" fill="#4a5058" />
                <g transform="translate(780, 100)">
                    <rect x="-20" y="-30" width="40" height="30" fill="#2a2e34" />
                    <rect x="-35" y="-15" width="15" height="15" fill="#2a2e34" />
                    <rect x="20" y="-15" width="15" height="15" fill="#2a2e34" />
                    <rect x="-5" y="-15" width="10" height="15" fill="#e0a040" className="lake-anim" />
                    <rect x="-40" y="0" width="80" height="10" fill="#1a1c20" />
                </g>
                <circle cx="720" cy="100" r="8" fill="#162a1a" />
                <circle cx="840" cy="100" r="10" fill="#162a1a" />

                {/* 5. JAROBA */}
                <path d="M 450 720 Q 580 680 750 710 T 820 780 Q 600 820 450 780 T 450 720 Z" fill="url(#jarobaBg)" />
                {Array.from({length: 12}).map((_, i) => (
                    <circle key={`j-tree-${i}`} cx={520 + (i*25)} cy={730 + (i%2)*12} r="10" fill="#0c1810" />
                ))}

                {/* === MOUNTAIN RANGES === */}
                <Mountain x={150} y={240} w={60} h={80} />
                <Mountain x={100} y={270} w={70} h={90} />
                <Mountain x={180} y={280} w={50} h={60} />
                <Mountain x={220} y={250} w={80} h={100} />
                
                <Mountain x={450} y={150} w={80} h={90} />
                <Mountain x={500} y={180} w={90} h={110} />
                <Mountain x={560} y={130} w={70} h={80} />

                <Mountain x={680} y={320} w={50} h={60} />
                <Mountain x={710} y={350} w={60} h={80} />
                <Mountain x={740} y={310} w={45} h={55} />

                <Mountain x={1200} y={300} w={70} h={90} />
                <Mountain x={1250} y={330} w={80} h={110} />
                <Mountain x={1300} y={290} w={60} h={70} />

                {/* === RIVERS === */}
                <path d="M 520 180 Q 400 250 400 400" fill="none" stroke="#5ab0d0" strokeWidth="4" opacity="0.52" />
                <path d="M 520 180 Q 400 250 400 400" fill="none" stroke="#90d8f0" strokeWidth="1.5" strokeDasharray="8 5" opacity="0.3" className="river-flow" />

                <path d="M 400 450 Q 400 550 350 640" fill="none" stroke="#5ab0d0" strokeWidth="3" opacity="0.52" />
                <path d="M 400 450 Q 400 550 350 640" fill="none" stroke="#90d8f0" strokeWidth="1" strokeDasharray="8 5" opacity="0.3" className="river-flow" />

                {/* === LAKES === */}
                <ellipse cx="400" cy="420" rx="55" ry="35" fill="url(#lakeGrad)" className="lake-anim" />
                <ellipse cx="400" cy="420" rx="57" ry="37" fill="none" stroke="#0f2a3a" strokeWidth="2" opacity="0.6" />
                <text x="400" y="425" textAnchor="middle" fill="#a0d8f0" fontSize="9" className="cinzel drop-shadow-md">Lake Solmere</text>

                <ellipse cx="250" cy="180" rx="30" ry="18" fill="url(#lakeGrad)" className="lake-anim" />
                <text x="250" y="183" textAnchor="middle" fill="#a0d8f0" fontSize="8" className="cinzel">L. Verath</text>

                <ellipse cx="720" cy="450" rx="20" ry="12" fill="url(#lakeGrad)" className="lake-anim" />
                <text x="720" y="453" textAnchor="middle" fill="#a0d8f0" fontSize="6" className="cinzel">Glade Pool</text>

                <ellipse cx="1120" cy="480" rx="45" ry="25" fill="url(#lakeGrad)" className="lake-anim" />
                <text x="1120" y="484" textAnchor="middle" fill="#a0d8f0" fontSize="9" className="cinzel">Mirror Lake</text>

                {/* === ATMOSPHERE === */}
                <ellipse cx="300" cy="150" rx="200" ry="100" fill="#a060d0" opacity="0.06" />
                <ellipse cx="1100" cy="150" rx="250" ry="150" fill="#40a0c0" opacity="0.06" />
                <ellipse cx="700" cy="700" rx="300" ry="150" fill="#a060d0" opacity="0.05" />
                
                <rect x="420" y="160" width="150" height="40" rx="20" fill="#eef4f8" filter="url(#mistBlur)" className="mist-anim" />
                <rect x="180" y="260" width="120" height="30" rx="15" fill="#eef4f8" filter="url(#mistBlur)" className="mist-anim" style={{animationDelay: "1s"}} />
                <rect x="1150" y="300" width="140" height="50" rx="25" fill="#eef4f8" filter="url(#mistBlur)" className="mist-anim" style={{animationDelay: "2s"}} />

                {/* === PLACE NAME LABELS === */}
                <Banner x={300} y={280} text="Grandery" onClick={() => handleTravel('/town', 1, "Grandery Town")} />
                <Banner x={1150} y={350} text="Asterios" onClick={() => handleTravel('/dungeon', 5, "Asterios Dungeon")} />
                <Banner x={600} y={750} text="Jaroba" onClick={() => handleTravel('/forest', 10, "Jaroba Forest")} />

                {/* TITLE BANNER */}
                <g transform="translate(700, 60)" className="cursor-pointer group" onClick={() => handleTravel('BASE_MODAL', 1, "Talamh Base")}>
                    <rect x="-160" y="-40" width="320" height="80" fill="transparent" /> {/* Stable Hover Target */}
                    <g className="transition-transform group-hover:-translate-y-1">
                        <line x1="0" y1="-30" x2="0" y2="-10" stroke="#a0a0b0" strokeWidth="3" />
                        <rect x="-10" y="-12" width="20" height="3" fill="#e0c060" />
                        <circle cx="0" cy="-30" r="3" fill="#e0c060" />
                        <path d="M -150 0 L 150 0 L 130 15 L 150 30 L -150 30 L -130 15 Z" fill="#d4a848" stroke="#9a7028" strokeWidth="2" />
                        <text x="0" y="22" textAnchor="middle" fill="#5a3010" fontSize="22" fontWeight="700" className="cinzel">Talamh Base</text>
                    </g>
                </g>

                {/* === QUEST MARKERS === */}
                
                {/* FIND THE FURNACE */}
                <g transform="translate(680, 520)">
                    <circle cx="0" cy="0" r="16" fill="#0e1830" stroke="#505060" strokeWidth="2" />
                    <polygon points="0,-6 6,6 -6,6" fill="none" stroke="#f0c040" strokeWidth="1.5" />
                    <rect x="-45" y="20" width="90" height="12" fill="#0e1830" />
                    <text x="0" y="28" textAnchor="middle" fill="#b0b0d0" fontSize="6" className="pixel">FIND THE FURNACE</text>
                </g>

                {/* KILL AIRA */}
                <g transform="translate(1300, 150)">
                    <circle cx="0" cy="0" r="14" fill="#0e1830" stroke="#e03030" strokeWidth="2" />
                    <line x1="-5" y1="-5" x2="5" y2="5" stroke="#e03030" strokeWidth="2" />
                    <line x1="-5" y1="5" x2="5" y2="-5" stroke="#e03030" strokeWidth="2" />
                    <rect x="-35" y="-25" width="70" height="14" fill="#601010" />
                    <text x="0" y="-16" textAnchor="middle" fill="#f0e0e0" fontSize="7" className="pixel">KILL AIRA</text>
                </g>

                {/* CLOSED DOOR */}
                <g transform="translate(150, 100)">
                    <circle cx="0" cy="0" r="14" fill="#0e1830" stroke="#f0c040" strokeWidth="1.5" strokeDasharray="3 2" />
                    <text x="0" y="4" textAnchor="middle" fill="#f0c040" fontSize="12" className="cinzel font-bold">?</text>
                    <rect x="-30" y="18" width="60" height="12" fill="#1a1a1a" />
                    <text x="0" y="26" textAnchor="middle" fill="#a0a0a0" fontSize="5.5" className="pixel">CLOSED DOOR</text>
                </g>

                {/* PLAYER POSITION MARKER */}
                <g transform="translate(630, 480)">
                    <rect x="-12" y="-12" width="24" height="24" fill="#0a1525" stroke="#f0c040" strokeWidth="1.5" className="player-pulse" />
                    <line x1="0" y1="-6" x2="0" y2="6" stroke="#f0c040" strokeWidth="2" />
                    <line x1="-6" y1="0" x2="6" y2="0" stroke="#f0c040" strokeWidth="2" />
                    <polygon points="0,-25 -8,-15 8,-15" fill="#f0c040" className="player-pulse" />
                    
                    <rect x="-85" y="18" width="170" height="14" fill="#1a1a1a" stroke="#d4a848" strokeWidth="1" />
                    <text x="0" y="28" textAnchor="middle" fill="#f0e0e0" fontSize="5.2" className="pixel">DRINK FROM THE HOLY FOUNTAIN</text>
                </g>

                {/* Compass Rose */}
                <g transform="translate(1300, 720)">
                    <circle cx="0" cy="0" r="40" fill="none" stroke="#8a6a48" strokeWidth="2" />
                    <circle cx="0" cy="0" r="35" fill="none" stroke="#8a6a48" strokeWidth="1" />
                    <line x1="0" y1="-50" x2="0" y2="50" stroke="#8a6a48" strokeWidth="1.5" />
                    <line x1="-50" y1="0" x2="50" y2="0" stroke="#8a6a48" strokeWidth="1.5" />
                    <polygon points="0,-45 -10,-10 10,-10" fill="#e0c060" />
                    <text x="0" y="-55" textAnchor="middle" fill="#e0c060" fontSize="12" className="cinzel font-bold">N</text>
                    <text x="0" y="65" textAnchor="middle" fill="#e0c060" fontSize="12" className="cinzel font-bold">S</text>
                    <text x="60" y="5" textAnchor="middle" fill="#e0c060" fontSize="12" className="cinzel font-bold">E</text>
                    <text x="-60" y="5" textAnchor="middle" fill="#e0c060" fontSize="12" className="cinzel font-bold">W</text>
                </g>
            </svg>
        </div>
    );
}

// Inline Sub-components
const Mountain = ({ x, y, w, h }: { x: number, y: number, w: number, h: number }) => (
    <g transform={`translate(${x}, ${y})`}>
        <polygon points={`${-w*0.2},0 ${w/2},${-h*0.8} ${w*1.5},0`} fill="#000" opacity="0.3" />
        <polygon points={`0,0 ${w/2},${-h} ${w},0`} fill="#2e1e10" opacity="0.6" />
        <polygon points={`${w*0.2},0 ${w/2+w*0.1},${-h*0.9} ${w*0.9},0`} fill="#5a3820" opacity="0.9" />
        <polygon points={`${w*0.1},0 ${w/2-w*0.1},${-h*0.85} ${w*0.8},0`} fill="#6a4228" opacity="0.9" />
        <polygon points={`${w*0.5},${-h} ${w*0.35},${-h*0.6} ${w*0.5},${-h*0.45} ${w*0.65},${-h*0.6}`} fill="url(#snowPeak)" className="snow-gleam" />
    </g>
);

const Banner = ({ x, y, text, onClick }: { x: number, y: number, text: string, onClick?: () => void }) => (
    <g transform={`translate(${x}, ${y})`} className={onClick ? "cursor-pointer group" : ""} onClick={onClick}>
        <rect x="-80" y="-20" width="160" height="50" fill="transparent" /> {/* Extremely Stable Hover Target */}
        <g className="transition-transform group-hover:-translate-y-1">
            <path d="M -60 0 L 60 0 L 50 12 Q 60 12 60 24 L -60 24 Q -50 24 -50 12 L -60 0 Z" fill="#d4a848" stroke="#9a7028" strokeWidth="1.5" />
            <text x="0" y="17" textAnchor="middle" fill="#5a3010" fontSize="13" fontWeight="700" className="cinzel">{text}</text>
        </g>
    </g>
);

const Boat = ({ x, y }: { x: number, y: number }) => (
    <g transform={`translate(${x}, ${y})`}>
        <polygon points="0,5 20,5 15,10 5,10" fill="#4a3018" />
        <line x1="10" y1="5" x2="10" y2="-15" stroke="#8a6a48" strokeWidth="1.5" />
        <polygon points="10,-15 10,0 25,-5" fill="#eef4f8" opacity="0.9" />
    </g>
);

const CherryTree = ({ x, y }: { x: number, y: number }) => (
    <g transform={`translate(${x}, ${y})`}>
        <line x1="0" y1="10" x2="0" y2="20" stroke="#5a3820" strokeWidth="3" />
        <circle cx="0" cy="0" r="15" fill="#e8a0a8" opacity="0.9" />
        <circle cx="-5" cy="5" r="12" fill="#f0b4b0" />
        <circle cx="8" cy="2" r="10" fill="#f0b4b0" />
        <ellipse cx="15" cy="25" rx="3" ry="1.5" fill="#f0b4b0" />
        <ellipse cx="-15" cy="22" rx="2" ry="1" fill="#e8a0a8" />
    </g>
);

const Conifer = ({ x, y }: { x: number, y: number }) => (
    <g transform={`translate(${x}, ${y})`}>
        <polygon points="0,0 -8,15 8,15" fill="#244a2a" />
        <circle cx="0" cy="12" r="6" fill="#162a1a" opacity="0.8" />
        <line x1="0" y1="15" x2="0" y2="18" stroke="#162a1a" strokeWidth="2" />
    </g>
);

const AlienPlant = ({ x, y }: { x: number, y: number }) => (
    <g transform={`translate(${x}, ${y})`}>
        <rect x="-2" y="0" width="4" height="20" fill="#5a3820" />
        <ellipse cx="0" cy="0" rx="15" ry="6" fill="#88c0a0" />
        <ellipse cx="0" cy="-3" rx="10" ry="4" fill="#a8e0c0" />
    </g>
);
