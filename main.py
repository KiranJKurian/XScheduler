import json
import datetime

import flask
import httplib2

from apiclient import discovery
from oauth2client import client

SCOPES = 'https://www.googleapis.com/auth/calendar'
CLIENT_SECRET_FILE = 'client_secrets.json'
APPLICATION_NAME = 'XScheduler'

def main(service, inputJSON):
	inputDict=json.loads(inputJSON)
	returnDict={"events":[],"error":"None"}
	
	now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
   	print 'Getting the upcoming 10 events'
	eventsResult = service.events().list(
        calendarId='primary', timeMin=now, maxResults=10, singleEvents=True,
        orderBy='startTime').execute()
	events = eventsResult.get('items', [])

	if not events:
		print 'No upcoming events found.'
	for event in events:
		start = event['start'].get('dateTime', event['start'].get('date'))
		end = event['end'].get('dateTime', event['end'].get('date'))
		print start, event['summary'], end
		returnDict["events"].append("<b>%s</b><br>%s  <b>-</b>  %s<br>"%(event['summary'],start,end))
	return json.dumps(returnDict)
  


if __name__ == '__main__':
    inputDict={"classInfo":[{"subNum":"190","courseNum":"206","sectionNum":"1"}],"school":"NB","reminders":[True,True,True,False]}
    inputJSON=json.dumps(inputDict)
    print(main(inputJSON))