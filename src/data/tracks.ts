// The beat playlist shown beside the music screen. Titles were auto-derived
// from the filenames in /public/beats — refine the `title` and `genre` of any
// track here; `src` must match the file in /public/beats. Durations are read
// live from the audio once each track loads, so they're not stored here.
export interface Track {
  /** Display title in the playlist. */
  title: string;
  /** Short subtitle line (genre / vibe). Edit freely. */
  genre: string;
  /** Public path to the audio file. */
  src: string;
  /** Small status tag, purely cosmetic (matches the retro UI). */
  status: 'DEPLOYED' | 'DEMO' | 'TODO' | 'ARCHIVED';
}

export const tracks: Track[] = [
  { title: 'Where The Wind Takes You', genre: 'Atmospheric Lo-Fi', src: '/beats/Where_The_wind_takes_you.mp3', status: 'DEPLOYED' },
  { title: 'Angelic', genre: 'TODO', src: '/beats/Angelic.mp3', status: 'DEMO' },
  { title: 'Swag Angelic', genre: 'TODO', src: '/beats/Swag Angelic.mp3', status: 'DEMO' },
  { title: 'Cracked V5', genre: 'TODO', src: '/beats/CrackedV5.mp3', status: 'DEMO' },
  { title: 'Etheral', genre: 'TODO', src: '/beats/Etheral.mp3', status: 'DEMO' },
  { title: 'Karan X Ronnie', genre: 'TODO', src: '/beats/KaranXRonnie.mp3', status: 'DEMO' },
  { title: 'Lelo Type', genre: 'TODO', src: '/beats/LeloType.mp3', status: 'DEMO' },
  { title: 'New Era V7', genre: 'TODO', src: '/beats/NewErav7.mp3', status: 'DEMO' },
  { title: 'Prettifun 4', genre: 'TODO', src: '/beats/Prettifun_4.mp3', status: 'DEMO' },
  { title: 'Some Mystic', genre: 'TODO', src: '/beats/Some Mystic.mp3', status: 'DEMO' },
  { title: 'Something Tbh', genre: 'TODO', src: '/beats/Something tbh.mp3', status: 'DEMO' },
  { title: 'Spooky To Lucky V3', genre: 'TODO', src: '/beats/SpookyToLuckyV3.mp3', status: 'DEMO' },
  { title: 'Tasogare', genre: 'TODO', src: '/beats/Tasogare.mp3', status: 'DEMO' },
  { title: 'WOAH V2', genre: 'TODO', src: '/beats/WOAHV2.mp3', status: 'DEMO' },
  { title: 'Waterfall', genre: 'TODO', src: '/beats/Waterfall.mp3', status: 'DEMO' },
  { title: 'Wydro', genre: 'TODO', src: '/beats/Wydro.mp3', status: 'DEMO' },
  { title: 'Ya Like Jazz', genre: 'TODO', src: '/beats/YaLikeJazz.mp3', status: 'DEMO' },
  { title: 'Heavenly Vocals', genre: 'TODO', src: '/beats/heavenly Vocals.mp3', status: 'DEMO' },
];
