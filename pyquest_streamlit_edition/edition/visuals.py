"""Native interactive teaching diagrams. Never execute supplied lesson source."""
import math
import streamlit as st


def visualize(lesson):
    key=lesson['subtopic_id'];kind=lesson['visualization_type']
    st.subheader('Explore the concept',icon=':material/touch_app:')
    if kind=='strings':
        text=st.text_input('Text to explore','Python',max_chars=30,key=key+'_text')
        with st.container(horizontal=True):
            start=st.number_input('Start',min_value=-30,max_value=30,value=0,key=key+'_start')
            stop=st.number_input('Stop (excluded)',min_value=-30,max_value=30,value=len(text),key=key+'_stop')
            step=st.number_input('Step',min_value=-10,max_value=10,value=1,key=key+'_step')
        if step==0:st.error('Step cannot be zero.')
        else:
            chosen=set(range(len(text))[slice(start,stop,step)])
            st.dataframe([{'Character':char,'Index':i,'Negative index':i-len(text),'Selected':i in chosen} for i,char in enumerate(text)],hide_index=True,alt='String characters, indexes, and selected slice positions')
            st.code(repr(text[start:stop:step]),language=None,wrap_lines=True)
            st.caption('Try start=5, stop=-7, step=-1 for reverse slicing of Python.')
    elif kind=='types':
        types=[('int','Immutable','Whole numbers'),('float','Immutable','Approximate real numbers'),('complex','Immutable','Real and imaginary components'),('bool','Immutable','True / False'),('str','Immutable, ordered','Unicode text'),('list','Mutable, ordered','Duplicates allowed'),('tuple','Immutable, ordered','Duplicates allowed; hashable only if its elements are'),('set','Mutable, unordered','Unique hashable items'),('frozenset','Immutable, unordered','Unique hashable items'),('dict','Mutable, insertion order','Unique hashable keys'),('range','Immutable, ordered','Arithmetic integer sequence'),('bytes','Immutable, ordered','Byte values'),('bytearray','Mutable, ordered','Byte values'),('memoryview','Depends on buffer','Buffer view'),('NoneType','Immutable','Absence')]
        name=st.selectbox('Compare a Python type',[row[0] for row in types],key=key+'_type')
        row=next(row for row in types if row[0]==name);st.text(' · '.join(row))
        with st.expander('All type comparisons'):
            st.table([{'Type':row[0],'Behavior':row[1],'Use':row[2]} for row in types],alt='Python type behavior comparison')
    elif kind in ('operators','decision'):
        number=st.number_input('Value',min_value=-1000,max_value=1000,value=7,key=key+'_value')
        if kind=='decision':
            st.code(f'{number} >= 9? {number>=9}\n{number} >= 5? {number>=5}\nBranch: '+('Excellent' if number>=9 else 'Pass' if number>=5 else 'Retry'),language=None)
            st.caption('if/elif/else checks branches in order and chooses the first true branch.')
        else:st.code(f'{number} + 2 = {number+2}\n{number} // 2 = {number//2}\n{number} % 2 = {number%2}\n{number} >= 5 = {number>=5}\n{number} & 1 = {number&1}',language=None)
    elif kind=='loop':
        with st.container(horizontal=True):
            rows=st.slider('Rows',1,5,2,key=key+'_rows');columns=st.slider('Columns',1,5,3,key=key+'_cols')
        st.code('\n'.join(' → '.join(f'({r}, {c})' for c in range(columns)) for r in range(rows)),language=None,wrap_lines=True)
        st.caption(f'Outer loop: rows. Inner loop: columns. Total: {rows*columns} inner iterations.')
    elif lesson['world_id']=='W11':
        values=[1,3,5,7,9]
        target=st.number_input('Search target',-10,20,5,key=key+'_target')
        method=st.segmented_control('Search method',['Linear','Binary'],default='Linear',key=key+'_method')
        visited=[];found=None
        if method=='Binary':
            lo,hi=0,len(values)-1
            while lo<=hi:
                mid=(lo+hi)//2;visited.append(mid)
                if values[mid]==target:found=mid;break
                if values[mid]<target:lo=mid+1
                else:hi=mid-1
        else:
            for i,value in enumerate(values):
                visited.append(i)
                if value==target:found=i;break
        st.code(f'Values: {values}\nVisited indexes: {visited}\nResult: {found if found is not None else "not found"}',language=None)
        st.caption('Binary search requires sorted data.')
    elif kind=='structure' and key in ('W09_LINKED_LIST','W09_APPLICATIONS'):
        position=st.slider('Current node',0,3,0,key=key+'_node')
        nodes=['head: 1','node: 2','node: 3','None']
        st.code(' → '.join(('[current] ' if i==position else '')+node for i,node in enumerate(nodes)),language=None,wrap_lines=True)
    elif kind=='structure':
        method=st.segmented_control('Removal order',['Stack (LIFO)','Queue (FIFO)'],default='Stack (LIFO)',key=key+'_structure')
        removed=st.slider('Remove items',0,3,0,key=key+'_removed')
        items=['A','B','C'];order=list(reversed(items)) if method=='Stack (LIFO)' else items
        st.code(f'Added: {items}\nRemoved: {order[:removed]}\nRemaining: {items[:3-removed] if method=="Stack (LIFO)" else items[removed:]}',language=None)
    elif kind=='algorithm':
        comparisons=st.slider('Bubble-sort comparisons',0,3,0,key=key+'_comparisons')
        values=[3,1,2]
        for i in [0,1,0][:comparisons]:
            if values[i]>values[i+1]:values[i],values[i+1]=values[i+1],values[i]
        st.code(str(values),language=None);st.caption('Compare adjacent values and swap when out of order.')
    elif lesson['world_id']=='W13':
        with st.container(horizontal=True):
            a=st.slider('Object A value',0,5,0,key=key+'_a');b=st.slider('Object B value',0,5,0,key=key+'_b')
        st.code(f'Counter class → object A: {a}\nCounter class → object B: {b}',language=None)
        st.caption('Instances share class behavior but keep their own instance state.')
    else:
        lines=lesson['visualization_data']['steps']
        count=st.slider('Reveal example lines',0,len(lines),min(1,len(lines)),key=key+'_trace')
        st.code('\n'.join(lines[:count]) or '# Move the slider to reveal the example.',language='python',wrap_lines=True)
        if count==len(lines):st.text('Expected result: '+lesson['visualization_data']['result'])
        st.caption('This is a static example walkthrough. Challenge execution uses the trusted grading engine.')
    if key=='W02_FLOAT':
        number=st.number_input('Rounding value',min_value=-100.0,max_value=100.0,value=-2.5,step=0.5,key=key+'_rounding')
        st.code(f'math.floor({number}) = {math.floor(number)}\nmath.ceil({number}) = {math.ceil(number)}\nround({number}) = {round(number)}',language='python')
        st.caption('floor rounds toward negative infinity; round uses ties to even. Binary floating-point representation can affect decimal rounding.')
