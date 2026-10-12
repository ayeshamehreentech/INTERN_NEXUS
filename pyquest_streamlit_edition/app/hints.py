"""Bounded non-executable hints. No solution is passed into generation."""
import re

class HintGuard:
    def accept(self,text):
        return isinstance(text,str) and 0<len(text)<350 and not re.search(r'```|\n|\b(print|input|exec|eval)\s*\(|^\s*(for|while|def|class)\b|\w\s*=',text)

class HintAgent:
    def hint(self,question,number):
        clues=[question.hint_seed,
            'Separate the task into its inputs, the transformation required, and its output. Work through one example by hand.',
            'Plan three steps: read or define the values; apply the requested operation; display exactly the requested result. Compare punctuation and spacing.']
        text=clues[min(number-1,2)]
        return text if HintGuard().accept(text) else 'Review the selected concept and compare the required input and output before writing the next step.'
