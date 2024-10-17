"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRecoilState } from "recoil";
import { isLoading, valueAtom } from "@/state/atoms";

const frameworks = [
  {
    value: "Room1",
    label: "Room1",
  },
  {
    value: "Room2",
    label: "Room2",
  },
  {
    value: "Room3",
    label: "Room3",
  },
  {
    value: "Room4",
    label: "Room4",
  },
  {
    value: "Room5",
    label: "Room5",
  },
];

export function ComboboxDemo() {
  const [open, setOpen] = useRecoilState(isLoading);
  const [value, setValue] = useRecoilState(valueAtom);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between  "
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select Room..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Select Room..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Room found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                className=""
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4  ",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
