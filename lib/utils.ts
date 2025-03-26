import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getInitials = (name:string): string => name
    .split(" ")
    .map((part)=>part[0]) // get first part and join it and make it to upper case
    .join("")
    .toUpperCase()