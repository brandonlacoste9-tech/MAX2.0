import axios from 'axios';

/**
 * ElevenLabs voice information
 */
export interface Voice {
  voice_id: string;
  name: string;
  category?: string;
  labels?: Record<string, string>;
  description?: string;
  preview_url?: string;
}

/**
 * ElevenLabs TTS configuration
 */
export interface ElevenLabsConfig {
  apiKey: string;
  voiceId?: string;
  modelId?: string;
}

/**
 * ElevenLabs TTS integration for voice output
 */
export class ElevenLabsTTS {
  private apiKey: string;
  private voiceId: string;
  private modelId: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(config: ElevenLabsConfig) {
    this.apiKey = config.apiKey || process.env.ELEVENLABS_API_KEY || '';
    this.voiceId = config.voiceId || 'default-voice';
    this.modelId = config.modelId || 'eleven_monolingual_v1';
  }

  /**
   * Convert text to speech using ElevenLabs
   */
  async textToSpeech(text: string, voiceId?: string): Promise<Buffer | null> {
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not configured');
      return null;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voiceId || this.voiceId}`,
        {
          text,
          model_id: this.modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<Voice[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      return response.data.voices;
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  }

  /**
   * Check if TTS is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}
