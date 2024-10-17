import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(dateString: string = ""): string {
	const currentDate = new Date();
	const inputDate = new Date(dateString);

	const timeDifference = currentDate.getTime() - inputDate.getTime();
	const secondsDifference = timeDifference / 1000;

	if (secondsDifference < 60) {
		return "Just now";
	} else if (secondsDifference < 3600) {
		const minutes = Math.floor(secondsDifference / 60);
		return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
	} else if (secondsDifference < 86400) {
		const hours = Math.floor(secondsDifference / 3600);
		return `${hours} hour${hours === 1 ? "" : "s"} ago`;
	} else {
		const days = Math.floor(secondsDifference / 86400);
		return `${days} day${days === 1 ? "" : "s"} ago`;
	}
}
