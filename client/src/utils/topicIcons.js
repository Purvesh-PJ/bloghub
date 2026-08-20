/**
 * The icon that stands for a topic.
 *
 * This lived in `components/marketing/Topics.jsx`, so every consumer of it — the admin
 * taxonomy table, the search rail, the sign-in panel, the footer — imported a marketing
 * component to get a lookup table. It is a mapping, not a component, and belongs with the
 * other pure helpers.
 */
import {
  Cpu,
  Palette,
  Briefcase,
  Leaf,
  FlaskConical,
  Plane,
  Code2,
  HeartPulse,
  UtensilsCrossed,
  Camera,
  Rocket,
  BookOpen,
  Music,
  Landmark,
  Dumbbell,
  Globe2,
  Sparkles,
  Database,
  Layers,
} from 'lucide-react';

/** Known topics get a face; anything else falls back to a globe. */
const ICONS = {
  technology: Cpu,
  tech: Cpu,
  cloud: Cpu,
  programming: Code2,
  coding: Code2,
  webdev: Code2,
  react: Code2,
  typescript: Code2,
  nodejs: Code2,
  design: Palette,
  uiux: Palette,
  creative: Palette,
  business: Briefcase,
  startups: Rocket,
  saas: Briefcase,
  leadership: Briefcase,
  lifestyle: Leaf,
  mindset: Leaf,
  science: FlaskConical,
  research: FlaskConical,
  physics: FlaskConical,
  travel: Plane,
  adventure: Plane,
  nomad: Plane,
  health: HeartPulse,
  wellness: HeartPulse,
  sleep: HeartPulse,
  food: UtensilsCrossed,
  cooking: UtensilsCrossed,
  culinary: UtensilsCrossed,
  photography: Camera,
  visuals: Camera,
  art: Palette,
  camera: Camera,
  space: Rocket,
  education: BookOpen,
  music: Music,
  finance: Landmark,
  fitness: Dumbbell,
  ai: Sparkles,
  productivity: Sparkles,
  database: Database,
  architecture: Layers,
};

export const topicIcon = (name = '') => ICONS[name.toLowerCase()] ?? Globe2;
