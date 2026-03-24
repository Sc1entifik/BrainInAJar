import { CreateBrainsFields } from "../enums/createBrainsFields.ts";

export function BrainReasoningInputForm() {
  return (
    <div>
      <h2 class="my-4">REASONING</h2>
      <div class="grid grid-cols-3 gap-y-3">
        {["none", "minimal", "low", "medium", "high", "xhigh"]
          .map((x: string, y: number) => {
            return (
              <label
                htmlFor={x}
                class="flex items-center space-x-2 cursor-pointer font-quantico text-amber-200 text-xl gap-x-1"
                key={y}
              >
                {x.toUpperCase()}
                <input
                  type="radio"
                  name={CreateBrainsFields.REASONING}
                  id={x}
                  value={x}
                  class="mr-2"
                  checked={y === 0}
                />
              </label>
            );
          })}
      </div>
    </div>
  );
}
