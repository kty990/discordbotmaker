import json

data = {
  "bots": {},
  "guildWhitelist": [],
  "username": None,
  "password": None
}

with open("./dist/auth.json","w") as file:
    file.write(json.dumps(data, indent=2)  )