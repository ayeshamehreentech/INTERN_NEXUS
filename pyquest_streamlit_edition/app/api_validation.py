"""Small explicit request boundary. Reward fields are never client inputs."""
def validate_payload(value):
    if not isinstance(value,dict):raise ValueError('Expected a JSON object')
    allowed={'topic','session_id','question_id','code','operation_id','inputs','confirmed','settings'}
    if set(value)-allowed:raise ValueError('Unsupported request fields')
    for key,limit in [('topic',120),('session_id',100),('question_id',200),('operation_id',128),('code',4000)]:
        if key in value and (not isinstance(value[key],str) or len(value[key])>limit):
            raise ValueError('Invalid '+key)
    if 'inputs' in value:
        inputs=value['inputs']
        if not isinstance(inputs,list) or len(inputs)>10 or any(not isinstance(x,str) or len(x)>2000 for x in inputs):
            raise ValueError('Use at most ten input lines of 2,000 characters each.')
    return value
