import { CreateBrainsFields } from "../enums/createBrainsFields.ts";

export default function BrainNameFormInput() {
  return (
    <>
      <label for={CreateBrainsFields.NAME} class="block">NAME YOUR BRAIN</label>
      <input
        class="bg-white font-quantico text-black text-base w-102 pl-2 rounded-xl"
        name={CreateBrainsFields.NAME}
        id={CreateBrainsFields.NAME}
        placeholder="Name Your Brain. Brain names have to be unique."
        required
      />
    </>
  );
}
