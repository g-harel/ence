dir=./examples/

help:
	@echo "commands to manipulate the examples dir:"
	@echo "    make create a={{output-name}}"
	@echo "    make renum a={{source-num}} b={{output-num}}"
	@echo "    make rename a={{source-name}} b={{output-name}}"

a=
b=

create:
	@test -n "$(a)"
	$(file > $(dir)$(a).json)
	$(file > $(dir)$(a).out)

name=$(strip $(patsubst $(dir)$(a)-%.json, %, $(wildcard $(dir)$(a)-*.json)))
renum:
	@mv $(dir)$(a)-$(name).json $(dir)$(b)-$(name).json
	@mv $(dir)$(a)-$(name).out $(dir)$(b)-$(name).out

num=$(strip $(patsubst $(dir)%-$(a).json, %, $(wildcard $(dir)*-$(a).json)))
rename:
	@mv $(dir)$(num)-$(a).json $(dir)$(num)-$(b).json
	@mv $(dir)$(num)-$(a).out $(dir)$(num)-$(b).out
