import json

class TimeMixin():
    '''
    time mixin for subject home consumer
    '''

    async def update_time(self, event):
        '''
        update running, phase and time status
        '''

        event_data = json.loads(event["group_data"])

        #remove other player earnings
        # for session_players_earnings in event_data["result"]["session_player_earnings"]:
        #     if session_players_earnings["id"] == self.session_player_id:
        #         event_data["result"]["session_player_earnings"] = session_players_earnings
        #         break
        
        #remove none group memebers
        # session_players = []
        # for session_player in event_data["result"]["session_players"]:
        #     session_players.append(session_player)

        # event_data["result"]["session_players"] = session_players

        await self.send_message(message_to_self=event_data, message_to_subjects=None, message_to_staff=None, 
                                message_type=event['type'], send_to_client=True, send_to_group=False)

