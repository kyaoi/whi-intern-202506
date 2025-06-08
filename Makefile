.PHONY: format-back
format-back:
	(cd backend-ts && npx @biomejs/biome format --write .)

.PHONY: format-front
format-front:
	(cd frontend && npx @biomejs/biome format --write .)

.PHONY: format
format: format-back format-front
