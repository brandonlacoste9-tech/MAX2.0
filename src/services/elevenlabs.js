import fetch from 'node-fetch';

/**
 * ElevenLabs Text-to-Speech Service
 * Provides voice capabilities for MAX
 */

export class ElevenLabsService {
  constructor(apiKey, voiceId) {
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY;
    this.voiceId = voiceId || process.env.ELEVENLABS_VOICE_ID;
    this.baseUrl = 'https://api.elevenlabs.io/v1';
  }

  /**
   * Convert text to speech
   */
  async textToSpeech(text, options = {}) {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    if (!this.voiceId) {
      throw new Error('ElevenLabs voice ID not configured');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${this.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey
          },
          body: JSON.stringify({
            text: text,
            model_id: options.model || 'eleven_monolingual_v1',
            voice_settings: {
              stability: options.stability || 0.5,
              similarity_boost: options.similarityBoost || 0.75,
              style: options.style || 0,
              use_speaker_boost: options.useSpeakerBoost || true
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`ElevenLabs API error: ${error}`);
      }

      // Return audio buffer
      const audioBuffer = await response.arrayBuffer();
      return Buffer.from(audioBuffer);
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  /**
   * Get available voices
   */
  async getVoices() {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices;
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  /**
   * Check if TTS is configured
   */
  isConfigured() {
    return !!(this.apiKey && this.voiceId);
  }
}

// Export singleton instance
let elevenLabsInstance = null;

export function getElevenLabsService(apiKey = null, voiceId = null) {
  if (!elevenLabsInstance) {
    elevenLabsInstance = new ElevenLabsService(apiKey, voiceId);
  }
  return elevenLabsInstance;
}
