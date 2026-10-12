"""Canonical A4.1 curriculum source."""
def _q(sid,title):
 qid=f'{sid}_Q001';return {'question_id':qid,'id':qid,'title':title,'task':f'Practice {title}.','prompt':f'Practice {title}.','starter':'# Write your code here','solution':f'print("{title}")','hint':'Use print() with quotation marks.','required':['print'],'inputs':[],'expected':title}
def _s(sid,title):return {'subtopic_id':sid,'id':sid,'title':title,'board_title':title.upper(),'teaching':f'{title} is a Python concept.','example':f'print("{title}")','example_output':title,'chapters':[],'questions':[_q(sid,title)]}
groups=[('W01','I/O Harbor','Basic Input / Output',[('PRINT','print()'),('INPUT','input()'),('FSTRINGS','f-strings')]),('W02','Variable Valley','Variables and Data Types',[(a,b) for a,b in [('VARIABLES','variables'),('INT','int'),('FLOAT','float'),('COMPLEX','complex'),('STR','str'),('LIST','list'),('TUPLE','tuple'),('RANGE','range'),('DICT','dict'),('SET','set'),('FROZENSET','frozenset'),('BOOL','bool'),('BYTES','bytes'),('BYTEARRAY','bytearray'),('MEMORYVIEW','memoryview'),('NONE','None')]]),('W03','Type Forge','Naming and Type Conversion',[(a,b) for a,b in [('NAMING_CONVENTIONS','variable naming conventions'),('VALID_IDENTIFIERS','valid identifiers'),('INVALID_IDENTIFIERS','invalid identifiers'),('KEYWORDS','Python keywords'),('CASE_SENSITIVITY','case sensitivity'),('MEANINGFUL_NAMES','meaningful variable names'),('TYPE_CASTING','type casting'),('INT_CONVERSION','int() conversion'),('FLOAT_CONVERSION','float() conversion'),('STR_CONVERSION','str() conversion'),('BOOL_CONVERSION','bool() conversion'),('CONVERSION_ERRORS','conversion errors')]]),('W04','Operator City','Operators',[(a,b) for a,b in [('ASSIGNMENT','assignment operators'),('ARITHMETIC','arithmetic operators'),('COMPARISON','comparison operators'),('LOGICAL','logical operators'),('IDENTITY','identity operators'),('PRECEDENCE','operator precedence'),('MEMBERSHIP','membership operators')]]),('W05','Decision Forest','Decision Making',[(a,b) for a,b in [('IF','if'),('IF_ELSE','if...else'),('IF_ELIF_ELSE','if...elif...else'),('LADDER_IF','ladder if'),('NESTED_IF','nested if'),('NESTED_IF_ELSE','nested if...else'),('MULTIPLE_CONDITIONS','multiple conditions')]]),('W06','Loop Galaxy','Loops',[(a,b) for a,b in [('FOR','for loop'),('RANGE','range()'),('FOR_RANGE','for with range'),('WHILE','while loop'),('NESTED_LOOPS','nested loops'),('BREAK','break'),('CONTINUE','continue'),('BREAK_FOR','break with for'),('BREAK_WHILE','break with while'),('CONTINUE_FOR','continue with for'),('CONTINUE_WHILE','continue with while')]]),('W07','String Kingdom','Strings',[(a,b) for a,b in [('INTRODUCTION','string introduction'),('SINGLE_LINE','single-line strings'),('MULTILINE','multiline strings'),('SINGLE_QUOTES','single quotes'),('DOUBLE_QUOTES','double quotes'),('TRIPLE_QUOTES','triple quotes'),('ACCESS_CHARACTERS','accessing characters'),('POSITIVE_INDEXING','positive indexing'),('NEGATIVE_INDEXING','negative indexing'),('SLICING','slicing'),('STEP_SLICING','step slicing'),('CONCATENATION','concatenation'),('REPETITION','repetition'),('LENGTH','length'),('ESCAPE_SEQUENCES','escape sequences'),('RAW_STRINGS','raw strings'),('PERCENT_FORMATTING','percent formatting'),('FORMAT_METHOD','format()'),('FSTRING_FORMATTING','f-string formatting')]])]
WORLDS=[]
for wid,game,curr,items in groups:
 w={'world_id':wid,'id':wid,'game_title':game,'title':game,'curriculum_title':curr,'topics':[_s(f'{wid}_{sid}',title) for sid,title in items]};WORLDS.append(w)
 for s in w['topics']:
  s.update(world_id=wid,world=wid,level=wid)
  for q in s['questions']:q.update(topic=s['subtopic_id'],world_id=wid,level=wid)
from app.legacy_story import EXERCISES
LEGACY_CONTENT_MAP={0:'W01_PRINT',1:'W01_FSTRINGS',2:'W01_FSTRINGS',3:'W01_INPUT',4:'W02_VARIABLES',5:'W02_VARIABLES',6:'W07_ESCAPE_SEQUENCES',7:'W07_FORMAT_METHOD'}
for old in EXERCISES:
 sid=LEGACY_CONTENT_MAP.get(old['chapter'])
 if sid:
  target=next(s for w in WORLDS for s in w['topics'] if s['subtopic_id']==sid)
  qid=f'{sid}_Q{old["id"]+2:03d}'
  target['questions'].append({'question_id':qid,'id':qid,'title':old['title'],'task':old['task'],'prompt':old['task'],'starter':old['starter'],'solution':old['solution'],'hint':old['hint'],'required':old.get('required',[]),'inputs':old.get('inputs',[]),'expected':'','topic':sid,'world_id':sid[:3],'level':sid[:3]})
LEGACY_SUBTOPIC_ID_MAP={'1-1':'W01_PRINT','1-2':'W01_INPUT','1-3':'W01_FSTRINGS','2-1':'W02_VARIABLES','3-1':'W04_ARITHMETIC'}
TOPICS={s['subtopic_id']:s for w in WORLDS for s in w['topics']};TASKS={q['question_id']:q for s in TOPICS.values() for q in s['questions']};LEVELS=WORLDS
# Read-only compatibility aliases for clients from the previous release. The
# canonical objects and IDs above remain authoritative.
for old,new in LEGACY_SUBTOPIC_ID_MAP.items():
 if new in TOPICS: TOPICS[old]=TOPICS[new]
for old,sub in list(TOPICS.items()):
 if old in LEGACY_SUBTOPIC_ID_MAP:
  canonical=LEGACY_SUBTOPIC_ID_MAP[old]
  for i,q in enumerate(TOPICS[canonical]['questions'],1): TASKS[f'{old}-{i}']=q
def public_catalog():
 return [{k:v for k,v in w.items() if k!='topics'}|{'topics':[{k:v for k,v in s.items() if k!='questions'}|{'questions':[{k:v for k,v in q.items() if k not in ('solution','hint','required','expected','inputs','starter')} for q in s['questions']]} for s in w['topics']]} for w in WORLDS]
