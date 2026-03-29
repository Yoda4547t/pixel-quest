"use client";

class SoundEngine {
    private ctx: AudioContext | null = null;
    private isMuted: boolean = false;
    private ambientOsc1: OscillatorNode | null = null;
    private ambientOsc2: OscillatorNode | null = null;
    private ambientGain: GainNode | null = null;
    public currentTrack: string | null = null;

    // Use a user interaction to initialize the context (browsers block autoplay)
    public init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    public getMutedState() {
        return this.isMuted;
    }

    private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
        if (this.isMuted || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    public playAmbient(trackId: 'forest' | 'town' | 'dungeon' | 'base') {
        this.init();
        if (this.isMuted || !this.ctx) return;
        
        if (this.currentTrack === trackId) return; // Already playing
        this.stopAmbient();
        this.currentTrack = trackId;

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.ambientGain.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 2);
        this.ambientGain.connect(this.ctx.destination);

        this.ambientOsc1 = this.ctx.createOscillator();
        this.ambientOsc2 = this.ctx.createOscillator();

        if (trackId === 'forest') {
            this.ambientOsc1.type = 'sine';
            this.ambientOsc1.frequency.value = 432;
            this.ambientOsc2.type = 'triangle';
            this.ambientOsc2.frequency.value = 216;
        } else if (trackId === 'dungeon') {
            this.ambientOsc1.type = 'sawtooth';
            this.ambientOsc1.frequency.value = 55;
            this.ambientOsc2.type = 'sawtooth';
            this.ambientOsc2.frequency.value = 57;
        } else if (trackId === 'town') {
            this.ambientOsc1.type = 'sine';
            this.ambientOsc1.frequency.value = 261.63;
            this.ambientOsc2.type = 'sine';
            this.ambientOsc2.frequency.value = 329.63;
        } else if (trackId === 'base') {
            this.ambientOsc1.type = 'square';
            this.ambientOsc1.frequency.value = 196;
            this.ambientOsc2.type = 'sine';
            this.ambientOsc2.frequency.value = 293.66;
        }

        this.ambientOsc1.connect(this.ambientGain);
        this.ambientOsc2.connect(this.ambientGain);
        this.ambientOsc1.start();
        this.ambientOsc2.start();
    }

    public stopAmbient() {
        if (this.ambientGain && this.ctx) {
            this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
            const a1 = this.ambientOsc1;
            const a2 = this.ambientOsc2;
            const ag = this.ambientGain;
            setTimeout(() => {
                if (a1) { a1.stop(); a1.disconnect(); }
                if (a2) { a2.stop(); a2.disconnect(); }
                if (ag) { ag.disconnect(); }
            }, 1000);
            
            this.ambientOsc1 = null;
            this.ambientOsc2 = null;
            this.ambientGain = null;
        }
        this.currentTrack = null;
    }

    // specific SFX triggers
    public playClick() {
        this.playTone(600, 'square', 0.05, 0.05);
    }

    public playCoin() {
        this.init();
        if (this.isMuted || !this.ctx) return;

        // Two rapid high pitched tones for coin
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        
        osc.frequency.setValueAtTime(987.77, t); // B5
        osc.frequency.setValueAtTime(1318.51, t + 0.08); // E6
        
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(t);
        osc.stop(t + 0.3);
    }

    public playLevelUp() {
        this.init();
        if (this.isMuted || !this.ctx) return;

        // Arpeggio for level up
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        
        // C Major Arp
        osc.frequency.setValueAtTime(523.25, t); // C5
        osc.frequency.setValueAtTime(659.25, t + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, t + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, t + 0.3); // C6
        
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.setValueAtTime(0.1, t + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(t);
        osc.stop(t + 0.8);
    }

    public playError() {
        this.playTone(150, 'sawtooth', 0.3, 0.1);
    }
}

// Export a singleton instance
export const audio = typeof window !== "undefined" ? new SoundEngine() : null;
