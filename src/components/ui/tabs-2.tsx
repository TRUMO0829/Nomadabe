"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const tabItems = [
  "Overview",
  "Integration",
  "Billing",
  "Transactions",
  "Plans",
] as const;

export default function TabsComponent() {
  const [selectedTab, setSelectedTab] =
    useState<(typeof tabItems)[number]>("Overview");

  return (
    <Tabs.Root
      className="mx-auto mt-2 w-full max-w-screen-xl px-4 md:px-8"
      value={selectedTab}
      onValueChange={(value) =>
        setSelectedTab(value as (typeof tabItems)[number])
      }
    >
      <Tabs.List
        className="hidden gap-x-2 overflow-x-auto rounded-lg border border-border bg-card p-1.5 text-sm sm:flex"
        aria-label="Manage your account"
      >
        {tabItems.map((item) => (
          <Tabs.Trigger
            key={item}
            className="rounded-md px-3 py-1.5 text-xs font-normal uppercase text-muted-foreground outline-none transition-colors duration-150 hover:bg-accent/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-sm"
            value={item}
          >
            {item}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <div className="relative text-muted-foreground sm:hidden">
        <ChevronDown className="pointer-events-none absolute inset-y-0 right-3 my-auto h-5 w-5" />
        <select
          value={selectedTab}
          className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal uppercase text-foreground shadow-sm outline-none focus:border-ring"
          onChange={(event) =>
            setSelectedTab(event.target.value as (typeof tabItems)[number])
          }
        >
          {tabItems.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {tabItems.map((item) => (
        <Tabs.Content key={item} className="py-6" value={item}>
          <p className="text-xs font-normal uppercase leading-normal text-muted-foreground">
            This is <span className="text-foreground">{item}</span> Tab
          </p>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
