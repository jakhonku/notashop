import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPriceUZS = (n: number) =>
  new Intl.NumberFormat('uz-UZ').format(n) + " so'm"

export const difficultyTone = (d: string): string => {
  switch (d) {
    case "Boshlang'ich":
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200/60'
    case "O'rta":
      return 'bg-amber-50 text-amber-700 ring-amber-200/60'
    case 'Yuqori':
      return 'bg-rose-50 text-rose-700 ring-rose-200/60'
    default:
      return 'bg-slate-50 text-slate-700 ring-slate-200/60'
  }
}

export const CATEGORIES = [
  'Klassik',
  'Zamonaviy',
  "O'zbek",
  'Jazz',
  'Pop',
] as const

export const INSTRUMENTS = [
  'Pianino',
  'Gitara',
  'Skripka',
  'Dutor',
  'Vokal',
  'Nay',
] as const

export const DIFFICULTIES = ["Boshlang'ich", "O'rta", 'Yuqori'] as const
