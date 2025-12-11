#!/bin/bash

# Pre-commit hook to prevent committing sensitive files
# Install: cp scripts/pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

RED='\033[0;31m'
NC='\033[0m' # No Color

# List of patterns to check
FORBIDDEN_FILES=(
    "key.json"
    "terraform/terraform.tfvars"
    "*.tfstate"
    "*.tfstate.backup"
    ".env.local"
    ".env"
)

# Check for forbidden files
for pattern in "${FORBIDDEN_FILES[@]}"; do
    files=$(git diff --cached --name-only | grep "$pattern")
    if [ -n "$files" ]; then
        echo -e "${RED}❌ ERROR: Attempting to commit sensitive file(s):${NC}"
        echo "$files"
        echo ""
        echo "These files should not be committed to version control."
        echo "Please remove them from the commit:"
        echo "  git reset HEAD $files"
        exit 1
    fi
done

exit 0

