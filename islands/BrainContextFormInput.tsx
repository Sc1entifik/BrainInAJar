import { CreateBrainsFields } from "../enums/createBrainsFields.ts";

export function BrainContextFormInput() {
  return (
    <>
      <label for={CreateBrainsFields.SYSTEM} class="mt-10 block">
        GIVE YOUR BRAIN A CONTEXT
      </label>
      <textarea
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
        class="bg-white font-quantico text-black text-base w-104 pl-2 rounded-lg"
        name={CreateBrainsFields.SYSTEM}
        id={CreateBrainsFields.SYSTEM}
        placeholder="Your Brain Context Goes Here. Be Thorough."
        required
      />
    </>
  );
}
