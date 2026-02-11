import { define } from "../utils.ts";

export default define.page(function App({ Component }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" href="/brainCropped.svg" type="image/svg+xml" />
        <title>Brain In A Jar</title>
      </head>
      <body f-client-nav>
        <Component />
			</body>
    </html>
  );
});
