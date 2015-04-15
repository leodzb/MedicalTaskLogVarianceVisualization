#author: Yang Li
#subject: process data from athena
import pandas as pd
import numpy as np
import datetime

def createDateList(startDate, endDate, format):
	start = datetime.datetime.strptime(startDate, format)
	end = datetime.datetime.strptime(endDate, format)
	date_generated = [start + datetime.timedelta(days=x) for x in range(0, (end-start).days+1)]
	return date_generated	

data = pd.read_csv('SI649athena.csv')
cols = ['departmentid', 'encounterdate', 'encountertask']
# cols = ['encounterdate', 'encountertask']
data = data[cols]
data = data.dropna(how='any')
# print data.shape
# groupby col
newdata = data.groupby(cols).apply(lambda x: x['encountertask'].count())
newdata.to_csv('athena_perid.csv',header=True)


data = pd.read_csv('athena_perid.csv')
newcols = ['dep_id', 'key','value','date']
data.columns = ['dep_id', 'date', 'key', 'value']
print data.shape
# Get a list of date from begining to end 
data = data.sort('date', ascending=1)
startDate = data['date'].iloc[0]
endDate = data['date'].iloc[-1]
date_generated = createDateList(startDate, endDate, "%m/%d/%y")
date_lis = []
for date in date_generated:
    date_lis.append(date.strftime("%m/%d/%y"))
id_lis = data['dep_id'].unique()
key_lis = data['key'].unique()
for myid in id_lis:
	sliced = data[data['dep_id']==myid]
	for key in key_lis:
		sliced2 = sliced[sliced['key']==key]
		for date in date_lis:
			if date not in sliced2['date'].tolist():
				newrow = pd.DataFrame([[myid, key, 0, date]],columns= newcols)
				data=data.append(newrow,ignore_index=True)
							
data = data.sort(['dep_id','key', 'date'], ascending=[1, 1, 1])
data = data[newcols]

data.to_csv('athena_perid.csv', index=False)
