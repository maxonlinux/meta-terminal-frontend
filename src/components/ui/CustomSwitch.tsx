import { Switch } from "react-aria-components";

export function CustomSwitch({
  label,
  ...rest
}: { label: string } & React.ComponentProps<typeof Switch>) {
  return (
    <Switch
      {...rest}
      className="group flex gap-2 items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex h-6.5 w-11 shrink-0 rounded-full shadow-inner bg-clip-padding border border-white/10 p-0.75 box-border transition duration-200 ease-in-out group-pressed:bg-accent/700 group-selected:bg-accent group-selected:group-pressed:bg-accen/90 outline-hidden group-focus-visible:ring-2 ring-black">
        <span className="h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out translate-x-0 group-selected:translate-x-full" />
      </div>
      <p className="text-sm opacity-50">{label}</p>
    </Switch>
  );
}
