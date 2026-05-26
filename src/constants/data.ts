import { colors } from "./colors";

export const WORKOUT_DB: Record<
  string,
  Record<string, Array<{
    id: number;
    name: string;
    reps: number | null;
    duration: number | null;
    rounds: number;
    rest: number;
    muscle: string;
    desc: string;
  }>>
> = {
  beginner: {
    core: [
      { id: 1, name: "Plank Hold", reps: null, duration: 20, rounds: 3, rest: 15, muscle: "Core", desc: "Straight body, engage abs" },
      { id: 2, name: "Crunches", reps: 15, duration: null, rounds: 3, rest: 15, muscle: "Core", desc: "Slow controlled motion" },
      { id: 3, name: "Leg Raises", reps: 12, duration: null, rounds: 3, rest: 20, muscle: "Lower Core", desc: "Keep lower back flat" },
      { id: 4, name: "Dead Bug", reps: 10, duration: null, rounds: 3, rest: 15, muscle: "Core", desc: "Opposite arm & leg" },
    ],
    fullbody: [
      { id: 5, name: "Jumping Jacks", reps: null, duration: 30, rounds: 3, rest: 15, muscle: "Full Body", desc: "Full range of motion" },
      { id: 6, name: "Bodyweight Squats", reps: 15, duration: null, rounds: 3, rest: 20, muscle: "Legs", desc: "Chest up, knees out" },
      { id: 7, name: "Push-Ups (Knee)", reps: 12, duration: null, rounds: 3, rest: 20, muscle: "Chest/Arms", desc: "Modified for beginners" },
      { id: 8, name: "Mountain Climbers", reps: null, duration: 20, rounds: 3, rest: 15, muscle: "Core/Cardio", desc: "Drive knees to chest" },
    ],
    hiit: [
      { id: 9, name: "High Knees", reps: null, duration: 20, rounds: 4, rest: 10, muscle: "Cardio", desc: "Pump those arms" },
      { id: 10, name: "Butt Kicks", reps: null, duration: 20, rounds: 4, rest: 10, muscle: "Cardio", desc: "Heels to glutes" },
      { id: 11, name: "Jump Squats", reps: 10, duration: null, rounds: 4, rest: 15, muscle: "Legs/Cardio", desc: "Land softly" },
    ],
    stretching: [
      { id: 12, name: "Child's Pose", reps: null, duration: 30, rounds: 2, rest: 5, muscle: "Back/Hips", desc: "Breathe deeply" },
      { id: 13, name: "Hip Flexor Stretch", reps: null, duration: 25, rounds: 2, rest: 5, muscle: "Hips", desc: "Each side" },
      { id: 14, name: "Hamstring Stretch", reps: null, duration: 25, rounds: 2, rest: 5, muscle: "Hamstrings", desc: "Keep back straight" },
    ],
  },
  intermediate: {
    core: [
      { id: 20, name: "Plank", reps: null, duration: 40, rounds: 4, rest: 15, muscle: "Core", desc: "Hips level, squeeze glutes" },
      { id: 21, name: "Bicycle Crunches", reps: 20, duration: null, rounds: 4, rest: 15, muscle: "Obliques", desc: "Full rotation each side" },
      { id: 22, name: "V-Ups", reps: 15, duration: null, rounds: 4, rest: 20, muscle: "Core", desc: "Reach for feet" },
      { id: 23, name: "Russian Twists", reps: 20, duration: null, rounds: 4, rest: 15, muscle: "Obliques", desc: "Feet off ground" },
    ],
    fullbody: [
      { id: 24, name: "Burpees", reps: 10, duration: null, rounds: 4, rest: 20, muscle: "Full Body", desc: "Chest to ground" },
      { id: 25, name: "Jump Lunges", reps: 12, duration: null, rounds: 4, rest: 20, muscle: "Legs", desc: "Switch legs in air" },
      { id: 26, name: "Push-Ups", reps: 15, duration: null, rounds: 4, rest: 20, muscle: "Chest/Arms", desc: "Full range of motion" },
      { id: 27, name: "Plank Rows", reps: 12, duration: null, rounds: 4, rest: 20, muscle: "Back/Core", desc: "Alternate arms" },
    ],
    hiit: [
      { id: 28, name: "Box Jumps", reps: 10, duration: null, rounds: 5, rest: 15, muscle: "Power/Legs", desc: "Land with soft knees" },
      { id: 29, name: "Tuck Jumps", reps: 8, duration: null, rounds: 5, rest: 20, muscle: "Explosive Power", desc: "Knees to chest" },
      { id: 30, name: "Speed Skaters", reps: null, duration: 25, rounds: 5, rest: 10, muscle: "Cardio/Legs", desc: "Wide lateral jumps" },
    ],
  },
  advanced: {
    core: [
      { id: 40, name: "Dragon Flag", reps: 8, duration: null, rounds: 5, rest: 20, muscle: "Core", desc: "Control the descent" },
      { id: 41, name: "L-Sit Hold", reps: null, duration: 15, rounds: 5, rest: 20, muscle: "Core/Strength", desc: "Legs parallel to floor" },
      { id: 42, name: "Ab Wheel Rollout", reps: 10, duration: null, rounds: 5, rest: 25, muscle: "Core", desc: "Full extension" },
    ],
    fullbody: [
      { id: 43, name: "Pistol Squats", reps: 8, duration: null, rounds: 5, rest: 25, muscle: "Legs/Balance", desc: "Each leg, full depth" },
      { id: 44, name: "Archer Push-Ups", reps: 10, duration: null, rounds: 5, rest: 25, muscle: "Chest/Arms", desc: "Full arm extension" },
      { id: 45, name: "Muscle-Ups", reps: 5, duration: null, rounds: 5, rest: 30, muscle: "Full Upper", desc: "Explosive pull to dip" },
    ],
  },
};

export const CATEGORIES = [
  { key: "core", label: "Core", icon: "flame" as const, color: "#FF5C1A" },
  { key: "fullbody", label: "Full Body", icon: "flash" as const, color: "#C8FF00" },
  { key: "hiit", label: "HIIT", icon: "flash" as const, color: "#FF2D55" },
  { key: "stretching", label: "Stretch", icon: "leaf" as const, color: "#5AC8FA" },
  { key: "chest", label: "Chest", icon: "barbell" as const, color: "#C8FF00" },
  { key: "arms", label: "Arms", icon: "barbell" as const, color: "#FF9F0A" },
  { key: "legs", label: "Legs", icon: "walk" as const, color: "#FF5C1A" },
  { key: "fatburn", label: "Fat Burn", icon: "sunny" as const, color: "#FF2D55" },
];

export const LEVELS = [
  { key: "beginner", label: "Beginner", desc: "Start your journey", color: colors.green },
  { key: "intermediate", label: "Intermediate", desc: "Level up", color: colors.accent },
  { key: "advanced", label: "Advanced", desc: "Push limits", color: colors.accentOrange },
];

export const DURATIONS = [5, 10, 20, 30];
