import { writable } from "svelte/store";

export const isDialogOpen = writable(true);
export const currDialogText = writable(0);