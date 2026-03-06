"use client";

import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { SkillTag } from "./SkillTag";

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  maxSkills?: number;
  placeholder?: string;
  suggestions?: string[];
}

export function SkillsInput({
  skills,
  onChange,
  maxSkills = 10,
  placeholder = "VD: React Developer, UI/UX Designer, Marketing...",
  suggestions = [],
}: SkillsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addSkill = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (skills.length >= maxSkills) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;

    onChange([...skills, trimmed]);
    setInputValue("");
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && skills.length > 0) {
      removeSkill(skills.length - 1);
    }
  };

  const unusedSuggestions = suggestions.filter(
    (s) => !skills.some((skill) => skill.toLowerCase() === s.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <SkillTag
            key={index}
            skill={skill}
            onRemove={() => removeSkill(index)}
          />
        ))}
      </div>

      {skills.length < maxSkills ? (
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="mt-2"
        />
      ) : (
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Reached the limit of {maxSkills} skills
        </p>
      )}

      {unusedSuggestions.length > 0 && skills.length < maxSkills && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {unusedSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addSkill(suggestion)}
                className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors min-h-[28px]"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
