export default function getCookieValue(cookieName: string, cookieHeader: string):string {
	return Object.fromEntries(
		cookieHeader.split("; ")
			.map(cookieString => {
				const [key, ...value] = cookieString.split("=");
				return [key, decodeURIComponent(value.join("="))];
			})
	)[cookieName];
}
