import { useRef } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, Search } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { NATIONALITIES } from "../../constants/nationalities";

function CountryLabel({ country }) {
  return <><img src={`${import.meta.env.BASE_URL}flags/${country.code.toLowerCase()}.png`} alt="" width={20} height={15} className="h-3.5 w-5 shrink-0 object-contain" /><span>{country.name} ({country.code})</span></>;
}

export default function NationalityField() {
  const { control, formState: { errors } } = useFormContext();
  const searchRef = useRef(null);
  const error = errors.client?.nationality;
  return (
    <div className="min-w-0">
      <label htmlFor="client-nationality" className="mb-1 block text-xs font-medium text-primary">Nationality</label>
      <Controller name="client.nationality" control={control} render={({ field }) => {
        const selected = NATIONALITIES.find((country) => country.name === field.value) ?? null;
        return (
          <Combobox.Root items={NATIONALITIES} value={selected} onValueChange={(country) => field.onChange(country?.name ?? "")} itemToStringLabel={(country) => `${country.name} (${country.code})`} autoHighlight>
            <Combobox.Trigger id="client-nationality" ref={field.ref} onBlur={field.onBlur} aria-invalid={Boolean(error)} aria-describedby={error ? "nationality-error" : undefined} className="flex h-8 min-h-8! w-full items-center gap-2 rounded-md border border-border-default bg-surface-primary px-2.5 text-left text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 aria-invalid:border-destructive">
              {selected ? <CountryLabel country={selected} /> : <span className="text-text-muted">Select Nationality</span>}
              <ChevronDown aria-hidden="true" className="ml-auto size-4 shrink-0 text-text-muted" />
            </Combobox.Trigger>
            <Combobox.Portal>
              <Combobox.Positioner sideOffset={4} align="start" className="z-50">
                <Combobox.Popup initialFocus={searchRef} className="flex max-h-[min(22rem,var(--available-height))] w-[var(--anchor-width)] min-w-60 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-border-default bg-surface-primary text-text-primary shadow-lg">
                  <div className="relative shrink-0 border-b border-border-default p-2">
                    <Search aria-hidden="true" className="absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-text-muted" />
                    <Combobox.Input ref={searchRef} aria-label="Search nationalities" placeholder="Search country or code..." className="h-8 min-h-8! w-full rounded-md border border-border-default bg-surface-primary pr-2 pl-8 text-xs outline-none focus:border-primary" />
                  </div>
                  <Combobox.Empty className="text-center text-xs text-text-muted"><p className="px-3 py-3">No nationalities found.</p></Combobox.Empty>
                  <Combobox.List className="min-h-0 overflow-y-auto overscroll-contain">
                    {(country) => <Combobox.Item key={country.code} value={country} className="flex min-h-10 cursor-default items-center gap-3 px-3 py-2 text-xs outline-none data-highlighted:bg-accent data-selected:font-medium">
                      <CountryLabel country={country} />
                      <Combobox.ItemIndicator className="ml-auto"><Check aria-hidden="true" className="size-3.5 text-primary" /></Combobox.ItemIndicator>
                    </Combobox.Item>}
                  </Combobox.List>
                </Combobox.Popup>
              </Combobox.Positioner>
            </Combobox.Portal>
          </Combobox.Root>
        );
      }} />
      {error?.message && <p id="nationality-error" role="alert" className="mt-1 text-xs text-destructive">{error.message}</p>}
    </div>
  );
}
