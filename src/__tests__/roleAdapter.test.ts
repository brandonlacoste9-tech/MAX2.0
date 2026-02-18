import { RoleAdapter } from '../roleAdapter';
import { Role, Language } from '../types';

describe('RoleAdapter', () => {
  let adapter: RoleAdapter;

  beforeEach(() => {
    adapter = new RoleAdapter();
  });

  describe('detectRole', () => {
    it('should detect lawyer role', () => {
      expect(adapter.detectRole('I need legal advice')).toBe(Role.LAWYER);
      expect(adapter.detectRole('What are my rights in a contract?')).toBe(Role.LAWYER);
      expect(adapter.detectRole('Can you help with a lawsuit?')).toBe(Role.LAWYER);
    });

    it('should detect plumber role', () => {
      expect(adapter.detectRole('My pipe is leaking')).toBe(Role.PLUMBER);
      expect(adapter.detectRole('How do I fix a drain?')).toBe(Role.PLUMBER);
      expect(adapter.detectRole('The toilet is clogged')).toBe(Role.PLUMBER);
    });

    it('should detect therapist role', () => {
      expect(adapter.detectRole('I feel stressed and anxious')).toBe(Role.THERAPIST);
      expect(adapter.detectRole('Can you help with my depression?')).toBe(Role.THERAPIST);
      expect(adapter.detectRole('I need emotional support')).toBe(Role.THERAPIST);
    });

    it('should detect diet/fitness role', () => {
      expect(adapter.detectRole('I need help with my diet')).toBe(Role.DIET_FITNESS);
      expect(adapter.detectRole('What workout should I do?')).toBe(Role.DIET_FITNESS);
      expect(adapter.detectRole('How can I lose weight?')).toBe(Role.DIET_FITNESS);
    });

    it('should detect life coach role', () => {
      expect(adapter.detectRole('I need help with my goals')).toBe(Role.LIFE_COACH);
      expect(adapter.detectRole('How can I stay motivated?')).toBe(Role.LIFE_COACH);
      expect(adapter.detectRole('I want personal development advice')).toBe(Role.LIFE_COACH);
    });

    it('should detect advertiser role', () => {
      expect(adapter.detectRole('I need help with my marketing campaign')).toBe(Role.ADVERTISER);
      expect(adapter.detectRole('How can I improve my advertising?')).toBe(Role.ADVERTISER);
      expect(adapter.detectRole('What social media strategy should I use?')).toBe(Role.ADVERTISER);
    });

    it('should default to general role', () => {
      expect(adapter.detectRole('Hello there')).toBe(Role.GENERAL);
      expect(adapter.detectRole('What is the weather like?')).toBe(Role.GENERAL);
    });
  });

  describe('getRolePrompt', () => {
    it('should return prompt for each role', () => {
      expect(adapter.getRolePrompt(Role.LAWYER)).toContain('legal');
      expect(adapter.getRolePrompt(Role.PLUMBER)).toContain('plumbing');
      expect(adapter.getRolePrompt(Role.THERAPIST)).toContain('therapeutic');
      expect(adapter.getRolePrompt(Role.DIET_FITNESS)).toContain('diet and fitness');
      expect(adapter.getRolePrompt(Role.LIFE_COACH)).toContain('life coach');
      expect(adapter.getRolePrompt(Role.ADVERTISER)).toContain('advertising');
      expect(adapter.getRolePrompt(Role.GENERAL)).toContain('friendly');
    });
  });

  describe('getRoleGreeting', () => {
    it('should return greeting for each role and language', () => {
      const greeting = adapter.getRoleGreeting(Role.LAWYER, Language.ENGLISH);
      expect(greeting).toContain('legal');

      const frenchGreeting = adapter.getRoleGreeting(Role.THERAPIST, Language.QUEBEC_FRENCH);
      expect(frenchGreeting).toContain('MAX');

      const spanishGreeting = adapter.getRoleGreeting(Role.PLUMBER, Language.SPANISH);
      expect(spanishGreeting).toContain('MAX');

      const portugueseGreeting = adapter.getRoleGreeting(Role.DIET_FITNESS, Language.BRAZILIAN_PORTUGUESE);
      expect(portugueseGreeting).toContain('MAX');
    });
  });
});
