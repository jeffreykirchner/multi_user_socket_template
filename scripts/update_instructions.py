from main.models import Session
from main.models import InstructionSet

print("Enter session ids, comma separated")
session_ids = input().split(',')
print("Enter instruction set id")
instruction_set_id = int(input())

#parameter set player instructions
for i in range(len(session_ids)):
    session = Session.objects.get(id=session_ids[i])
    parameter_set_players = session.parameter_set.parameter_set_players.update(instruction_set=InstructionSet.objects.get(id=instruction_set_id))
    session.parameter_set.json(update_required=True)
