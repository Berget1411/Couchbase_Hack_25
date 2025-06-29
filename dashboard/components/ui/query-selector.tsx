"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UserQuery,
  getPredefinedQueries,
  isPredefinedQuery,
} from "@/types/request";

interface QuerySelectorProps {
  value: string;
  onValueChange: (value: UserQuery) => void;
  placeholder?: string;
  className?: string;
}

export function QuerySelector({
  value,
  onValueChange,
  placeholder = "Select a query or type your own...",
  className,
}: QuerySelectorProps) {
  const [isCustom, setIsCustom] = React.useState(!isPredefinedQuery(value));
  const predefinedQueries = getPredefinedQueries();
  const [customValue, setCustomValue] = React.useState(
    isPredefinedQuery(value) ? "" : value
  );

  React.useEffect(() => {
    const isPredefined = isPredefinedQuery(value);
    setIsCustom(!isPredefined);
    if (!isPredefined) {
      setCustomValue(value);
    }
  }, [value]);

  const handlePredefinedSelect = (selectedValue: string) => {
    if (selectedValue === "custom") {
      setIsCustom(true);
      onValueChange(customValue);
    } else {
      onValueChange(selectedValue as UserQuery);
      setIsCustom(false);
    }
  };

  const handleCustomInputChange = (inputValue: string) => {
    setCustomValue(inputValue);
    onValueChange(inputValue);
  };

  const handleModeToggle = () => {
    if (isCustom) {
      setIsCustom(false);
      onValueChange(predefinedQueries[0] || "");
    } else {
      setIsCustom(true);
      onValueChange(customValue);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className='flex items-center justify-between'>
        <Label htmlFor='query-selector'>Query Type</Label>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={handleModeToggle}
          className='text-xs'
        >
          {isCustom ? "Use presets" : "Write custom"}
        </Button>
      </div>

      {isCustom ? (
        <div className='space-y-2'>
          <Input
            id='query-selector'
            value={customValue}
            onChange={(e) => handleCustomInputChange(e.target.value)}
            placeholder='Enter your custom query...'
            className='w-full'
          />
          <div className='text-xs text-muted-foreground'>
            ✏️ Using custom query
          </div>
        </div>
      ) : (
        <div className='space-y-2'>
          <Select value={value} onValueChange={handlePredefinedSelect}>
            <SelectTrigger id='query-selector' className='w-full'>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {predefinedQueries.map((query) => (
                <SelectItem key={query} value={query} className='text-sm'>
                  {query}
                </SelectItem>
              ))}
              <SelectItem value='custom' className='text-sm font-medium'>
                ✏️ Write custom query...
              </SelectItem>
            </SelectContent>
          </Select>

          {value && isPredefinedQuery(value) && (
            <div className='text-xs text-muted-foreground'>
              📋 Using predefined query
            </div>
          )}
        </div>
      )}
    </div>
  );
}
