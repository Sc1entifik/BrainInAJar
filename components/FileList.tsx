export default function BrainFood({files}: {files: string[]}) {
	return (
		<div class="flex flex-col items-start" >
			{
				files.map((x, y) => 
					<p class="text-brain-text font-cherrybomb text-3xl" key={y}>{x}</p>
				)
			}
		</div>
	);
	
}
