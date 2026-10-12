export function difficultySupport(recent,topic){
 let failures=0;
 for(const attempt of recent||[]){if(attempt.topic!==topic)continue;if(attempt.correct)break;failures++;}
 return failures>=2?`${failures} recent tries on this topic have not passed yet. Compare one example input with your output, trace each line, and change one thing at a time. Review Concept or request a hint when you need a smaller step.`:null;
}
