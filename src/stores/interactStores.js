import { writable } from "svelte/store";

export const isInteractOpen = writable(false);
export const currInteractText = writable(0);