import { OnlinePlayerInfo } from '../types';

export interface OnlineMessage {
  type: 'join' | 'joined' | 'move' | 'chat' | 'offer_draw' | 'accept_draw' | 'resign' | 'rematch' | 'clock_sync';
  roomId: string;
  senderId: string;
  payload?: any;
}

// Global realistic player pool for world matchmaking
export const GLOBAL_OPPONENT_POOL: OnlinePlayerInfo[] = [
  { id: 'usr_uz1', name: 'Temur_Grand', country: "O'zbekiston", countryCode: 'UZ', flag: '🇺🇿', elo: 1840, avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop', pingMs: 18 },
  { id: 'usr_uz2', name: 'Shaxmatist_Samarqand', country: "O'zbekiston", countryCode: 'UZ', flag: '🇺🇿', elo: 1420, avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop', pingMs: 24 },
  { id: 'usr_nor1', name: 'VikingTactics', country: 'Norvegiya', countryCode: 'NO', flag: '🇳🇴', elo: 2150, avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop', pingMs: 68 },
  { id: 'usr_us1', name: 'ChessKnight_NY', country: 'AQSH', countryCode: 'US', flag: '🇺🇸', elo: 1680, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', pingMs: 112 },
  { id: 'usr_in1', name: 'Rohan_ChessGuru', country: 'Hindiston', countryCode: 'IN', flag: '🇮🇳', elo: 1950, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop', pingMs: 84 },
  { id: 'usr_de1', name: 'Kaiser_Taktik', country: 'Germaniya', countryCode: 'DE', flag: '🇩🇪', elo: 1530, avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop', pingMs: 52 },
  { id: 'usr_fr1', name: 'Le_Gambit_Paris', country: 'Fransiya', countryCode: 'FR', flag: '🇫🇷', elo: 1720, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', pingMs: 58 },
  { id: 'usr_tr1', name: 'Anadolu_Sah', country: 'Turkiya', countryCode: 'TR', flag: '🇹🇷', elo: 1380, avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop', pingMs: 44 },
  { id: 'usr_kz1', name: 'Batyr_Astana', country: "Qozog'iston", countryCode: 'KZ', flag: '🇰🇿', elo: 1610, avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop', pingMs: 32 },
  { id: 'usr_br1', name: 'Rio_Capablanca', country: 'Braziliya', countryCode: 'BR', flag: '🇧🇷', elo: 1490, avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop', pingMs: 145 },
  { id: 'usr_jp1', name: 'Tokyo_Sensei', country: 'Yaponiya', countryCode: 'JP', flag: '🇯🇵', elo: 2040, avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop', pingMs: 128 },
  { id: 'usr_gb1', name: 'London_System_Pro', country: 'Buyuk Britaniya', countryCode: 'GB', flag: '🇬🇧', elo: 1890, avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop', pingMs: 62 },
];

export class OnlineChessChannel {
  private channel: BroadcastChannel | null = null;
  private channelName: string = 'chessmaster_global_arena';
  private listeners: ((msg: OnlineMessage) => void)[] = [];
  public clientId: string;

  constructor() {
    this.clientId = 'client_' + Math.random().toString(36).substring(2, 9);
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = (e) => {
          if (e.data && e.data.senderId !== this.clientId) {
            this.listeners.forEach((l) => l(e.data));
          }
        };
      }
    } catch {
      // Fallback if BroadcastChannel unavailable
    }
  }

  public subscribe(callback: (msg: OnlineMessage) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  public send(type: OnlineMessage['type'], roomId: string, payload?: any): void {
    const msg: OnlineMessage = {
      type,
      roomId,
      senderId: this.clientId,
      payload,
    };
    if (this.channel) {
      this.channel.postMessage(msg);
    }
  }

  public close(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}

export const onlineChannel = new OnlineChessChannel();
