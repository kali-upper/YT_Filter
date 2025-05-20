declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

declare namespace YT {
  export enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  interface PlayerOptions {
    height?: string;
    width?: string;
    videoId?: string;
    playerVars?: PlayerVars;
    events?: Events;
  }

  interface PlayerVars {
    autoplay?: 0 | 1;
    controls?: 0 | 1 | 2;
    start?: number;
    end?: number;
    loop?: 0 | 1;
    playlist?: string; // Comma-separated video IDs
    fs?: 0 | 1; // Fullscreen button
    rel?: 0 | 1; // Related videos
    modestbranding?: 1; // Remove YouTube logo
    iv_load_policy?: 1 | 3; // Annotations (1=show, 3=hide)
    [key: string]: any; // For other player parameters
  }

  interface Events {
    onReady?: (event: OnReadyEvent) => void;
    onStateChange?: (event: OnStateChangeEvent) => void;
    onPlaybackQualityChange?: (event: OnPlaybackQualityChangeEvent) => void;
    onPlaybackRateChange?: (event: OnPlaybackRateChangeEvent) => void;
    onError?: (event: OnErrorEvent) => void;
    onApiChange?: (event: Event) => void;
  }

  interface Event {
    target: Player;
    data?: any;
  }

  interface OnReadyEvent extends Event {}
  interface OnStateChangeEvent extends Event {
    data: PlayerState;
  }
  interface OnPlaybackQualityChangeEvent extends Event {
    data: string;
  }
  interface OnPlaybackRateChangeEvent extends Event {
    data: number;
  }
  interface OnErrorEvent extends Event {
    data: number; // Error code (2, 5, 100, 101, 150)
  }

  export class Player {
    constructor(placeholder: string | HTMLElement, options: PlayerOptions);
    loadVideoById(videoId: string, startSeconds?: number, suggestedQuality?: string): void;
    cueVideoById(videoId: string, startSeconds?: number, suggestedQuality?: string): void;
    
    // Playlist methods
    loadPlaylist(playlist: string | string[] | object, index?: number, startSeconds?: number, suggestedQuality?: string): void;
    cuePlaylist(playlist: string | string[] | object, index?: number, startSeconds?: number, suggestedQuality?: string): void;
    nextVideo(): void;
    previousVideo(): void;
    playVideoAt(index: number): void;
    getPlaylist(): string[];
    getPlaylistIndex(): number;
    getPlaylistId(): string | null; // It can be null if no playlist is loaded

    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    clearVideo(): void;
    getPlayerState(): PlayerState;
    getCurrentTime(): number;
    getDuration(): number;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
    getPlaybackRate(): number;
    setPlaybackRate(suggestedRate: number): void;
    getAvailablePlaybackRates(): number[];
    getVolume(): number;
    setVolume(volume: number): void;
    isMuted(): boolean;
    mute(): void;
    unMute(): void;
    getIframe(): HTMLIFrameElement;
    destroy(): void;
    addEventListener<E extends keyof Events>(event: E, listener: NonNullable<Events[E]>): void;
    removeEventListener<E extends keyof Events>(event: E, listener: NonNullable<Events[E]>): void;
  }
} 