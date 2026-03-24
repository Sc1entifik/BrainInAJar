import { CreateBrainsFields } from "../enums/createBrainsFields.ts";
import { FileMap } from "../enums/fileMap.ts";

export function BrainModelFormInput({ chatModels }: { chatModels: string[] }) {
  if (chatModels.length === 0) {
    return (
      <input
        class="bg-white font-quantico text-black text-base w-102 pl-2 rounded-xl"
        name={CreateBrainsFields.MODEL}
        id={CreateBrainsFields.MODEL}
        placeholder="Enter a model id, like gpt-5.4-mini"
        required
      />
    );
  }

  return (
    <div class="grid grid-cols-2 gap-x-8 gap-y-3">
      {chatModels.map((x: string, y: number) => {
        return (
          <label
            htmlFor={x}
            class="flex items-center space-x-2 cursor-pointer font-quantico text-amber-200 text-xl gap-x-1"
            key={y}
          >
            <img
              src={FileMap.LOGO}
              alt="Cartoon image of a brain in a jar."
              class="w-10"
            />
            {x.toUpperCase()}
            <input
              type="radio"
              name={CreateBrainsFields.MODEL}
              id={x}
              value={x}
              class="mr-2"
              checked={y === 0}
            />
          </label>
        );
      })}
    </div>
  );
}
