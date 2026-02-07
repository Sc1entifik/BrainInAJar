export default function ChatForm({url}: {url: string }) {
	return (
		<form class="text-center my-3" method="GET" action={url} f-partial={url}>
			<input name="userMessage" class="bg-white" autofocus/>
			<button type="submit" hidden></button>
		</form>
	);
}
