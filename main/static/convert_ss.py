import json
import os
from pathlib import Path
import codecs

# Request a file name from the user
#files gear_1.json 
#filename = input('Enter the name of the JSON file: ').trim()
filename_in = 'cherry_1.json'
filename_out = 'cherry_1_animated.json'

# Open the JSON file
with open(Path(__file__).with_name(filename_in), 'r') as f:

    data = f.read()

    print(data)

    data = json.loads(data.encode().decode('utf-8-sig') )

    data_dict = dict(data)

    data_dict['animations'] = {"walk":[]}

    for i in data_dict['frames']:
         data_dict['animations']["walk"].append(i)

with open(Path(__file__).with_name(filename_out), "w") as outfile:
    json.dump(data_dict, outfile)

