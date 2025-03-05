#!/bin/bash

tree -a src/ > project_structure.txt

echo -e "\nСодержимое файлов:\n==================" >> project_structure.txt

find src/ -type f \
  -not -path "*/assets/*" \
  -not -name "*.png" \
  -not -name "*.jpg" \
  -not -name "*.jpeg" \
  -not -name "*.gif" \
  -not -name "*.svg" \
  -not -name "*.ico" \
  -not -name "*.webp" \
  -not -name "*.avif" \
  -not -name "*.bmp" \
  -not -name "favicon.*" \
  -exec echo -e "\n--- {} ---" \; \
  -exec cat {} \; \
  -exec echo -e "-----------------" \; >> project_structure.txt
